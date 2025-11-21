import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Link } from "react-router-dom";
import SignupForm from "../form/SignupForm";
const SignupPage = () => {
  return (
    <div className="flex items-center justify-center h-full w-full sm:p-8">
      <Card className="sm:max-w-[440px] w-full">
        <CardHeader>
          <CardTitle className="text-lg">Create an account</CardTitle>
          <CardDescription>
            Enter your email and password to create an account.
            <br />
            Already have an account?{" "}
            <Link to={`/auth/signin`} className="underline">
              Sign In
            </Link>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SignupForm />
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
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
