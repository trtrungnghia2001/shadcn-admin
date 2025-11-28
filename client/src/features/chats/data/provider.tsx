import { socket } from "@/lib/socket";
import React, { useEffect, useState } from "react";
import { ChatConext } from "./context";
import { useAuthStore, type AuthType } from "@/features/_authen/data/store";
import type { ChatMessageType, ChatUserType } from "./type";

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { auth } = useAuthStore();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthType | null>(null);
  const [currentUserSeen, setCurrentUserSeen] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [users, setUsers] = useState<ChatUserType[]>([]);
  const [typingUser, setTypingUser] = useState<boolean>(false);

  useEffect(() => {
    console.log({ auth });

    if (!auth) {
      socket.disconnect();
      return;
    }

    socket.auth = {
      userId: auth?._id,
    };
    if (!socket.connected) {
      socket.connect();
    }

    const handleOnline = (value: string[]) => {
      setOnlineUsers(value);
    };
    socket.on("onlineUsers", handleOnline);

    return () => {
      socket.off("onlineUsers", handleOnline);
    };
  }, [auth]);

  useEffect(() => {
    const handleSend = (value: ChatMessageType) => {
      if (value.sender._id === currentUser?._id) {
        setMessages((prev) => [...prev, value]);
      }

      // update lastMessage ui
      const newUsers = users.map((u) =>
        u._id === value.sender?._id
          ? {
              ...u,
              lastMessage: value,
              isRead: false,
            }
          : u
      );

      setUsers(newUsers);
    };
    socket.on("chat-send", handleSend);

    // update ui user read mess
    const handleClickRead = (senderId: string) => {
      setUsers((prev) =>
        prev.map((u) =>
          u?._id === senderId
            ? {
                ...u,
                isRead: true,
              }
            : u
        )
      );
    };
    socket.on("chat-clickRead", handleClickRead);

    const handleWriting = (data: { userId: string; typing: boolean }) => {
      if (currentUser?._id === data.userId) {
        setTypingUser(data.typing);
      }
    };
    socket.on("chat-writing", handleWriting);

    //
    return () => {
      socket.off("chat-send", handleSend);
      socket.off("chat-clickRead", handleClickRead);
      socket.off("chat-writing", handleWriting);
    };
  }, [currentUser, users]);

  const handleSelectCurrentUser = (user: AuthType | null) => {
    setCurrentUser(user);
    setMessages([]);
    setCurrentUserSeen("");
  };

  return (
    <ChatConext.Provider
      value={{
        onlineUsers,
        messages,
        setMessages,
        currentUser,
        users,
        setUsers,
        handleSelectCurrentUser,
        currentUserSeen,
        typingUser,
        setCurrentUser,
      }}
    >
      {children}
    </ChatConext.Provider>
  );
};

export default ChatProvider;
