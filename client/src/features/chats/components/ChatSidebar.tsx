import { useQuery } from "@tanstack/react-query";
import { MessagesSquare, Search } from "lucide-react";
import { getUsersApi } from "../data/api";
import { useChatContext } from "../data/context";
import { useEffect } from "react";
import ChatUser from "./ChatUser";

const ChatSidebar = () => {
  const { setUsers, users } = useChatContext();
  const { data } = useQuery({
    queryKey: ["chat", "user"],
    queryFn: async () => await getUsersApi(),
  });

  useEffect(() => {
    if (data?.data) {
      setUsers(data.data);
    }
  }, [data]);

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
        {users.map((user, idx) => (
          <li key={idx}>
            <ChatUser user={user} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
