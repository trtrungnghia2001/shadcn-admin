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

  const getLocalStream = async () => {
    if (!localStream) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      console.log("[VideoCall] Obtained local stream:", stream);
      return stream;
    }
    return localStream;
  };

  useEffect(() => {
    const handleOffer = async (data: {
      offer: RTCSessionDescriptionInit;
      from: string;
    }) => {
      const { offer, from } = data;
      console.log("[VideoCall] Received offer from:", from, offer);
      remoteUserRef.current = from;
      setCallState("incoming");

      const stream = await getLocalStream();

      pcRef.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      console.log("[VideoCall] Created RTCPeerConnection for incoming call");

      // Add local tracks
      stream.getTracks().forEach((track) => {
        pcRef.current!.addTrack(track, stream);
        console.log("[VideoCall] Added local track:", track.kind);
      });

      // Handle remote tracks
      const remote = new MediaStream();
      pcRef.current.ontrack = (event: RTCTrackEvent) => {
        console.log("[VideoCall] Received remote track:", event.track.kind);

        if (event.streams[0]) {
          setRemoteStream(event.streams[0]);
        } else {
          remote.addTrack(event.track);
        }
        if (!event.streams[0])
          console.log("[VideoCall] Remote stream updated:", remote);
      };

      // Handle ICE candidates
      pcRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("[VideoCall] Sending ICE candidate:", event.candidate);
          socket.emit("ice-candidate", {
            to: from,
            candidate: event.candidate,
          });
        }
      };

      await pcRef.current.setRemoteDescription(offer);
      console.log("[VideoCall] Set remote description for incoming call");
    };

    const handleAnswer = async (data: {
      answer: RTCSessionDescriptionInit;
    }) => {
      const { answer } = data;
      console.log("[VideoCall] Received answer:", answer);
      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(answer);
        setCallState("in-call");
        console.log("[VideoCall] Set remote description for answer");
      }
    };

    const handleICE = async (data: { candidate: RTCIceCandidateInit }) => {
      const { candidate } = data;
      console.log("[VideoCall] Received ICE candidate:", candidate);
      if (pcRef.current && candidate) {
        try {
          await pcRef.current.addIceCandidate(candidate);
          console.log("[VideoCall] Added ICE candidate successfully");
        } catch (err) {
          console.error("[VideoCall] Error adding ICE candidate:", err);
        }
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

  const startCall = async (targetId: string) => {
    console.log("[VideoCall] Starting call to:", targetId);
    remoteUserRef.current = targetId;
    setCallState("calling");

    const stream = await getLocalStream();

    pcRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    console.log("[VideoCall] Created RTCPeerConnection for outgoing call");

    stream.getTracks().forEach((track) => {
      pcRef.current!.addTrack(track, stream);
      console.log("[VideoCall] Added local track:", track.kind);
    });

    const remote = new MediaStream();
    pcRef.current.ontrack = (event: RTCTrackEvent) => {
      console.log("[VideoCall] Received remote track:", event.track.kind);
      if (event.streams[0]) {
        setRemoteStream(event.streams[0]);
      } else {
        remote.addTrack(event.track);
      }

      if (!event.streams[0])
        console.log("[VideoCall] Remote stream updated:", remote);
    };

    pcRef.current.onicecandidate = (event) => {
      if (event.candidate && remoteUserRef.current) {
        console.log("[VideoCall] Sending ICE candidate:", event.candidate);
        socket.emit("ice-candidate", {
          to: remoteUserRef.current,
          candidate: event.candidate,
        });
      }
    };

    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    console.log("[VideoCall] Created offer:", offer);

    socket.emit("offer", { to: targetId, offer });
  };

  const acceptCall = async () => {
    if (!pcRef.current || !remoteUserRef.current) return;
    setCallState("in-call");
    console.log("[VideoCall] Accepting call");

    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);

    socket.emit("answer", { to: remoteUserRef.current, answer });
    console.log("[VideoCall] Sent answer:", answer);
  };

  const rejectCall = () => {
    console.log("[VideoCall] Rejecting call");
    setCallState("idle");
    pcRef.current?.close();
    pcRef.current = null;
    remoteUserRef.current = null;
    setRemoteStream(null);
  };

  const endCall = () => {
    console.log("[VideoCall] Ending call");
    setCallState("idle");
    pcRef.current?.close();
    pcRef.current = null;
    remoteUserRef.current = null;
    setRemoteStream(null);
    localStream?.getTracks().forEach((track) => track.stop());
    setLocalStream(null);
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
