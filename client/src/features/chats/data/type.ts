import type { AuthType } from "@/features/_authen/data/store";

export type ChatMessageType = {
  _id: string;
  sender: AuthType;
  receiver: AuthType;
  message: string;
  createdAt: string;
  readBy: string[];
};

export type ChatMessageDTO = {
  receiver: string;
  message: string;
};

export type ChatUserType = AuthType & {
  lastMessage: ChatMessageType;
  isRead: boolean;
};
