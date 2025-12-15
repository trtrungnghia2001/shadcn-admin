import { Button } from "@/components/ui/button";
import { useCall, type Peer } from "../data/CallContext";
import { useEffect, useRef } from "react";

export const VideoCallBox = () => {
  const { localStream, peers, acceptCall, endCall, receivingCallFrom } =
    useCall();

  const peerIds = Object.keys(peers);
  if (peerIds.length === 0 && !receivingCallFrom) return null;

  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">
      {peerIds.map((peerId) => (
        <PeerVideo
          key={peerId}
          peerId={peerId}
          peer={peers[peerId]}
          localStream={localStream}
          receivingCallFrom={receivingCallFrom}
          acceptCall={acceptCall}
          endCall={endCall}
        />
      ))}
    </div>
  );
};
interface PeerVideoProps {
  peerId: string;
  peer: Peer;
  localStream: MediaStream | null;
  receivingCallFrom: string | null;
  acceptCall: (peerId: string) => void;
  endCall: (peerId: string) => void;
}
const PeerVideo: React.FC<PeerVideoProps> = ({
  peerId,
  peer,
  localStream,
  receivingCallFrom,
  acceptCall,
  endCall,
}) => {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  // bind local stream
  useEffect(() => {
    if (localRef.current && localStream) {
      localRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // bind remote stream (bind 1 lần)
  useEffect(() => {
    if (remoteRef.current && peer.remoteStreamRef.current) {
      remoteRef.current.srcObject = peer.remoteStreamRef.current;
    }
  }, [peer]);

  return (
    <div className="w-xs border bg-muted p-3 flex flex-col gap-3 shadow-lg rounded-lg">
      <div className="flex gap-3 relative">
        <video
          ref={localRef}
          autoPlay
          muted
          playsInline
          className="absolute bottom-2 right-2 w-20 aspect-video object-cover border border-gray-700 rounded"
        />

        <video
          ref={remoteRef}
          autoPlay
          playsInline
          className="w-full aspect-video object-cover border border-gray-700 rounded"
        />
      </div>

      <div className="flex gap-3 items-center justify-center">
        {!peer.inCall && receivingCallFrom === peerId && (
          <Button size="sm" onClick={() => acceptCall(peerId)}>
            Accept
          </Button>
        )}

        <Button size="sm" variant="destructive" onClick={() => endCall(peerId)}>
          End Call
        </Button>
      </div>
    </div>
  );
};
