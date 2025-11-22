import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useTaskContext } from "../data/context";
import { memo } from "react";
import TaskForm from "./TaskForm";

const TaskSheet = ({ open, onOpenChange, ...props }: DialogProps) => {
  const { open: openTask } = useTaskContext();

  return (
    <Sheet open={open} onOpenChange={onOpenChange} {...props}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {openTask === "create" && `Create Task`}
            {openTask === "update" && `Update Task`}
          </SheetTitle>
          <SheetDescription>
            {openTask === "create" &&
              `Add a new task by providing necessary info.Click save when you're done.`}
            {openTask === "update" &&
              `Update the task by providing necessary info.Click save when you're done.`}
          </SheetDescription>
        </SheetHeader>
        <TaskForm />
        <SheetFooter className="gap-2">
          <Button form="tasks-form" type="submit">
            Save changes
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default memo(TaskSheet);
