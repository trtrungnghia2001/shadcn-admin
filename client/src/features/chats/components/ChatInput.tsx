import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { ImagePlus, Loader, Paperclip, Plus, Send } from "lucide-react";
import { memo, useState } from "react";
import { getSendApi } from "../data/api";
import { useChatContext } from "../data/context";
import { toast } from "sonner";

const ChatInput = () => {
  const { currentUser, setMessages, messages, users, setUsers } =
    useChatContext();
  const [message, setMessage] = useState("");

  const { isPending, mutate } = useMutation({
    mutationFn: async () =>
      await getSendApi({ receiver: currentUser?._id as string, message }),
    onSuccess: (data) => {
      setMessage("");
      setMessages([...messages, data.data]);

      const newUsers = users.map((u) =>
        u._id === data.data.receiver?._id
          ? {
              ...u,
              lastMessage: data.data,
            }
          : u
      );

      setUsers(newUsers);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!message) return;
          mutate();
        }}
        className="flex items-stretch gap-4 p-2 rounded-lg border"
      >
        {/* btn */}
        <div className="flex items-stretch gap-1">
          <Button type="button" size={"icon"} variant={"ghost"}>
            <Plus />
          </Button>
          <Button type="button" size={"icon"} variant={"ghost"}>
            <ImagePlus />
          </Button>
          <Button type="button" size={"icon"} variant={"ghost"}>
            <Paperclip />
          </Button>
        </div>
        {/* input */}
        <input
          type="text"
          placeholder="Type yuor messages..."
          className="w-full border-none outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          type="submit"
          size={"icon"}
          variant={"ghost"}
          disabled={isPending}
        >
          {isPending ? <Loader className="animate-spin" /> : <Send />}
        </Button>
      </form>
    </div>
  );
};

export default memo(ChatInput);
