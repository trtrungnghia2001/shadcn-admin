import AppPage from "@/features/apps";
import DashboardPage from "@/features/dashboard";
import { TaskProvider } from "@/features/tasks/data/provider";
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
      element: (
        <TaskProvider>
          <TasksPage />,
        </TaskProvider>
      ),
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
