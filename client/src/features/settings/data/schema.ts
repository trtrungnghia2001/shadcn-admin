import z from "zod";

export const formAccountSchema = z.object({
  name: z
    .string()
    .min(1, "Please enter your name")
    .min(6, "Name must be at least 6 characters long"),
  dob: z.string().optional(),
  language: z.string().optional(),
  email: z.string().optional(),
  bio: z.string().optional(),
  urls: z
    .array(
      z.object({
        url: z.string().url("Invalid URL"),
      })
    )
    .optional(),
});
export type AccountDTO = z.infer<typeof formAccountSchema>;

export const formAppearanceSchema = z.object({
  font: z.string(),
  theme: z.string(),
});
export type AppearanceDTO = z.infer<typeof formAppearanceSchema>;
