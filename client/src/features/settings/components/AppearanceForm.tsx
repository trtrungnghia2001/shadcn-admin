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
import { formAppearanceSchema, type AppearanceDTO } from "../data/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fonts, themes } from "../data/constant";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import clsx from "clsx";
import { useEffect } from "react";
import { useTheme } from "@/features/theme/data/context";
import type { Theme } from "@/features/theme/data/type";
import { useFontStore } from "../data/store";

const AppearanceForm = () => {
  const { theme, setTheme } = useTheme();
  const { font, setFont } = useFontStore();

  const form = useForm<AppearanceDTO>({
    resolver: zodResolver(formAppearanceSchema),
    defaultValues: {
      font: "",
      theme: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: AppearanceDTO) {
    setTheme(values.theme as Theme);
    setFont(values.font);
  }

  useEffect(() => {
    form.reset({
      font,
      theme,
    });
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="font"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    if (val) field.onChange(val);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormDescription>
                Set the font you want to use in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <FormControl>
                <FormDescription>
                  Select the theme for the dashboard.
                </FormDescription>
              </FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid gap-4 grid-cols-2 w-max"
              >
                {themes.map((theme) => (
                  <FormItem key={theme.value}>
                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                      <FormControl>
                        <RadioGroupItem
                          value={theme.value}
                          className="sr-only"
                        />
                      </FormControl>

                      <div className="border-muted hover:border-accent items-center rounded-md border-2 p-1">
                        <div
                          className={clsx(
                            "space-y-2 rounded-sm p-2",
                            theme.bgColor
                          )}
                        >
                          <div
                            className={clsx(
                              "space-y-2 rounded-md p-2 shadow-xs",
                              theme.bgItemColor
                            )}
                          >
                            <div
                              className={clsx(
                                "h-2 w-[80px] rounded-lg",
                                theme.itemColor
                              )}
                            />
                            <div
                              className={clsx(
                                "h-2 w-[100px] rounded-lg",
                                theme.itemColor
                              )}
                            />
                          </div>

                          <div
                            className={clsx(
                              "flex items-center space-x-2 rounded-md p-2 shadow-xs",
                              theme.bgItemColor
                            )}
                          >
                            <div
                              className={clsx(
                                "h-4 w-4 rounded-full",
                                theme.itemColor
                              )}
                            />
                            <div
                              className={clsx(
                                "h-2 w-[100px] rounded-lg",
                                theme.itemColor
                              )}
                            />
                          </div>

                          <div
                            className={clsx(
                              "flex items-center space-x-2 rounded-md p-2 shadow-xs",
                              theme.bgItemColor
                            )}
                          >
                            <div
                              className={clsx(
                                "h-4 w-4 rounded-full",
                                theme.itemColor
                              )}
                            />
                            <div
                              className={clsx(
                                "h-2 w-[100px] rounded-lg",
                                theme.itemColor
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update preferences</Button>
      </form>
    </Form>
  );
};

export default AppearanceForm;
