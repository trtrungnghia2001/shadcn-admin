import { Button } from "@/components/ui/button";
import { useCall } from "../data/CallContext";

export const VideoCallBox = () => {
  const { localStream, peers, acceptCall, endCall, receivingCallFrom } =
    useCall();

  const peerIds = Object.keys(peers);
  if (peerIds.length === 0 && !receivingCallFrom) return null;

  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">
      {peerIds.map((peerId) => {
        const peer = peers[peerId];
        return (
          <div
            key={peerId}
            className="w-96 border bg-muted p-3 flex flex-col gap-3 shadow-lg rounded-lg"
          >
            <div className="flex gap-3 relative">
              <video
                autoPlay
                muted
                playsInline
                ref={(v) => {
                  if (v && localStream) {
                    v.srcObject = localStream;
                  }
                }}
                className="absolute bottom-2 right-2 w-20 aspect-video object-cover border border-gray-700 rounded"
              />
              <video
                autoPlay
                playsInline
                ref={(v) => {
                  if (v) v.srcObject = peer.remoteStream;
                }}
                className="w-full aspect-video object-cover border border-gray-700 rounded"
              />
            </div>

            <div className="flex gap-3 items-center justify-center">
              {!peer.inCall && receivingCallFrom === peerId && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => acceptCall(peerId)}
                >
                  Accept
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => endCall(peerId)}
              >
                End Call
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
