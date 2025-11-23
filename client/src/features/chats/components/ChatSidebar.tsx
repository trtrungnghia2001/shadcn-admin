import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessagesSquare, Search } from "lucide-react";

const ChatSidebar = () => {
  return (
    <div className="pr-4 w-64 h-full flex flex-col gap-4">
      {/*  */}
      <div className="flex items-center gap-2">
        <h3>Inbox</h3>
        <MessagesSquare size={16} />
      </div>
      {/*  */}
      <div className="rounded-lg border flex items-stretch gap-2 px-2 py-2">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search chat..."
          className="border-none outline-none w-full leading-0"
        />
      </div>
      {/*  */}
      <ul className="flex-1 overflow-y-auto">
        {Array.from({ length: 20 })
          .fill(0)
          .map((_, idx) => (
            <li key={idx} className="border-b last:border-none py-1">
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
                <Avatar className="">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>TTN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Alex John</p>
                  <p className="text-muted-foreground line-clamp-1">
                    You: See you late, Alex!
                  </p>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
