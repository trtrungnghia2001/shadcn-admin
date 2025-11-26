import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { formNotificationSchema, type NotificationDTO } from "../data/schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { notify_abouts, notify_emails } from "../data/constant";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

const NotificationsForm = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: async (data: NotificationDTO) => {
      console.log({ data });
    },
    onSuccess: () => {
      toast.success(`Update successfully!`);
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useForm<NotificationDTO>({
    resolver: zodResolver(formNotificationSchema),
    defaultValues: {
      type: "",
      mobile: false,
      communication_emails: false,
      social_emails: true,
      marketing_emails: false,
      security_emails: true,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: NotificationDTO) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel>Notify me about...</FormLabel>
              <FormControl>
                <RadioGroup value={field.value} onValueChange={field.onChange}>
                  {notify_abouts.map((item) => (
                    <div key={item.value} className="flex items-center gap-3">
                      <RadioGroupItem value={item.value} id={item.value} />
                      <Label htmlFor={item.value}>{item.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <div className="font-medium">Email Notifications</div>
          {notify_emails.map((item) => (
            <FormField
              key={item.name}
              control={form.control}
              name={item.name as keyof NotificationDTO}
              render={({ field }) => (
                <FormItem className="rounded-lg border p-4 flex items-center justify-between gap-8">
                  <div>
                    <FormLabel htmlFor={item.name}>{item.label}</FormLabel>
                    <div className="mt-2 text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                      id={item.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem className="flex items-start gap-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1">
                <FormLabel>
                  Use different settings for my mobile devices
                </FormLabel>
                <FormDescription>
                  You can manage your mobile notifications in the mobile
                  settings page.
                </FormDescription>
              </div>

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

export default NotificationsForm;
