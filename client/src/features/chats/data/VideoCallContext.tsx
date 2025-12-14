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

  /* -------------------- helpers -------------------- */

  const getLocalStream = async () => {
    if (!localStream) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      console.log("[VideoCall] Got local stream");
      stream.getVideoTracks().forEach((t) => {
        console.log("video track:", t.readyState, t.enabled);
      });
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
        console.error("[VideoCall] Flush ICE error:", err);
      }
    }
    pendingCandidatesRef.current = [];
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.oniceconnectionstatechange = () => {
      console.log("[VideoCall] ICE state:", pc.iceConnectionState);
    };

    pc.addTransceiver("video", { direction: "sendrecv" });
    pc.addTransceiver("audio", { direction: "sendrecv" });

    return pc;
  };

  /* -------------------- socket handlers -------------------- */

  useEffect(() => {
    const handleOffer = async (data: {
      offer: RTCSessionDescriptionInit;
      from: string;
    }) => {
      console.log("[VideoCall] Received offer");
      remoteUserRef.current = data.from;
      setCallState("incoming");

      const stream = await getLocalStream();
      pcRef.current = createPeerConnection();

      stream.getTracks().forEach((t) => pcRef.current!.addTrack(t, stream));

      const remote = new MediaStream();
      pcRef.current.ontrack = (e) => {
        console.log("[ontrack] kind:", e.track.kind, "streams:", e.streams);
        if (e.streams[0]) {
          setRemoteStream(e.streams[0]);
        } else {
          remote.addTrack(e.track);
          setRemoteStream(remote);
        }
      };

      pcRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            to: data.from,
            candidate: e.candidate,
          });
        }
      };

      await pcRef.current.setRemoteDescription(data.offer);
      await flushPendingCandidates();
    };

    const handleAnswer = async (data: {
      answer: RTCSessionDescriptionInit;
    }) => {
      if (!pcRef.current) return;

      await pcRef.current.setRemoteDescription(data.answer);
      await flushPendingCandidates();
      setCallState("in-call");
    };

    const handleICE = async (data: { candidate: RTCIceCandidateInit }) => {
      if (!pcRef.current || !data.candidate) return;

      if (pcRef.current.remoteDescription) {
        await pcRef.current.addIceCandidate(data.candidate);
      } else {
        pendingCandidatesRef.current.push(data.candidate);
      }
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
      if (e.streams[0]) {
        setRemoteStream(e.streams[0]);
      } else {
        remote.addTrack(e.track);
        setRemoteStream(remote);
      }
    };

    pcRef.current.onicecandidate = (e) => {
      if (e.candidate && remoteUserRef.current) {
        socket.emit("ice-candidate", {
          to: remoteUserRef.current,
          candidate: e.candidate,
        });
      }
    };

    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);

    socket.emit("offer", { to: targetId, offer });
  };

  const acceptCall = async () => {
    if (!pcRef.current || !remoteUserRef.current) return;

    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);

    socket.emit("answer", {
      to: remoteUserRef.current,
      answer,
    });

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
    console.log("[VideoCall] Ending call");
    setCallState("idle");

    // Stop local tracks
    localStream?.getTracks().forEach((track) => track.stop());
    setLocalStream(null);

    // Cleanup remote stream
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
