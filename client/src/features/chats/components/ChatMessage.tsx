import { useAuthStore } from "@/features/_authen/data/store";
import clsx from "clsx";
import { memo, useMemo } from "react";
import type { ChatMessageType } from "../data/type";

interface ChatItemProps {
  chatMessage: ChatMessageType;
}
const ChatMessage = ({ chatMessage }: ChatItemProps) => {
  const { auth } = useAuthStore();

  const owner = useMemo(() => {
    return auth?._id === chatMessage.sender._id;
  }, [chatMessage, auth]);

  return (
    <div className={clsx([`flex`, owner ? `justify-end` : `justify-start`])}>
      <div
        className={clsx([
          `w-2/5 shadow-md p-2 rounded-xl space-y-1`,
          owner
            ? `bg-primary/90 rounded-br-none text-primary-foreground`
            : `bg-muted rounded-bl-none`,
        ])}
      >
        <p>{chatMessage.message}</p>
        <p
          className={clsx([
            `italic text-xs`,
            owner ? `text-primary-foreground/70` : `text-muted-foreground/70`,
          ])}
        >
          {new Date(chatMessage.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default memo(ChatMessage);
