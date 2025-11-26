import type { AuthType } from "@/features/_authen/data/store";
import { createContext, useContext } from "react";
import type { ChatMessageType, ChatUserType } from "./type";

export type ChatConextType = {
  onlineUsers: string[];
  currentUser: AuthType | null;
  setCurrentUser: (currentUser: AuthType | null) => void;
  messages: ChatMessageType[];
  setMessages: (message: ChatMessageType[]) => void;
  users: ChatUserType[];
  setUsers: (users: ChatUserType[]) => void;
  handleSelectCurrentUser: (currentUser: AuthType | null) => void;
  currentUserSeen: string;
  typingUser: boolean;
};

export const ChatConext = createContext<ChatConextType | null>(null);

export const useChatContext = (): ChatConextType => {
  const ctx = useContext(ChatConext);

  if (!ctx) {
    throw new Error("useChatContext must be used inside <ChatProvider>");
  }

  return ctx;
};
