import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { formDisplaySchema, type DisplayDTO } from "../data/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { displaies } from "../data/constant";

const DisplayForm = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: async (data: DisplayDTO) => {
      console.log({ data });
    },
    onSuccess: () => {
      toast.success(`Update successfully!`);
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useForm<DisplayDTO>({
    resolver: zodResolver(formDisplaySchema),
    defaultValues: {
      items: ["Recents", "Home"],
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: DisplayDTO) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              {displaies.map((item) => (
                <FormField
                  key={item}
                  control={form.control}
                  name="items"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value.includes(item)}
                          onCheckedChange={(check) =>
                            check
                              ? field.onChange([...field.value, item])
                              : field.onChange(
                                  field.value.filter((v) => v !== item)
                                )
                          }
                        />
                      </FormControl>
                      <FormLabel>{item}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader className="animate-spin" />}
          Update notifications
        </Button>
      </form>
    </Form>
  );
};

export default DisplayForm;
