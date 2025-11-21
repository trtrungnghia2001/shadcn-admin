import ForbiddenPage from "@/features/errors/pages/ForbiddenPage";
import InternalSeverErrorPage from "@/features/errors/pages/InternalSeverErrorPage";
import MaintenanceErrorPage from "@/features/errors/pages/MaintenanceErrorPage";
import NotFoundPage from "@/features/errors/pages/NotFoundPage";
import UnauthorizedPage from "@/features/errors/pages/UnauthorizedPage";
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
