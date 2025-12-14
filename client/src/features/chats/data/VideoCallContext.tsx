import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { socket } from "@/lib/socket";

type CallState = "idle" | "incoming" | "calling" | "in-call";

interface VideoCallContextProps {
  callState: CallState;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startCall: (targetId: string) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
}

const VideoCallContext = createContext<VideoCallContextProps | undefined>(
  undefined
);

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (!context)
    throw new Error("useVideoCall must be used within VideoCallProvider");
  return context;
};

export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [callState, setCallState] = useState<CallState>("idle");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const remoteUserRef = useRef<string | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const getLocalStream = async () => {
    if (!localStream) {
      const stream = await navigator.mediaDevices.getUserMedia({
        // video: true,
        audio: true,
      });
      setLocalStream(stream);
      return stream;
    }
    return localStream;
  };

  const flushPendingCandidates = async () => {
    if (!pcRef.current) return;
    for (const c of pendingCandidatesRef.current) {
      try {
        await pcRef.current.addIceCandidate(c);
      } catch (err) {
        console.error("[VideoCall] ICE error", err);
      }
    }
    pendingCandidatesRef.current = [];
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.oniceconnectionstatechange = () =>
      console.log("[ICE]", pc.iceConnectionState);

    pc.addTransceiver("video", { direction: "sendrecv" });
    pc.addTransceiver("audio", { direction: "sendrecv" });

    return pc;
  };

  /* -------------------- socket handlers -------------------- */

  useEffect(() => {
    const handleOffer = async ({
      offer,
      from,
    }: {
      offer: RTCSessionDescriptionInit;
      from: string;
    }) => {
      console.log("[VideoCall] Received offer from", from);
      remoteUserRef.current = from;
      setCallState("incoming");

      const stream = await getLocalStream();
      pcRef.current = createPeerConnection();
      stream.getTracks().forEach((t) => pcRef.current!.addTrack(t, stream));

      pcRef.current.ontrack = (e) => {
        console.log(
          "[ontrack]",
          e.track.kind,
          e.track.readyState,
          e.track.enabled
        );
        if (e.streams[0]) {
          console.log(
            "Remote stream with track:",
            e.streams.map((s) => s.getTracks())
          );
          setRemoteStream(e.streams[0]);
        } else {
          const remote = new MediaStream();
          remote.addTrack(e.track);
          setRemoteStream(remote);
        }
      };

      pcRef.current.onicecandidate = (e) => {
        if (e.candidate)
          socket.emit("ice-candidate", { to: from, candidate: e.candidate });
      };

      await pcRef.current.setRemoteDescription(offer);
      await flushPendingCandidates();
    };

    const handleAnswer = async ({
      answer,
    }: {
      answer: RTCSessionDescriptionInit;
    }) => {
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(answer);
      await flushPendingCandidates();
      setCallState("in-call");
    };

    const handleICE = async ({
      candidate,
    }: {
      candidate: RTCIceCandidateInit;
    }) => {
      if (!pcRef.current || !candidate) return;
      if (pcRef.current.remoteDescription)
        await pcRef.current.addIceCandidate(candidate);
      else pendingCandidatesRef.current.push(candidate);
    };

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleICE);

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleICE);
    };
  }, []);

  /* -------------------- actions -------------------- */

  const startCall = async (targetId: string) => {
    remoteUserRef.current = targetId;
    setCallState("calling");

    const stream = await getLocalStream();
    pcRef.current = createPeerConnection();
    stream.getTracks().forEach((t) => pcRef.current!.addTrack(t, stream));

    const remote = new MediaStream();
    pcRef.current.ontrack = (e) => {
      if (e.streams[0]) setRemoteStream(e.streams[0]);
      else {
        remote.addTrack(e.track);
        setRemoteStream(remote);
      }
    };

    pcRef.current.onicecandidate = (e) => {
      if (e.candidate && remoteUserRef.current)
        socket.emit("ice-candidate", {
          to: remoteUserRef.current,
          candidate: e.candidate,
        });
    };

    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socket.emit("offer", { to: targetId, offer });
  };

  const acceptCall = async () => {
    if (!pcRef.current || !remoteUserRef.current) return;
    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);
    socket.emit("answer", { to: remoteUserRef.current, answer });
    setCallState("in-call");
  };

  const rejectCall = () => {
    pcRef.current?.close();
    pcRef.current = null;
    remoteUserRef.current = null;
    setRemoteStream(null);
    setCallState("idle");
  };

  const endCall = () => {
    setCallState("idle");
    localStream?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    setRemoteStream(null);
    pcRef.current?.close();
    pcRef.current = null;
    remoteUserRef.current = null;
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
