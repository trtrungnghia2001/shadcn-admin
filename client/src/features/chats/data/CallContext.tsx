import { createContext, useContext, useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";

export interface Peer {
  pc: RTCPeerConnection;
  remoteStreamRef: React.MutableRefObject<MediaStream | null>;
  inCall: boolean;
}

interface CallContextType {
  localStream: MediaStream | null;
  peers: Record<string, Peer>;
  startCall: (peerId: string) => void;
  acceptCall: (peerId: string) => void;
  endCall: (peerId: string) => void;
  receivingCallFrom: string | null;
}

const CallContext = createContext<CallContextType | null>(null);

export const useCall = () => {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error("useCall must be used within CallProvider");
  return ctx;
};

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Record<string, Peer>>({});
  const [receivingCallFrom, setReceivingCallFrom] = useState<string | null>(
    null
  );

  const pcsRef = useRef<Record<string, RTCPeerConnection>>({});

  // ------------------------
  // Local stream
  // ------------------------
  const getLocalStream = async () => {
    if (localStream) return localStream;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);
    return stream;
  };

  const cleanupLocalStream = () => {
    if (!localStream) return;
    localStream.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
  };

  // ------------------------
  // Create PeerConnection
  // ------------------------
  const createPeerConnection = (peerId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const remoteStreamRef = { current: new MediaStream() };

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        const stream = remoteStreamRef.current!;
        if (!stream.getTracks().includes(track)) {
          stream.addTrack(track);
        }
      });
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          toUserId: peerId,
          candidate: event.candidate,
        });
      }
    };

    pcsRef.current[peerId] = pc;

    return { pc, remoteStreamRef };
  };

  // ------------------------
  // Start Call (Caller)
  // ------------------------
  const startCall = async (peerId: string) => {
    const stream = await getLocalStream();
    const { pc, remoteStreamRef } = createPeerConnection(peerId);

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("call-user", { toUserId: peerId, offer });

    setPeers((prev) => ({
      ...prev,
      [peerId]: { pc, remoteStreamRef, inCall: false },
    }));
  };

  // ------------------------
  // Accept Call (Callee)
  // ------------------------
  const acceptCall = async (peerId: string) => {
    const stream = await getLocalStream();
    const pc = pcsRef.current[peerId];
    if (!pc) return;

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("answer-call", { toUserId: peerId, answer });

    setPeers((prev) => ({
      ...prev,
      [peerId]: { ...prev[peerId], inCall: true },
    }));

    setReceivingCallFrom(null);
  };

  // ------------------------
  // End Call
  // ------------------------
  const endCall = (peerId: string) => {
    const pc = pcsRef.current[peerId];
    if (pc) pc.close();
    delete pcsRef.current[peerId];

    setPeers((prev) => {
      const next = { ...prev };
      delete next[peerId];
      return next;
    });

    socket.emit("end-call", { toUserId: peerId });

    if (Object.keys(pcsRef.current).length === 0) {
      cleanupLocalStream();
    }

    setReceivingCallFrom(null);
  };

  // ------------------------
  // Socket listeners
  // ------------------------
  useEffect(() => {
    socket.on("call-user", async ({ fromUserId, offer }) => {
      const { pc, remoteStreamRef } = createPeerConnection(fromUserId);

      await pc.setRemoteDescription(offer);

      setPeers((prev) => ({
        ...prev,
        [fromUserId]: { pc, remoteStreamRef, inCall: false },
      }));

      setReceivingCallFrom(fromUserId);
    });

    socket.on("answer-call", async ({ fromUserId, answer }) => {
      const pc = pcsRef.current[fromUserId];
      if (!pc) return;
      await pc.setRemoteDescription(answer);

      setPeers((prev) => ({
        ...prev,
        [fromUserId]: { ...prev[fromUserId], inCall: true },
      }));
    });

    socket.on("ice-candidate", async ({ fromUserId, candidate }) => {
      const pc = pcsRef.current[fromUserId];
      if (pc && candidate) {
        await pc.addIceCandidate(candidate);
      }
    });

    socket.on("call-ended", ({ fromUserId }) => {
      const pc = pcsRef.current[fromUserId];
      if (pc) pc.close();
      delete pcsRef.current[fromUserId];

      setPeers((prev) => {
        const next = { ...prev };
        delete next[fromUserId];
        return next;
      });

      if (Object.keys(pcsRef.current).length === 0) {
        cleanupLocalStream();
      }

      setReceivingCallFrom(null);
    });

    return () => {
      socket.off("call-user");
      socket.off("answer-call");
      socket.off("ice-candidate");
      socket.off("call-ended");
    };
  }, []);

  return (
    <CallContext.Provider
      value={{
        localStream,
        peers,
        startCall,
        acceptCall,
        endCall,
        receivingCallFrom,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
