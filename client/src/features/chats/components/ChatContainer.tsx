import { useInfiniteQuery } from "@tanstack/react-query";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { getMessageApi } from "../data/api";
import { useChatContext } from "../data/context";
import { memo, useEffect, useMemo, useRef } from "react";
import ChatMessage from "./ChatMessage";

const ChatContainer = () => {
  const { currentUser, messages, currentUserSeen, typingUser } =
    useChatContext();

  // --- Infinite Query để load message ---
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["chat", "messages", currentUser?._id],
      queryFn: async ({ pageParam }) =>
        getMessageApi(
          currentUser?._id as string,
          `page=${pageParam}&offset=${messages.length}`
        ),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.totalPages) {
          return lastPage.page + 1;
        }
        return undefined;
      },
    });

  // --- Xử lý dữ liệu message ---
  const messagesPage = useMemo(() => {
    const messResp = data?.pages.flatMap((page) => page.data).reverse() || [];

    const messCustom = [...messResp, ...messages].map((mess) => ({
      ...mess,
      readBy: [...mess.readBy, currentUserSeen],
    }));

    return messCustom;
  }, [data, messages, currentUserSeen]);

  const lastMessage = useMemo(
    () => messagesPage.at(-1) || null,
    [messagesPage]
  );

  // --- Ref để quản lý scroll ---
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef(0);

  // --- Infinite scroll observer ---
  useEffect(() => {
    if (!loadMoreRef.current || !scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          const container = scrollContainerRef.current!;
          prevScrollHeightRef.current = container.scrollHeight; // lưu scrollHeight trước khi load page mới
          fetchNextPage();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  // --- Scroll logic ---
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (prevScrollHeightRef.current > 0) {
      // Khi load thêm page cũ, giữ scroll
      const newScrollHeight = container.scrollHeight;
      container.scrollTop = newScrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = 0; // reset
    } else {
      // Khi có message mới thêm ở dưới, scroll xuống cuối
      container.scrollTop = container.scrollHeight;
    }
  }, [messagesPage]);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <ChatHeader />

      <div
        ref={scrollContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-beauty"
      >
        <div ref={loadMoreRef}></div>
        {isFetchingNextPage && (
          <p className="text-center text-xs text-muted-foreground p-4">
            Loading messages...
          </p>
        )}
        {messagesPage.length > 0 &&
          messagesPage.map((message, idx) => (
            <ChatMessage
              chatMessage={message}
              key={idx}
              lastMessId={lastMessage?._id}
            />
          ))}
        {messagesPage.length === 0 && (
          <div className="text-center text-muted-foreground">
            Not messages yet
          </div>
        )}
        {typingUser && (
          <p className="text-xs text-muted-foreground italic">Typing...</p>
        )}
      </div>

      <ChatInput />
    </div>
  );
};

export default memo(ChatContainer);
