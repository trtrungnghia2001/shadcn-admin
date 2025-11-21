import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Link } from "react-router-dom";
import ForgotPasswordForm from "../form/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <div className="flex items-center justify-center h-full w-full sm:p-8">
      <Card className="sm:max-w-[440px] w-full">
        <CardHeader>
          <CardTitle className="text-lg">Forgot Password</CardTitle>
          <CardDescription>
            Enter your registered email and
            <br />
            we will send you a link to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ForgotPasswordForm />
        </CardContent>

        <CardFooter>
          <div className="text-muted-foreground text-center w-full">
            Don't have an account?{" "}
            <Link to={`/auth/signup`} className="underline">
              Sign Up.
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
