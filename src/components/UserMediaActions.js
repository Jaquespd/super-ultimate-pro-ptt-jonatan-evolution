import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

function isEnabled(aggregator, track) {
  return aggregator && track.enabled;
}

function UserMediaActions({ stream, ...props }) {
  const [hasAudio, setAudio] = useState(
    stream ? stream.getAudioTracks().reduce(isEnabled, true) : true
  );

  useEffect(() => {
    handleToggleAudioOff();
  },[]);

  useEffect(() => {
    if (!stream) {
      return;
    }
    stream.getAudioTracks().forEach(function(track) {
      track.enabled = hasAudio;
    });
  }, [stream, hasAudio]);

  const handleToggleAudioOn = () => {
    setAudio(() => true);
  };
  
  const handleToggleAudioOff = () => {
    setAudio(() => false);
  };

  return (
    <div className="btn-group" role="group" aria-label="Controls" {...props}>
      {stream && (
        <button
          type="button"
          title="Toggle microphone"
          className={"btn btn-outline-" + (hasAudio ? "success" : "danger")}
          onMouseDown={handleToggleAudioOn}
          onMouseUp={handleToggleAudioOff}
        >
          PTT
        </button>
      )}
    </div>
  );
}

UserMediaActions.propTypes = {
  stream: PropTypes.object
};

export default UserMediaActions;
