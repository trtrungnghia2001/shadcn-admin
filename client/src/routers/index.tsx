import AppPage from "@/features/apps";
import DashboardPage from "@/features/dashboard";
import { TaskProvider } from "@/features/tasks/data/provider";
import TasksPage from "@/features/tasks/TasksPage";
import UsersPage from "@/features/users/UsersPage";
import { useRoutes } from "react-router-dom";
import ErrorRouter from "./(errors)";
import AuthRouter from "./(auth)";
import { ComingSoon } from "@/components/layouts/ComingSoon";
import ChatPage from "@/features/chats";
import Layout from "@/components/layouts/Layout";
import SigninPage from "@/features/_authen/pages/SigninPage";
import SignupPage from "@/features/_authen/pages/SignupPage";
import AuthProtected from "@/features/_authen/components/AuthProtected";

const RouterTree = () => {
  const routers = useRoutes([
    {
      path: `/`,
      element: (
        <AuthProtected>
          <Layout />
        </AuthProtected>
      ),
      children: [
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
          path: "chats/*",
          element: <ChatPage />,
        },
        {
          path: "*",
          element: <ComingSoon />,
        },
      ],
    },
    //
    {
      path: "/signin",
      element: <SigninPage />,
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
  ]);
  return routers;
};

export default RouterTree;
