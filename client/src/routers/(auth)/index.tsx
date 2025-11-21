import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import OTPPage from "@/features/auth/pages/OTPPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import SigninPage from "@/features/auth/pages/SigninPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import { useRoutes } from "react-router-dom";

const AuthRouter = () => {
  const routers = useRoutes([
    {
      path: "signin",
      element: <SigninPage />,
    },
    {
      path: "signup",
      element: <SignupPage />,
    },
    {
      path: "forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "reset-password",
      element: <ResetPasswordPage />,
    },
    {
      path: "otp",
      element: <OTPPage />,
    },
  ]);
  return routers;
};

export default AuthRouter;
