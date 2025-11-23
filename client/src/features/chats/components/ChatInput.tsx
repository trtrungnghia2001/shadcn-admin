import { Button } from "@/components/ui/button";
import { ImagePlus, Paperclip, Plus, Send } from "lucide-react";

const ChatInput = () => {
  return (
    <div className="p-4">
      <div className="flex items-stretch gap-4 p-2 rounded-lg border">
        {/* btn */}
        <div className="flex items-stretch gap-1">
          <Button size={"icon"} variant={"ghost"}>
            <Plus />
          </Button>
          <Button size={"icon"} variant={"ghost"}>
            <ImagePlus />
          </Button>
          <Button size={"icon"} variant={"ghost"}>
            <Paperclip />
          </Button>
        </div>
        {/* input */}
        <input
          type="text"
          placeholder="Type yuor messages..."
          className="w-full border-none outline-none"
        />
        <Button size={"icon"} variant={"ghost"}>
          <Send />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
