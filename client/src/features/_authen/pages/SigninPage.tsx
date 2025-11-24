import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Link } from "react-router-dom";
import SigninForm from "../components/SigninForm";

const SigninPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-screen sm:p-8">
      <Card className="sm:max-w-[440px] w-full">
        <CardHeader>
          <CardTitle className="text-lg">Sign in</CardTitle>
          <CardDescription>
            Enter your email and password below to log into your account.
            <br />
            You don&apos;t have an account?{" "}
            <Link to={`/signup`} className="underline">
              Sign Up
            </Link>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SigninForm />
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <div className="text-muted-foreground text-center">
            By clicking sign in, you agree to our
            <Link to={`/`} className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to={`/`} className="underline">
              Privacy Policy
            </Link>
            .
          </div>
          <div className="text-muted-foreground text-center">
            <Link to={`/forgot-password`} className="underline">
              Forgot Password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SigninPage;
