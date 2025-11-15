import { useRoutes } from "react-router-dom";
import Dashboard from "./pages/dashboard";

const App = () => {
  const routers = useRoutes([
    {
      index: true,
      element: <Dashboard />,
    },
  ]);
  return routers;
};

export default App;
