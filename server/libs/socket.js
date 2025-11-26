import http from "http";
import { Server } from "socket.io";

const server = http.createServer();
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userMap = new Map();
export const getSocketId = (userId) => userMap.get(userId);

export async function connectSocket() {
  server.listen(5001, () => {
    console.log(`Socket running is port:: `, 5001);
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: `, socket.id);
    const userId = socket.handshake.auth.userId;
    if (!userId) return;

    userMap.set(userId, socket.id);
    io.emit("onlineUsers", Array.from(userMap.keys()));

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      userMap.delete(userId);
      io.emit("onlineUsers", Array.from(userMap.keys()));
    });

    socket.on("chat-writing", ({ receiverId, typing }) => {
      const receiverSocket = userMap.get(receiverId);
      console.log({ receiverSocket });
      if (!receiverSocket) return;

      io.to(receiverSocket).emit("chat-writing", { userId, typing });
    });
  });
}
