import DashboardPage from "@/features/dashboard";
import TasksPage from "@/features/tasks/TasksPage";
import { useRoutes } from "react-router-dom";

const RouterTree = () => {
  const routers = useRoutes([
    {
      index: true,
      element: <DashboardPage />,
    },
    {
      path: "tasks",
      element: <TasksPage />,
    },
  ]);
  return routers;
};

export default RouterTree;
