import { Button } from "@/components/ui/button";
import { Download, Loader } from "lucide-react";

export interface ButtonImportProps {
  handleExport?: () => void;
  isLoading?: boolean;
}

const ButtonExport = ({ isLoading, handleExport }: ButtonImportProps) => {
  return (
    <Button onClick={handleExport} variant={"outline"} className="space-x-1">
      <span>Export</span>
      {isLoading ? (
        <Loader size={18} className="animate-spin" />
      ) : (
        <Download size={18} />
      )}
    </Button>
  );
};

export default ButtonExport;
