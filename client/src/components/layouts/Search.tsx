import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { memo, useState } from "react";
import { Button } from "../ui/button";
import { ChevronRight, SearchIcon } from "lucide-react";
import { sidebarLinks } from "@/constants/links";
import { NavLink, useNavigate } from "react-router-dom";
import clsx from "clsx";

const Search = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={() => setOpen(true)}
        className={clsx([`text-muted-foreground w-28 sm:w-60 justify-start`])}
      >
        <SearchIcon />
        <span>Search</span>
      </Button>
      <CommandDialog
        modal
        open={open}
        onOpenChange={setOpen}
        className="rounded-lg border shadow-md md:min-w-[450px]"
      >
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {sidebarLinks.map((side) => (
            <CommandGroup key={side.label} heading={side.label}>
              {side.items.map((item) => {
                if (item.items && item.items?.length > 0)
                  return item.items.map((subItem) => (
                    <CommandItem
                      key={subItem.path}
                      onSelect={() => {
                        setOpen(false);
                        navigate(subItem.path);
                      }}
                    >
                      <item.icon />
                      {item.label}
                      <ChevronRight />
                      {subItem.label}
                      <NavLink to={subItem.path}></NavLink>
                    </CommandItem>
                  ));

                return (
                  <CommandItem
                    key={item.path}
                    onSelect={() => {
                      setOpen(false);
                      navigate(item.path);
                    }}
                  >
                    <item.icon />
                    {item.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default memo(Search);
