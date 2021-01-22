import React from "react";
import {
  useUserMediaFromContext
} from "@vardius/react-user-media";
import Room from "components/Room";

function App() {
  const { stream } = useUserMediaFromContext();

  return (
    <div className="container-fluid">
      { stream && <Room name={"room"} username={"username"} stream={stream} />}
    </div>
  );
}

export default App;
