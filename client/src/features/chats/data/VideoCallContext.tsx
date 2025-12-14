import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { socket } from "@/lib/socket";

type CallState = "idle" | "calling" | "incoming" | "connecting" | "in-call";

interface IncomingCall {
  roomId: string;
  from: string;
}

interface WebRTCContextProps {
  callState: CallState;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  incomingCall: IncomingCall | null;

  callUser: (userId: string) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
}

const WebRTCContext = createContext<WebRTCContextProps | null>(null);

export const useVideoCall = () => {
  const ctx = useContext(WebRTCContext);
  if (!ctx) throw new Error("useVideoCall must be used inside provider");
  return ctx;
};

export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  /* ================= STATE ================= */
  const peer = useMemo(() => {
    return new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });
  }, []);

  const createOffter = async () => {
    const offter = await peer.createOffer();
    await peer.setLocalDescription(offter);
    return offter;
  };

  const [callState, setCallState] = useState<CallState>("idle");
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  /* ================= REFS ================= */

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const roomIdRef = useRef<string | null>(null);
  const roleRef = useRef<"caller" | "callee" | null>(null);

  // 🔥 FIX QUAN TRỌNG: remote stream thủ công
  const remoteStreamRef = useRef<MediaStream>(new MediaStream());

  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  /* ================= HELPERS ================= */

  const getLocalStream = async () => {
    if (localStream) return localStream;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);
    return stream;
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate && roomIdRef.current) {
        socket.emit("ice-candidate", {
          roomId: roomIdRef.current,
          candidate: e.candidate,
        });
      }
    };

    // 🔥 FIX CHÍ MẠNG Ở ĐÂY
    pc.ontrack = (e) => {
      console.log("[ontrack]", e.track.kind, e.track.readyState);

      const stream = new MediaStream();
      stream.addTrack(e.track);

      setRemoteStream(stream);
    };

    pc.onconnectionstatechange = () => {
      console.log("[PC]", pc.connectionState);
    };

    return pc;
  };

  const flushIceCandidates = async () => {
    if (!pcRef.current) return;
    for (const c of pendingCandidatesRef.current) {
      await pcRef.current.addIceCandidate(c);
    }
    pendingCandidatesRef.current = [];
  };
  const cleanup = () => {
    pcRef.current?.close();
    pcRef.current = null;

    roomIdRef.current = null;
    pendingCandidatesRef.current = [];

    remoteStreamRef.current = new MediaStream();

    localStream?.getTracks().forEach((t) => t.stop());

    setLocalStream(null);
    setRemoteStream(null);
    setIncomingCall(null);
    setCallState("idle");
  };
  /* ================= SOCKET EVENTS ================= */

  useEffect(() => {
    // U2 nhận cuộc gọi
    socket.on("incoming-call", ({ roomId, from }) => {
      roleRef.current = "caller";
      roomIdRef.current = roomId;
      setIncomingCall({ roomId, from });
      setCallState("incoming");
    });

    // cả 2 bên sau accept
    socket.on("call-accepted", async () => {
      setCallState("connecting");

      const stream = await getLocalStream();

      pcRef.current = createPeerConnection();

      // ⚠️ RẤT QUAN TRỌNG: addTrack TRƯỚC createOffer
      stream.getTracks().forEach((t) => pcRef.current!.addTrack(t, stream));

      // caller tạo offer
      if (roleRef.current === "caller") {
        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);

        socket.emit("offer", {
          roomId: roomIdRef.current,
          offer,
        });
      }
    });

    socket.on("call-rejected", () => {
      cleanup();
    });

    socket.on("offer", async (offer) => {
      console.log("[U2] received offer");

      if (!pcRef.current) {
        pcRef.current = createPeerConnection();
      }

      // 🔥 CỰC KỲ QUAN TRỌNG
      const stream = await getLocalStream();
      stream.getTracks().forEach((track) => {
        pcRef.current!.addTrack(track, stream);
      });

      console.log(
        "[U2] local tracks added:",
        stream.getTracks().map((t) => t.kind)
      );

      await pcRef.current.setRemoteDescription(offer);
      console.log("[U2] setRemoteDescription done");

      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);

      socket.emit("answer", {
        roomId: roomIdRef.current,
        answer,
      });

      console.log("[U2] answer sent");
    });

    socket.on("answer", async (answer) => {
      if (!pcRef.current) return;

      await pcRef.current.setRemoteDescription(answer);
      await flushIceCandidates();
      setCallState("in-call");
    });

    socket.on("ice-candidate", async (candidate) => {
      if (!pcRef.current) return;

      if (pcRef.current.remoteDescription)
        await pcRef.current.addIceCandidate(candidate);
      else pendingCandidatesRef.current.push(candidate);
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("call-rejected");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [incomingCall]);

  /* ================= ACTIONS ================= */

  const callUser = (userId: string) => {
    roleRef.current = "caller";
    setCallState("calling");
    socket.emit("call-user", { to: userId });
  };

  const acceptCall = () => {
    if (!incomingCall) return;
    socket.emit("accept-call", { roomId: incomingCall.roomId });
    setIncomingCall(null);
  };

  const rejectCall = () => {
    if (!incomingCall) return;
    socket.emit("reject-call", { roomId: incomingCall.roomId });
    cleanup();
  };

  const endCall = () => {
    cleanup();
  };

  /* ================= PROVIDER ================= */

  return (
    <WebRTCContext.Provider
      value={{
        callState,
        localStream,
        remoteStream,
        incomingCall,
        callUser,
        acceptCall,
        rejectCall,
        endCall,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};
