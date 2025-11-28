import { memo, useMemo } from "react";
import { useChatContext } from "../data/context";
import type { ChatUserType } from "../data/type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/features/_authen/data/store";
import clsx from "clsx";

interface ChatUserProps {
  user: ChatUserType;
}

const ChatUser = ({ user }: ChatUserProps) => {
  const { auth } = useAuthStore();
  const { onlineUsers, handleSelectCurrentUser, currentUser } =
    useChatContext();

  const lastMessageText = useMemo(() => {
    if (!user.lastMessage) return `No messages yet`;

    const name =
      user.lastMessage.sender._id === auth?._id
        ? `You`
        : user.name.split(" ")[user.name.split(" ").length - 1];

    return name + ": " + user.lastMessage.message;
  }, [user, auth]);

  return (
    <div
      onClick={() => {
        if (user._id === currentUser?._id) return;
        handleSelectCurrentUser(user);
      }}
      className={clsx([
        `border-b last:border-none py-1 cursor-pointer rounded-lg`,
        currentUser?._id === user._id && `bg-muted`,
      ])}
    >
      <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
        <div className="relative">
          <Avatar>
            <AvatarImage src={user.avatar || ""} alt={user.name} />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>
          {onlineUsers.includes(user._id) && (
            <div className="absolute bottom-0 right-0 w-2 h-2 aspect-square rounded-full overflow-hidden bg-green-500 outline-2 outline-background"></div>
          )}
        </div>
        <div>
          <p className="font-medium">{user.name}</p>
          <p
            className={clsx([
              `line-clamp-1 text-xs`,
              user.isRead || !user.lastMessage
                ? `text-muted-foreground`
                : `font-medium`,
            ])}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(ChatUser);
