import ThemeMenu from "@/features/theme/components/ThemeMenu";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import Search from "./Search";
import { useAuthStore } from "@/features/_authen/data/store";
import { sidebarLinks } from "./data/constant";

const Header = () => {
  const navs = sidebarLinks[2].items[0].items;
  const { auth, signout } = useAuthStore();

  return (
    <header
      id="header"
      className={clsx([
        // "fixed top-0 left-64 right-0",
        "flex items-center justify-between gap-6 p-4",
        "after:bg-background/20 after:absolute after:inset-0 after:-z-10 after:backdrop-blur-lg",
      ])}
    >
      <div className="relative flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="!h-5" />
        <Search />
      </div>
      <div className="flex items-center gap-4">
        <ThemeMenu />
        <Button size="icon" variant="ghost" className="rounded-full">
          <Settings />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={auth?.avatar || ""} alt="@shadcn" />
              <AvatarFallback>
                {auth?.name.split(" ").map((item) => item[0])}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="end">
            <DropdownMenuLabel className="text-xs">
              <p className="font-medium">{auth?.name}</p>
              <p className="text-muted-foreground font-normal">{auth?.email}</p>
            </DropdownMenuLabel>
            <Separator />
            <DropdownMenuGroup>
              {navs?.map((item) => (
                <DropdownMenuItem key={item.path} asChild>
                  <NavLink to={item.path}>{item.label}</NavLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <Separator />
            <DropdownMenuItem onClick={signout}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
