import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col items-center gap-2 text-base">
        <h1>404</h1>
        <p className="font-medium">Oops! Page Not Found!</p>
        <p className="text-muted-foreground text-center">
          It seems like the page you're looking for
          <br />
          does not exist or might have been removed.
        </p>
        <div className="mt-6 space-x-4">
          <Button onClick={() => navigate(-1)} variant={"outline"}>
            Go Back
          </Button>
          <Button onClick={() => navigate(`/`)}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
