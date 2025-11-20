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
import { memo, useCallback } from "react";

interface ConfirmDialogProps extends AlertDialogProps {
  title?: string;
  description?: string;
  handleConfirm: () => void;
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
  const onConfirm = useCallback(() => {
    handleConfirm();
    onOpenChange?.(false);
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
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default memo(ConfirmDialog);
