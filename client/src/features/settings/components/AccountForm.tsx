import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { formAccountSchema, type AccountDTO } from "../data/schema";
import { useAuthStore } from "@/features/_authen/data/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages } from "../data/constant";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

const AccountForm = () => {
  const { auth, updateMe } = useAuthStore();
  const { isPending, mutate } = useMutation({
    mutationFn: async (data: AccountDTO) => await updateMe(data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useForm<AccountDTO>({
    resolver: zodResolver(formAccountSchema),
    defaultValues: {
      name: "",
      language: "",
      dob: "",
      bio: "",
      email: "",
      urls: [{ url: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "urls",
    control: form.control,
  });

  // 2. Define a submit handler.
  function onSubmit(values: AccountDTO) {
    mutate(values);
  }

  useEffect(() => {
    if (auth) {
      form.reset(auth);
    }
  }, [auth]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    if (val) field.onChange(val);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can @mention other users and organizations to link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Social Links</FormLabel>

          {fields.map((item, index) => (
            <div key={item.id} className="flex items-start gap-2">
              <FormField
                control={form.control}
                name={`urls.${index}.url`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ url: "" })}
          >
            Add URL
          </Button>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader className="animate-spin" />}
          Update Account
        </Button>
      </form>
    </Form>
  );
};

export default AccountForm;
