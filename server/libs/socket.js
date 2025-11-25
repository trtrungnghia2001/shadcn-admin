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
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      userMap.delete(socket.handshake.auth.userId);
      socket.emit("onlineUsers", Array.from(userMap.keys()));
    });

    if (socket.handshake.auth.userId) {
      userMap.set(socket.handshake.auth.userId, socket.id);
      socket.emit("onlineUsers", Array.from(userMap.keys()));
    }

    console.log(`30::` + getSocketId(socket.handshake.auth.userId));
  });
}

// io.to().emit()
