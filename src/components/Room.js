import React, { useRef, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { usePeerData } from "react-peer-data";
import UserMediaActions from "components/UserMediaActions";
import ParticipantList from "components/ParticipantList";
import Video from "components/Video";

// import styles from "components/Room.module.scss";

const initialState = { participants: {}, streams: {} };

function reducer(state, action) {
  switch (action.type) {
    case "connect":
      return {
        participants: {
          ...state.participants,
          [action.participantId]: action.participant
        },
        streams: state.streams
      };
    case "disconnect":
      const {
        [action.participantId]: omitParticipant,
        ...participants
      } = state.participants;
      const { [action.participantId]: omitStream, ...streams } = state.streams;

      return {
        participants,
        streams
      };
    case "addStream":
      return {
        streams: { ...state.streams, [action.participantId]: action.stream },
        participants: state.participants
      };
    default:
      throw new Error("Invalid action type");
  }
}

function Room({ name, username, stream }) {
  const room = useRef();
  const peerData = usePeerData();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (room.current) return;

    room.current = peerData.connect(name, stream);
    room.current
      .on("participant", participant => {
        dispatch({
          type: "connect",
          participantId: participant.id,
          participant: participant
        });

        participant
          .on("disconnected", () =>
            dispatch({ type: "disconnect", participantId: participant.id })
          )
          .on("track", event =>
            dispatch({
              type: "addStream",
              participantId: participant.id,
              stream: event.streams[0]
            })
          )
          .on("error", event => {
            console.error("peer", participant.id, event);
            participant.renegotiate();
          });
      })
      .on("error", event => {
        console.error("room", name, event);
      });

    return () => room.current.disconnect();
  }, [name, peerData, stream]);

  const { participants, streams } = state;

  return (
    <div className="row">
      {stream && (
        <Video stream={stream} autoPlay muted className={"styles.webcam"} />
      )}
      <div className={`sticky-top mt-2 mb-2 text-center`}>
        <UserMediaActions stream={stream} />
      </div>
      <div className={"col-md-9"}>
        <ParticipantList participants={participants} streams={streams} />
      </div>
    </div>
  );
}

Room.propTypes = {
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  stream: PropTypes.object
};

export default Room;
