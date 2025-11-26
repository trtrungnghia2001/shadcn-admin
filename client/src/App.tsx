import { useLocation } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import RouterTree from "./routers";
import { useEffect } from "react";

const App = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <div>
      <RouterTree />
      <Toaster />
    </div>
  );
};

export default App;
