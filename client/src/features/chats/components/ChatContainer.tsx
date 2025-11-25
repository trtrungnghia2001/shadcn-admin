import { useInfiniteQuery } from "@tanstack/react-query";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { getMessageApi } from "../data/api";
import { useChatContext } from "../data/context";
import { useEffect, useMemo, useRef } from "react";
import ChatMessage from "./ChatMessage";

const ChatContainer = () => {
  const { currentUser, messages } = useChatContext();
  const { data } = useInfiniteQuery({
    queryKey: ["chat", "messages"],
    queryFn: async () => getMessageApi(currentUser?._id as string),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      return null;
    },
  });

  const messagesPage = useMemo(() => {
    const messResp = data?.pages.flatMap((page) => page.data).reverse() || [];

    return [...messResp, ...messages];
  }, [data, messages]);

  const divBottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (divBottomRef.current) {
      divBottomRef.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <ChatHeader />

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messagesPage.map((message, idx) => (
          <ChatMessage chatMessage={message} key={idx} />
        ))}
        <div ref={divBottomRef}></div>
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatContainer;
