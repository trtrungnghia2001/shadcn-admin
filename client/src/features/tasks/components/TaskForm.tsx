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
import z from "zod";
import { useTaskContext } from "../data/context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Task } from "../data/type";
import { useEffect } from "react";
import { labels, priorities, statuses } from "../data/constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

const TaskForm = () => {
  const { handleAddTask, handleUpdateTask, open, currentData, setOpen } =
    useTaskContext();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: FormType) => {
    if (open === "update" && currentData) {
      handleUpdateTask({ ...data, id: currentData.id });
    } else {
      handleAddTask(data as Task);
    }

    form.reset(defaultValues);
    setOpen(false);
  };

  useEffect(() => {
    if (open === "update" && currentData) {
      form.reset(currentData);
    } else {
      form.reset(defaultValues);
    }
  }, [open, currentData]);

  return (
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
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    if (val !== "") field.onChange(val);
                  }}
                >
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
                    <FormItem key={label.value} className="flex items-center">
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
  );
};

export default TaskForm;
