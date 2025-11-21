import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Link } from "react-router-dom";
import OTPForm from "../form/OTPForm";

const OTPPage = () => {
  return (
    <div className="flex items-center justify-center h-full w-full sm:p-8">
      <Card className="sm:max-w-[440px] w-full">
        <CardHeader>
          <CardTitle className="text-lg">Two-factor Authentication</CardTitle>
          <CardDescription>
            Please enter the authentication code.
            <br />
            We have sent the authentication code to your email.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <OTPForm />
        </CardContent>

        <CardFooter>
          <div className="text-muted-foreground text-center w-full">
            Haven't received it?{" "}
            <Link to={`/auth/signup`} className="underline">
              Resend a new code.
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OTPPage;
