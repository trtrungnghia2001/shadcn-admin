import { useQuery } from "@tanstack/react-query";
import { MessagesSquare, Search } from "lucide-react";
import { getUsersApi } from "../data/api";
import { useChatContext } from "../data/context";
import { memo, useEffect, useState } from "react";
import ChatUser from "./ChatUser";
import { useDebounce } from "use-debounce";

const ChatSidebar = () => {
  const { setUsers, users } = useChatContext();

  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 500);

  const { data } = useQuery({
    queryKey: ["chat", "users", debouncedSearch],
    queryFn: async () => await getUsersApi(`search=${debouncedSearch}`),
  });

  useEffect(() => {
    if (data?.data) {
      setUsers(data.data);
    }
  }, [data]);

  return (
    <div className="sm:pr-4 sm:w-64 h-full flex flex-col gap-4 w-full">
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
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
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

export default memo(ChatSidebar);
