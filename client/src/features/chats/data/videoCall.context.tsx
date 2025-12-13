import { socket } from "@/lib/socket";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface VideoCallContextProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startCall: (partnerId: string) => Promise<void>;
  endCall: () => void;
  callActive: boolean; // trạng thái hiển thị box gọi
  incomingCaller?: string; // ai đang gọi
  acceptCall?: () => void; // nhận cuộc gọi
}

const VideoCallContext = createContext<VideoCallContextProps | null>(null);
export const useVideoCall = () => {
  const ctx = useContext(VideoCallContext);
  if (!ctx)
    throw new Error("useVideoCall must be used inside VideoCallProvider");
  return ctx;
};

export const VideoCallProvider = ({ children }: { children: ReactNode }) => {
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const [callActive, setCallActive] = useState(false);
  const [incomingCaller, setIncomingCaller] = useState<string | null>(null);

  const createPeer = () => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peer.onicecandidate = (e) => {
      if (e.candidate) socket.emit("iceCandidate", e.candidate);
    };

    const remote = new MediaStream();
    setRemoteStream(remote);

    peer.ontrack = (event) => {
      event.streams[0].getTracks().forEach((t) => remote.addTrack(t));
    };

    return peer;
  };

  const startCall = async (partnerId: string) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);

    const peer = createPeer();
    peerRef.current = peer;

    stream.getTracks().forEach((t) => peer.addTrack(t, stream));

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit("offer", { offer, to: partnerId });
    setCallActive(true);
  };

  const acceptCall = async () => {
    if (!incomingCaller) return;
    setCallActive(true);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);

    const peer = createPeer();
    peerRef.current = peer;

    stream.getTracks().forEach((t) => peer.addTrack(t, stream));

    const offer = peerRef.current?.remoteDescription;
    if (!offer) return;

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("answer", { answer, to: incomingCaller });
    setIncomingCaller(null);
  };

  const endCall = () => {
    peerRef.current?.close();
    peerRef.current = null;

    localStream?.getTracks().forEach((t) => t.stop());
    remoteStream?.getTracks().forEach((t) => t.stop());

    setLocalStream(null);
    setRemoteStream(null);
    setCallActive(false);
    setIncomingCaller(null);
  };

  useEffect(() => {
    // socket.on("offer", ({ offer, from }) => {
    //   setIncomingCaller(from);
    // });

    socket.on("answer", async ({ answer }) => {
      const peer = peerRef.current;
      if (!peer) return;
      await peer.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("iceCandidate", async (candidate) => {
      try {
        await peerRef.current?.addIceCandidate(candidate);
      } catch (error) {
        console.error("Lỗi add candidate", error);
      }
    });
  }, []);

  return (
    <VideoCallContext.Provider
      value={{
        localStream,
        remoteStream,
        startCall,
        endCall,
        callActive,
        incomingCaller: incomingCaller || undefined,
        acceptCall,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};
