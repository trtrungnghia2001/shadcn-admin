import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, EllipsisVertical, Phone, Video } from "lucide-react";
import { useChatContext } from "../data/context";
import { memo } from "react";
import clsx from "clsx";

const ChatHeader = () => {
  const { currentUser, onlineUsers, setCurrentUser } = useChatContext();
  const isOnline = onlineUsers.includes(currentUser?._id as string);

  return (
    <div className="p-4 flex items-center justify-between gap-8 shadow-lg">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setCurrentUser(null)}
          size={"icon"}
          variant={"ghost"}
          className="sm:hidden"
        >
          <ArrowLeft />
        </Button>
        <Avatar className="">
          <AvatarImage
            src={currentUser?.avatar || "https://github.com/shadcn.png"}
            alt={currentUser?.name}
          />
          <AvatarFallback>{currentUser?.name}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{currentUser?.name}</p>
          <p
            className={clsx([
              `line-clamp-1 text-xs`,
              isOnline ? `text-green-500` : `text-muted-foreground`,
            ])}
          >
            {isOnline ? `Online` : `Offline`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant={"ghost"} size={"icon"} className="rounded-full">
          <Video />
        </Button>
        <Button variant={"ghost"} size={"icon"} className="rounded-full">
          <Phone />
        </Button>
        <Button variant={"ghost"} size={"icon"} className="rounded-full">
          <EllipsisVertical />
        </Button>
      </div>
    </div>
  );
};

export default memo(ChatHeader);
