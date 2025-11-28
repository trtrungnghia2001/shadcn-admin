import z from "zod";

export const formUserSchema = z.object({
  firstName: z.string().min(1, "Please enter your name"),
  lastName: z.string().min(1, "Please enter your name"),
  username: z.string().min(1, "Please enter your name"),
  email: z.email({
    error: (iss) => (iss.input === "" ? "Please enter your email" : undefined),
  }),
  phoneNumber: z.string().min(1, "Please enter your name"),
  status: z.string().min(1, "Please enter your name"),
  role: z.string().min(1, "Please enter your name"),
});

export type UserDTO = z.infer<typeof formUserSchema>;
