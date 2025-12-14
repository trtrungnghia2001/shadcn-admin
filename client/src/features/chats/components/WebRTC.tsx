import { useAuthStore } from "@/features/_authen/data/store";
import { socket } from "@/lib/socket";
import { useEffect, useRef, useState } from "react";

interface PeerConnectionMap {
  [peerId: string]: RTCPeerConnection;
}

const WebRTC = () => {
  const { auth } = useAuthStore();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const pcRef = useRef<PeerConnectionMap>({}); // Mỗi peerId 1 peer connection

  // 1️⃣ Lấy camera + mic
  const getLocalStream = async (): Promise<MediaStream> => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    return stream;
  };

  // 2️⃣ Tạo peer connection cho peerId
  const createPeerConnection = (peerId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.ontrack = (event) => {
      console.log("Received remote track from peer", peerId);
      if (remoteVideoRef.current)
        remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          toUserId: peerId,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    pcRef.current[peerId] = pc;
    return pc;
  };

  // 3️⃣ Caller gọi peer
  const callUser = async (toUserId: string) => {
    const stream = await getLocalStream();
    const pc = createPeerConnection(toUserId);
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("call-user", { toUserId, offer });
  };

  // 4️⃣ Socket listeners
  useEffect(() => {
    socket.on("onlineUsers", (users: string[]) => {
      setOnlineUsers(users.filter((u) => u !== auth?._id));
    });

    // Callee nhận offer
    socket.on("call-user", async ({ fromUserId, offer }) => {
      const stream = await getLocalStream();

      const pc = pcRef.current[fromUserId] || createPeerConnection(fromUserId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer-call", { toUserId: fromUserId, answer });
    });

    // Caller nhận answer
    socket.on("answer-call", async ({ fromUserId, answer }) => {
      const pc = pcRef.current[fromUserId];
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async ({ fromUserId, candidate }) => {
      const pc = pcRef.current[fromUserId];
      if (pc) await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("call-user");
      socket.off("answer-call");
      socket.off("ice-candidate");
    };
  }, []);

  return (
    <div>
      <h2>WebRTC 1–1 Demo</h2>

      <div>
        <h3>Online Users</h3>
        {onlineUsers.map((u) => (
          <button key={u} onClick={() => callUser(u)}>
            Call {u}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={{ width: 200 }}
        />{" "}
        -{" "}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ width: 200 }}
        />
      </div>
    </div>
  );
};

export default WebRTC;
