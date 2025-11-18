import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { themeOptions } from "../data/constants";
import { useTheme } from "../data/context";
import type { Theme } from "../data/type";
import { Check } from "lucide-react";

const ThemeMenu = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const currentOption =
    themeOptions.find(
      (o) => o.value === (theme === "system" ? "system" : resolvedTheme)
    ) ?? themeOptions[2];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="rounded-full">
          {currentOption.icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value as Theme)}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              {option.icon}
              {option.label}
            </div>
            {theme === option.value && <Check />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeMenu;
