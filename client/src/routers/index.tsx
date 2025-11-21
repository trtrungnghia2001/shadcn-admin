import AppPage from "@/features/apps";
import DashboardPage from "@/features/dashboard";
import { TaskProvider } from "@/features/tasks/data/provider";
import TasksPage from "@/features/tasks/TasksPage";
import UsersPage from "@/features/users/UsersPage";
import { useRoutes } from "react-router-dom";
import ErrorRouter from "./(errors)";
import AuthRouter from "./(auth)";
import { ComingSoon } from "@/components/layouts/ComingSoon";

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
    {
      path: "auth/*",
      element: <AuthRouter />,
    },
    {
      path: "errors/*",
      element: <ErrorRouter />,
    },
    {
      path: "*",
      element: <ComingSoon />,
    },
  ]);
  return routers;
};

export default RouterTree;
