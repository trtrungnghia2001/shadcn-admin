import ForbiddenPage from "@/routers/(errors)/ForbiddenPage";
import InternalSeverErrorPage from "@/routers/(errors)/InternalSeverErrorPage";
import MaintenanceErrorPage from "@/routers/(errors)/MaintenanceErrorPage";
import NotFoundPage from "@/routers/(errors)/NotFoundPage";
import UnauthorizedPage from "@/routers/(errors)/UnauthorizedPage";
import { useRoutes } from "react-router-dom";

const ErrorRouter = () => {
  const routers = useRoutes([
    {
      path: "unauthorized",
      element: <UnauthorizedPage />,
    },
    {
      path: "forbidden",
      element: <ForbiddenPage />,
    },
    {
      path: "not-found",
      element: <NotFoundPage />,
    },
    {
      path: "internal-server",
      element: <InternalSeverErrorPage />,
    },
    {
      path: "maintenance",
      element: <MaintenanceErrorPage />,
    },
  ]);
  return routers;
};

export default ErrorRouter;
