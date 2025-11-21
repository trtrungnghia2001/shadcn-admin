import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col items-center gap-2 text-base">
        <h1>403</h1>
        <p className="font-medium">Access Forbidden</p>
        <p className="text-muted-foreground text-center">
          You don't have necessary permission
          <br />
          to view this resource.
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

export default ForbiddenPage;
