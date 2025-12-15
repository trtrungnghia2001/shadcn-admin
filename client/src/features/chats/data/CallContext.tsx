import { createContext, useContext, useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";

interface Peer {
  pc: RTCPeerConnection;
  remoteStream: MediaStream;
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

  const localPcRef = useRef<Record<string, RTCPeerConnection>>({});

  // Hàm lấy local stream khi cần
  const getLocalStream = async () => {
    if (!localStream) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      return stream;
    }
    return localStream;
  };

  // Dọn dẹp camera/micro
  const cleanUpLocalStream = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
  };

  // Tạo PeerConnection
  const createPeerConnection = (peerId: string, stream: MediaStream) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    const remoteStream = new MediaStream();

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((t) => remoteStream.addTrack(t));
      setPeers((prev) => ({
        ...prev,
        [peerId]: { pc, remoteStream, inCall: true },
      }));
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          toUserId: peerId,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    // Thêm track local
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    localPcRef.current[peerId] = pc;
    return { pc, remoteStream };
  };

  // Start call
  const startCall = async (peerId: string) => {
    const stream = await getLocalStream();
    const { pc, remoteStream } = createPeerConnection(peerId, stream);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("call-user", { toUserId: peerId, offer });

    setPeers((prev) => ({
      ...prev,
      [peerId]: { pc, remoteStream, inCall: false },
    }));
  };

  // Accept call
  const acceptCall = async (peerId: string) => {
    const stream = await getLocalStream();
    const pc = localPcRef.current[peerId];
    if (!pc) return;

    // Add track local lần này
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

  // End call
  const endCall = (peerId: string) => {
    const pc = localPcRef.current[peerId];
    if (pc) pc.close();
    delete localPcRef.current[peerId];

    setPeers((prev) => {
      const next = { ...prev };
      delete next[peerId];
      return next;
    });

    setReceivingCallFrom(null);

    // Nếu không còn peer → dọn camera
    if (Object.keys(localPcRef.current).length === 0) {
      cleanUpLocalStream();
    }

    socket.emit("end-call", { toUserId: peerId });
  };

  // Socket listeners
  useEffect(() => {
    socket.on("call-user", async ({ fromUserId, offer }) => {
      // Tạo pc nhưng không add track local
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      const remoteStream = new MediaStream();

      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((t) => remoteStream.addTrack(t));
        setPeers((prev) => ({
          ...prev,
          [fromUserId]: { pc, remoteStream, inCall: true },
        }));
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            toUserId: fromUserId,
            candidate: event.candidate.toJSON(),
          });
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      localPcRef.current[fromUserId] = pc;

      setReceivingCallFrom(fromUserId);
      setPeers((prev) => ({
        ...prev,
        [fromUserId]: { pc, remoteStream, inCall: false },
      }));
    });

    socket.on("answer-call", async ({ fromUserId, answer }) => {
      const pc = localPcRef.current[fromUserId];
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));

      setPeers((prev) => ({
        ...prev,
        [fromUserId]: { ...prev[fromUserId], inCall: true },
      }));
    });

    socket.on("ice-candidate", async ({ fromUserId, candidate }) => {
      const pc = localPcRef.current[fromUserId];
      if (pc) await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("call-ended", ({ fromUserId }) => {
      const pc = localPcRef.current[fromUserId];
      if (pc) pc.close();
      delete localPcRef.current[fromUserId];

      setPeers((prev) => {
        const next = { ...prev };
        delete next[fromUserId];
        return next;
      });

      setReceivingCallFrom(null);

      if (Object.keys(localPcRef.current).length === 0) {
        cleanUpLocalStream();
      }
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
