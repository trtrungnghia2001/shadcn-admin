import ChatHeader from "./components/ChatHeader";
import ChatInput from "./components/ChatInput";
import ChatItem from "./components/ChatItem";
import ChatSidebar from "./components/ChatSidebar";

const ChatPage = () => {
  const header = document.getElementById("header")?.offsetHeight;
  console.log({ header });

  return (
    <div className="flex items-stretch overflow-hidden h-[calc(100vh-100px)]">
      <ChatSidebar />
      <div className="flex-1 flex flex-col justify-between border rounded-lg overflow-hidden">
        <ChatHeader />
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {Array(12)
            .fill(0)
            .map((_, idx) => (
              <ChatItem owner={idx % 4 == 0} key={idx} />
            ))}
        </div>
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatPage;
