import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InputPassword from "@/components/customs/input-password";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader, LogIn } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useAuthStore } from "../data/store";
import { useMutation } from "@tanstack/react-query";
import { formSigninSchema, type SigninDTO } from "../data/schema";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

const SigninForm = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const { signin } = useAuthStore();
  const { isPending, mutate } = useMutation({
    mutationFn: async (data: SigninDTO) => await signin(data),
    onSuccess: (data) => {
      toast.success(data.message);

      const redirectUrl = location.state
        ? location.state.pathname + location.state.search
        : "/";
      navigate(redirectUrl);
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useForm<SigninDTO>({
    resolver: zodResolver(formSigninSchema),
    defaultValues: {
      email: "test@gmail.com",
      password: "123456",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: SigninDTO) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <InputPassword placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader className="animate-spin" /> : <LogIn />}
          Sign in
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" type="button" disabled>
            <FaGoogle size={16} /> Google
          </Button>{" "}
          <Button variant="outline" type="button" disabled>
            <FaGithub size={16} /> GitHub
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SigninForm;
