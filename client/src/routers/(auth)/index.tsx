import ForgotPasswordPage from "@/routers/(auth)/ForgotPasswordPage";
import OTPPage from "@/routers/(auth)/OTPPage";
import ResetPasswordPage from "@/routers/(auth)/ResetPasswordPage";
import SigninPage from "@/routers/(auth)/SigninPage";
import SignupPage from "@/routers/(auth)/SignupPage";
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
