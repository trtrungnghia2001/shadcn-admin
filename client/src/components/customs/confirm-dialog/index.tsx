import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { AlertDialogProps } from "@radix-ui/react-alert-dialog";
import type { AxiosError } from "axios";
import { Loader } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { toast } from "sonner";

interface ConfirmDialogProps extends AlertDialogProps {
  title?: string;
  description?: string;
  handleConfirm: () => Promise<void>;
  confirmText?: string;
  confirmVariant?: "destructive" | "default" | "outline";
}

const ConfirmDialog = ({
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  handleConfirm,
  confirmText = "Confirm",
  confirmVariant = "default",
  onOpenChange,
  ...props
}: ConfirmDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onConfirm = useCallback(async () => {
    setIsLoading(true);

    try {
      await handleConfirm();
      toast.success(`Deleted successfully!`);
    } catch (error) {
      toast.error((error as AxiosError).message);
    } finally {
      setIsLoading(false);
      onOpenChange?.(false);
    }
  }, [handleConfirm, onOpenChange]);

  const onCancel = useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <Button onClick={onConfirm} variant={confirmVariant}>
            {isLoading && <Loader className="animate-spin" />}
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default memo(ConfirmDialog);
