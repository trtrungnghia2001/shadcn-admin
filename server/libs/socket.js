import { Server } from "socket.io";
import { v4 as uuid } from "uuid";

let io;
const userMap = new Map();
const getSocketId = (userId) => userMap.get(userId);

export async function connectSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log(`Socket connected: `, socket.id);
    const userId = socket.handshake.auth.userId;
    if (userId) {
      userMap.set(userId, socket.id);
      io.emit("onlineUsers", Array.from(userMap.keys()));
    }

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      userMap.delete(userId);
      io.emit("onlineUsers", Array.from(userMap.keys()));
    });

    /* ================= CHAT ================= */
    socket.on("chat-writing", ({ receiverId, typing }) => {
      const receiverSocket = userMap.get(receiverId);

      if (!receiverSocket) return;

      io.to(receiverSocket).emit("chat-writing", { userId, typing });
    });

    // ================= VIDEO CALL / WebRTC =================
    socket.on("call-user", ({ toUserId, offer }) => {
      const targetSocket = getSocketId(toUserId);
      if (!targetSocket) return;
      io.to(targetSocket).emit("call-user", { fromUserId: userId, offer });
    });

    socket.on("answer-call", ({ toUserId, answer }) => {
      const targetSocket = getSocketId(toUserId);
      if (!targetSocket) return;
      io.to(targetSocket).emit("answer-call", { fromUserId: userId, answer });
    });

    socket.on("ice-candidate", ({ toUserId, candidate }) => {
      const targetSocket = getSocketId(toUserId);
      if (!targetSocket) return;
      io.to(targetSocket).emit("ice-candidate", {
        fromUserId: userId,
        candidate,
      });
    });

    // ================= END CALL =================
    socket.on("end-call", ({ toUserId }) => {
      const targetSocket = getSocketId(toUserId);
      if (!targetSocket) return;
      io.to(targetSocket).emit("call-ended", { fromUserId: userId });
    });
  });
}

export { io, getSocketId };
