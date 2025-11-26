import { MessagesSquare } from "lucide-react";
import ChatContainer from "./components/ChatContainer";
import ChatSidebar from "./components/ChatSidebar";
import { useChatContext } from "./data/context";

const ChatPage = () => {
  // const header = document.getElementById("header")?.offsetHeight;
  // console.log({ header });
  const { currentUser } = useChatContext();

  return (
    <div className="flex items-stretch overflow-hidden h-[calc(100vh-100px)]">
      <ChatSidebar />
      <div className="hidden sm:block flex-1 border rounded-lg overflow-hidden">
        {currentUser ? (
          <ChatContainer />
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center h-full">
            <MessagesSquare />
            <h4>Your messages</h4>
            <p className="text-muted-foreground">
              Send a message to start a chat.
            </p>
          </div>
        )}
      </div>
      {currentUser && (
        <div className="sm:hidden absolute inset-0 bg-background">
          <ChatContainer />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
