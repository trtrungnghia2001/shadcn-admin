import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Phone, Video } from "lucide-react";

const ChatHeader = () => {
  return (
    <div className="p-4 flex items-center justify-between gap-8 shadow-lg">
      <div className="flex items-center gap-2">
        <Avatar className="">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>TTN</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">Alex John</p>
          <p className="text-muted-foreground line-clamp-1">alex_dev</p>
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

export default ChatHeader;
