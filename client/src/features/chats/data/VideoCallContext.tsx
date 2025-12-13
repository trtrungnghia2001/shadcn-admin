import { createContext, useContext, useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";

type CallState = "idle" | "calling" | "incoming" | "in-call";

type VideoCallContextType = {
  callState: CallState;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startCall: (targetId: string) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
};

const VideoCallContext = createContext<VideoCallContextType | null>(null);

export const VideoCallProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [callState, setCallState] = useState<CallState>("idle");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const targetIdRef = useRef<string | null>(null);
  const pendingOfferRef = useRef<RTCSessionDescriptionInit | null>(null);

  // ================= WEBRTC PEER CREATION =================
  const createPeer = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && targetIdRef.current) {
        socket.emit("ice-candidate", {
          to: targetIdRef.current,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE state:", pc.iceConnectionState);
    };

    return pc;
  };

  const initPeer = async () => {
    if (peerRef.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);

    peerRef.current = createPeer();

    stream
      .getTracks()
      .forEach((track) => peerRef.current!.addTrack(track, stream));
  };

  // ================= SOCKET LISTENERS =================
  useEffect(() => {
    const onOffer = async ({
      offer,
      from,
    }: {
      offer: RTCSessionDescriptionInit;
      from: string;
    }) => {
      targetIdRef.current = from;
      pendingOfferRef.current = offer;
      setCallState("incoming");
      console.log("Incoming call from:", from, offer);
    };

    const onAnswer = async ({
      answer,
    }: {
      answer: RTCSessionDescriptionInit;
    }) => {
      if (!peerRef.current) return;
      await peerRef.current.setRemoteDescription(answer);
      setCallState("in-call");
      console.log("Call connected, remote answer applied");
    };

    const onIceCandidate = async ({
      candidate,
    }: {
      candidate: RTCIceCandidateInit;
    }) => {
      if (!peerRef.current) return;
      try {
        await peerRef.current.addIceCandidate(candidate);
      } catch (err) {
        console.log("Failed addIceCandidate:", err);
      }
    };

    socket.on("offer", onOffer);
    socket.on("answer", onAnswer);
    socket.on("ice-candidate", onIceCandidate);

    return () => {
      socket.off("offer", onOffer);
      socket.off("answer", onAnswer);
      socket.off("ice-candidate", onIceCandidate);
    };
  }, []);

  // ================= ACTIONS =================
  const startCall = async (targetId: string) => {
    targetIdRef.current = targetId;
    setCallState("calling");

    await initPeer();

    const offer = await peerRef.current!.createOffer();
    await peerRef.current!.setLocalDescription(offer);

    socket.emit("offer", { to: targetId, offer });
  };

  const acceptCall = async () => {
    if (!pendingOfferRef.current || !targetIdRef.current) return;

    await initPeer();
    await peerRef.current!.setRemoteDescription(pendingOfferRef.current);

    const answer = await peerRef.current!.createAnswer();
    await peerRef.current!.setLocalDescription(answer);

    socket.emit("answer", { to: targetIdRef.current, answer });

    pendingOfferRef.current = null;
    setCallState("in-call");
  };

  const rejectCall = () => {
    pendingOfferRef.current = null;
    targetIdRef.current = null;
    setCallState("idle");
  };

  const endCall = () => {
    peerRef.current?.close();
    peerRef.current = null;

    localStream?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    setRemoteStream(null);

    setCallState("idle");
    targetIdRef.current = null;
    pendingOfferRef.current = null;
  };

  return (
    <VideoCallContext.Provider
      value={{
        callState,
        localStream,
        remoteStream,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};

export const useVideoCall = () => {
  const ctx = useContext(VideoCallContext);
  if (!ctx)
    throw new Error("useVideoCall must be used inside VideoCallProvider");
  return ctx;
};
