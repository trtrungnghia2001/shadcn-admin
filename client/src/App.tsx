import { useLocation } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import RouterTree from "./routers";
import { useEffect } from "react";
import VideoCall from "./features/chats/components/VideoCall";

const App = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <div>
      <RouterTree />
      <Toaster />
      <VideoCall />
    </div>
  );
};

export default App;
