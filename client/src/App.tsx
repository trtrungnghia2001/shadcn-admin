import Layout from "./components/layouts/Layout";
import RouterTree from "./routers";

const App = () => {
  return (
    <div>
      <Layout>
        <RouterTree />
      </Layout>
    </div>
  );
};

export default App;
