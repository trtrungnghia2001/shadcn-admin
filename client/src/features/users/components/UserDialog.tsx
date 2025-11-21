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

const UserDialog = ({ ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto h-[calc(100vh-2rem)]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create new user here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <UserForm />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form="user-form" type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
