import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle, type DialogProps } from "@radix-ui/react-dialog";
import UserForm from "./UserForm";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "../data/store";
import type { UserDTO } from "../data/schema";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const UserDialog = ({ ...props }: DialogProps) => {
  const { currentData, open, setOpen, setCurrentData, create, update } =
    useUserStore();

  const createUpdateMutation = useMutation({
    mutationFn: async (data: UserDTO) => {
      if (open === "update" && currentData) {
        return await update(currentData?._id, data);
      }
      return await create(data);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setOpen(false);
      setCurrentData(null);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-lg overflow-y-auto h-[calc(100vh-2rem)]">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {open === "create" && `Add New User`}
            {open === "update" && `Edit User`}
          </DialogTitle>
          <DialogDescription>
            {open === "create" &&
              `Create new user here. Click save when you're done.`}
            {open === "update" &&
              `Update the user here. Click save when you're done.`}
          </DialogDescription>
        </DialogHeader>

        <UserForm mutate={createUpdateMutation.mutate} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form="user-form" type="submit">
            {createUpdateMutation.isPending && (
              <Loader className="animate-spin" />
            )}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
