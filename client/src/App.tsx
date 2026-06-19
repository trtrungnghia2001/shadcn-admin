import { useLocation } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import RouterTree from "./routers";
import { useEffect } from "react";
import { VideoCallBox } from "./features/chats/components/VideoCallBox";
import StartNotificationDialog from "./components/customs/start-notification-dialog";

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
      <StartNotificationDialog />
    </div>
  );
};

export default App;
