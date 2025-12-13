import { io } from "socket.io-client";
import ENV_CONFIG from "./env";

export const socket = io(ENV_CONFIG.URL_SOCKET, {
  autoConnect: false,
  transports: ["websocket"],
});
