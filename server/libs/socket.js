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
    socket.on("offer", (data) => {
      socket.to(getSocketId(data.to)).emit("offer", {
        offer: data.offer,
        from: socket.id,
      });
    });
    socket.on("answer", (data) => {
      socket.to(getSocketId(data.to)).emit("answer", {
        answer: data.answer,
        from: socket.id,
      });
    });
    socket.on("ice-candidate", (data) => {
      socket.to(getSocketId(data.to)).emit("ice-candidate", {
        candidate: data.candidate,
        from: socket.id,
      });
    });
  });
}

export { io, getSocketId };
