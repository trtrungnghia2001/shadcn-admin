import { useEffect, useRef } from "react";
import { useVideoCall } from "../data/VideoCallContext";

export const VideoCallBox = () => {
  const { callState, localStream, remoteStream, endCall } = useVideoCall();

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localRef.current && localStream) {
      localRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteRef.current && remoteStream) {
      remoteRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (callState === "idle") return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="relative w-[800px] h-[450px] bg-black rounded-xl overflow-hidden">
        {/* Remote video */}
        <video
          ref={remoteRef}
          autoPlay
          className="w-full h-full object-cover"
        />

        {/* Local video (small) */}
        <video
          ref={localRef}
          autoPlay
          muted
          className="absolute bottom-4 right-4 w-40 h-28 rounded-lg border object-cover"
        />

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <button
            onClick={endCall}
            className="px-4 py-2 bg-red-600 text-white rounded-full"
          >
            End Call
          </button>
        </div>
      </div>
    </div>
  );
};
