import { Button } from "@/components/ui/button";
import { CloudUpload, Loader } from "lucide-react";
import { memo, useState } from "react";
import ImportDialog from "./components/ImportDialog";

export interface ButtonImportProps {
  handleImport?: (file: File) => void;
  isLoading?: boolean;
}

const ButtonImport = ({ handleImport, isLoading }: ButtonImportProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => setOpen(true)}
        disabled={isLoading}
      >
        <span>Import</span>
        {isLoading ? (
          <Loader size={18} className="animate-spin" />
        ) : (
          <CloudUpload size={18} />
        )}
      </Button>
      <ImportDialog
        open={open}
        onOpenChange={setOpen}
        onImport={handleImport}
      />
    </>
  );
};

export default memo(ButtonImport);
