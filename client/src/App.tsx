import Layout from "./components/layouts/Layout";
import { Toaster } from "./components/ui/sonner";
import RouterTree from "./routers";

const App = () => {
  return (
    <div>
      <Layout>
        <RouterTree />
      </Layout>
      <Toaster />
    </div>
  );
};

export default App;
