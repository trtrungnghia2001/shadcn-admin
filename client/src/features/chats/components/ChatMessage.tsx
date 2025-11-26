import { useAuthStore } from "@/features/_authen/data/store";
import clsx from "clsx";
import { memo, useMemo } from "react";
import type { ChatMessageType } from "../data/type";
import { useChatContext } from "../data/context";

interface ChatItemProps {
  chatMessage: ChatMessageType;
  lastMessId?: string;
}
const ChatMessage = ({ chatMessage, lastMessId }: ChatItemProps) => {
  const { auth } = useAuthStore();
  const { currentUser } = useChatContext();

  const owner = useMemo(() => {
    return auth?._id === chatMessage.sender._id;
  }, [chatMessage, auth]);

  const isSeen = useMemo(() => {
    return chatMessage._id === lastMessId &&
      currentUser &&
      chatMessage.sender._id === auth?._id &&
      chatMessage.readBy.includes(currentUser?._id)
      ? true
      : false;
  }, [currentUser, chatMessage]);

  return (
    <>
      <div className={clsx([`flex`, owner ? `justify-end` : `justify-start`])}>
        <div className="w-2/5">
          <div
            className={clsx([
              `shadow-md p-2 rounded-xl space-y-1`,
              owner
                ? `bg-primary/90 rounded-br-none text-primary-foreground`
                : `bg-muted rounded-bl-none`,
            ])}
          >
            <p className="break-all wrap-break-word whitespace-normal">
              {chatMessage.message}
            </p>
            <p
              className={clsx([
                `italic text-xs`,
                owner
                  ? `text-primary-foreground/70`
                  : `text-muted-foreground/70`,
              ])}
            >
              {new Date(chatMessage.createdAt).toLocaleString()}
            </p>
          </div>
          {isSeen && (
            <p
              className={clsx([
                `text-xs text-muted-foreground mt-1 hidden last:block`,
                owner ? `text-right` : `text-left`,
              ])}
            >
              Seen
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(ChatMessage);
