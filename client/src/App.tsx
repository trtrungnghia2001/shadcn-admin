import { Toaster } from "./components/ui/sonner";
import RouterTree from "./routers";

const App = () => {
  return (
    <div>
      <RouterTree />
      <Toaster />
    </div>
  );
};

export default App;
