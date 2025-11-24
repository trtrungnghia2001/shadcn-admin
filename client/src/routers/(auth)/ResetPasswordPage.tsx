import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Link } from "react-router-dom";
import ResetPasswordForm from "../../features/auth/components/ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <div className="flex items-center justify-center h-full w-full sm:p-8">
      <Card className="sm:max-w-[440px] w-full">
        <CardHeader>
          <CardTitle className="text-lg">Reset Password</CardTitle>
          <CardDescription>
            Create a new password for your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ResetPasswordForm />
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
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

export default ResetPasswordPage;
