import { useLocation } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import RouterTree from "./routers";
import { useEffect } from "react";
import { VideoCallBox } from "./features/chats/components/VideoCallBox";

const App = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <div>
      <RouterTree />
      <Toaster />
      <VideoCallBox />
    </div>
  );
};

export default App;
