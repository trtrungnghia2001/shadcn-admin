import { socket } from "@/lib/socket";
import React, { useEffect, useState } from "react";
import { ChatConext } from "./context";
import type { AuthType } from "@/features/_authen/data/store";
import type { ChatMessageType, ChatUserType } from "./type";

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthType | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [users, setUsers] = useState<ChatUserType[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });

    socket.on("onlineUsers", (value) => {
      setOnlineUsers(value);
    });

    //
    return () => {
      socket.off("connect");
    };
  }, []);

  useEffect(() => {
    const handleSend = (value: ChatMessageType) => {
      if (value.sender._id === currentUser?._id) {
        setMessages((prev) => [...prev, value]);
      }

      const newUsers = users.map((u) =>
        u._id === value.sender?._id
          ? {
              ...u,
              lastMessage: value,
            }
          : u
      );

      setUsers(newUsers);
    };
    socket.on("chat-send", handleSend);

    const handleClick = (value: string) => {
      setUsers((prev) =>
        prev.map((u) =>
          u?.lastMessage?.receiver?._id === value
            ? {
                ...u,
                lastMessage: {
                  ...u.lastMessage,
                  readBy: [...u.lastMessage.readBy, value],
                },
              }
            : u
        )
      );
    };
    socket.on("chat-click-read", handleClick);

    //
    return () => {
      socket.off("chat-send", handleSend);
      socket.off("chat-click-read", handleClick);
    };
  }, [currentUser, users]);

  return (
    <ChatConext.Provider
      value={{
        onlineUsers,
        messages,
        setMessages,
        currentUser,
        setCurrentUser,
        users,
        setUsers,
      }}
    >
      {children}
    </ChatConext.Provider>
  );
};

export default ChatProvider;
