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
import { sidebarLinks } from "@/constants/links";
import clsx from "clsx";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import Search from "./Search";

const Header = () => {
  const navs = sidebarLinks[2].items[0].items;
  console.log({ navs });

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
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>TTN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-xs">
              <p className="font-medium">satnaing</p>
              <p className="text-muted-foreground font-normal">
                satnaingdev@gmail.com
              </p>
            </DropdownMenuLabel>
            <Separator />
            <DropdownMenuGroup></DropdownMenuGroup>
            {navs?.map((item) => (
              <DropdownMenuItem key={item.path} asChild>
                <NavLink to={item.path}>{item.label}</NavLink>
              </DropdownMenuItem>
            ))}

            <Separator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
