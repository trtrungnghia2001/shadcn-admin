import { io } from "socket.io-client";
import ENV_CONFIG from "./env";
import { useAuthStore } from "@/features/_authen/data/store";

export const socket = io(ENV_CONFIG.URL_SOCKET, {
  autoConnect: true,
  auth: {
    userId: useAuthStore.getState().auth?._id,
  },
});
