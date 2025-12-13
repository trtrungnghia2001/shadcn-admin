import { useVideoCall } from "../data/videoCall.context";

const VideoCall = () => {
  const { callActive, incomingCaller, endCall, acceptCall } = useVideoCall();

  if (!callActive && !incomingCaller) return null;

  return (
    <div className="fixed top-5 right-5 p-4 border border-gray-300 bg-white rounded shadow-lg w-72">
      {incomingCaller ? (
        <>
          <h4 className="text-lg font-semibold mb-3">
            Incoming call from {incomingCaller}
          </h4>
          <div className="flex justify-between">
            <button
              onClick={acceptCall}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Accept
            </button>
            <button
              onClick={endCall}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Decline
            </button>
          </div>
        </>
      ) : (
        <>
          <h4 className="text-lg font-semibold mb-3">In Call</h4>
          <button
            onClick={endCall}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            End Call
          </button>
        </>
      )}
    </div>
  );
};

export default VideoCall;
