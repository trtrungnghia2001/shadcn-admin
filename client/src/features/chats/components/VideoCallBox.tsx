import { useEffect, useRef } from "react";
import { useVideoCall } from "../data/VideoCallContext";

export const VideoCallBox = () => {
  const {
    callState,
    localStream,
    remoteStream,
    endCall,
    acceptCall,
    rejectCall,
  } = useVideoCall();

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localRef.current && localStream) {
      localRef.current.srcObject = localStream;
      localRef.current
        .play()
        .catch((err) => console.error("Error playing local video:", err));
    }
  }, [localStream]);

  useEffect(() => {
    if (!remoteRef.current) return;
    const videoEl = remoteRef.current;

    if (remoteStream) {
      videoEl.srcObject = remoteStream;
      const handleLoadedMetadata = () => {
        videoEl.play().catch((err) => {
          if (err.name !== "AbortError")
            console.error("Error playing remote video:", err);
        });
      };
      videoEl.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () =>
        videoEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
    } else {
      // Cleanup khi call end
      videoEl.pause();
      videoEl.srcObject = null;
    }
  }, [remoteStream]);

  if (callState === "idle") return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="relative w-[800px] h-[450px] bg-black rounded-xl overflow-hidden">
        {/* Remote video */}
        <video
          className="img"
          playsInline
          muted // tạm thời để Chrome autoplay, bỏ khi test audio
          controls={false}
          ref={remoteRef}
        />

        {/* Local video */}
        <video
          ref={localRef}
          className="absolute bottom-4 right-4 w-40 h-28 rounded-lg border object-cover"
          autoPlay
          playsInline
          muted
        />

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {callState === "incoming" && (
            <>
              <button
                onClick={acceptCall}
                className="px-4 py-2 bg-green-600 text-white rounded-full"
              >
                Accept
              </button>
              <button
                onClick={rejectCall}
                className="px-4 py-2 bg-red-600 text-white rounded-full"
              >
                Reject
              </button>
            </>
          )}
          {(callState === "in-call" || callState === "calling") && (
            <button
              onClick={endCall}
              className="px-4 py-2 bg-red-600 text-white rounded-full"
            >
              End Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
