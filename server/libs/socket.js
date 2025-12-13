import { Server } from "socket.io";

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

    socket.on("chat-writing", ({ receiverId, typing }) => {
      const receiverSocket = userMap.get(receiverId);

      if (!receiverSocket) return;

      io.to(receiverSocket).emit("chat-writing", { userId, typing });
    });

    // video call
    socket.on("offer", ({ offer, to }) => {
      io.to(to).emit("offer", { offer, from: socket.id });
    });

    socket.on("answer", ({ answer, to }) => {
      io.to(to).emit("answer", { answer });
    });

    socket.on("iceCandidate", (candidate) => {
      socket.broadcast.emit("iceCandidate", candidate);
    });
  });
}

export { io, getSocketId };
