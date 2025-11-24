import z from "zod";

export const formSignupSchema = z
  .object({
    name: z
      .string()
      .min(1, "Please enter your name")
      .min(6, "Name must be at least 6 characters long"),
    email: z.email({
      error: (iss) =>
        iss.input === "" ? "Please enter your email" : undefined,
    }),
    password: z
      .string()
      .min(1, "Please enter your password")
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password")
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export type SignupDTO = z.infer<typeof formSignupSchema>;

export const formSigninSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === "" ? "Please enter your email" : undefined),
  }),
  password: z
    .string()
    .min(1, "Please enter your password")
    .min(6, "Password must be at least 6 characters long"),
});

export type SigninDTO = z.infer<typeof formSigninSchema>;
