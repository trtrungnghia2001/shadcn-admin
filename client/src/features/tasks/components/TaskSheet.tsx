import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import z from "zod";
import { labels, priorities, statuses } from "../data/constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTaskContext } from "../data/context";
import type { Task } from "../data/type";
import { useEffect } from "react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required."),
  status: z.string().min(1, "Please select a status."),
  label: z.string().min(1, "Please select a label."),
  priority: z.string().min(1, "Please choose a priority."),
});
type FormType = z.infer<typeof formSchema>;

const defaultValues = {
  title: "",
  status: "",
  label: "",
  priority: "",
};

const TaskSheet = ({ open, onOpenChange, ...props }: DialogProps) => {
  const { handleAddTask, handleUpdateTask, edit } = useTaskContext();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: FormType) => {
    if (edit.isEdit && edit.taskEdit) {
      handleUpdateTask({ ...data, id: edit.taskEdit.id });
    } else {
      handleAddTask(data as Task);
    }

    onOpenChange?.(false);
    form.reset(defaultValues);
  };

  useEffect(() => {
    if (edit.isEdit && edit.taskEdit) {
      form.reset(edit.taskEdit);
    } else {
      form.reset(defaultValues);
    }
  }, [edit]);

  console.log({ edit });

  return (
    <Sheet open={open} onOpenChange={onOpenChange} {...props}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Create Task</SheetTitle>
          <SheetDescription>
            Add a new task by providing necessary info.Click save when you're
            done.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id="tasks-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-6 overflow-y-auto px-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter a title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select dropdown" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <status.icon size={16} /> {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {labels.map((label) => (
                        <FormItem
                          key={label.value}
                          className="flex items-center"
                        >
                          <FormControl>
                            <RadioGroupItem value={label.value} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {label.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {priorities.map((priority) => (
                        <FormItem
                          key={priority.value}
                          className="flex items-center"
                        >
                          <FormControl>
                            <RadioGroupItem value={priority.value} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {priority.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter className="gap-2">
          <Button form="tasks-form" type="submit">
            Save changes
          </Button>{" "}
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TaskSheet;
