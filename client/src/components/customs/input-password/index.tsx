import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";

type InputPasswordProps = ComponentProps<typeof Input>;

const InputPassword = ({ className, ...props }: InputPasswordProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Input
        {...props}
        className={clsx([`pr-8`, className])}
        type={open ? "text" : "password"}
      />
      <button
        type="button"
        className="absolute top-1/2 -translate-y-1/2 right-2 text-muted-foreground"
        onClick={() => setOpen(!open)}
      >
        {open ? <Eye size={16} /> : <EyeOff size={16} />}
      </button>
    </div>
  );
};

export default InputPassword;
