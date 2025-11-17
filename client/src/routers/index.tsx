import AppPage from "@/features/apps";
import DashboardPage from "@/features/dashboard";
import TasksPage from "@/features/tasks/TasksPage";
import UsersPage from "@/features/users/UsersPage";
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
    {
      path: "apps",
      element: <AppPage />,
    },
    {
      path: "users",
      element: <UsersPage />,
    },
  ]);
  return routers;
};

export default RouterTree;
