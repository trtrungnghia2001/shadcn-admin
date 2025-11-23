import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sidebarLinks } from "@/constants/links";

import clsx from "clsx";
import { ChevronRight, VenusAndMars } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function AppSidebar() {
  return (
    <Sidebar className="p-2">
      <SidebarHeader className="bg-background ">
        <div className="flex items-center gap-2 p-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground size-8 rounded-md flex items-center justify-center">
            <VenusAndMars size={16} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-sm">Shadcn Admin</p>
            <p className="text-xs">Vite + ShadcnUI</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        {sidebarLinks.map(({ items, label }, idx) => (
          <SidebarGroup key={idx}>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <AppSidebarItem {...item} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="bg-background">
        <div className="flex items-center gap-2 px-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>TTN</AvatarFallback>
          </Avatar>
          <div className="text-xs">
            <p className="font-medium">satnaing</p>
            <p className="text-muted-foreground font-normal">
              satnaingdev@gmail.com
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

type SidebarItemProps = {
  icon?: React.ComponentType<{ size?: number }>;
  label: string;
  path?: string;
  items?: SidebarItemProps[];
};

const AppSidebarItem = ({
  icon: Icon,
  items,
  label,
  path,
}: SidebarItemProps) => {
  const location = useLocation();
  const isActiveGroup =
    items && items.some((child) => location.pathname.includes(child.path!));
  const [isOpen, setIsOpen] = useState(isActiveGroup);

  // ---- path → NavLink ----
  if (path) {
    return (
      <NavLink
        to={path}
        className={({ isActive }) =>
          clsx([
            `flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-sidebar-accent`,
            isActive && `bg-sidebar-accent font-semibold`,
          ])
        }
      >
        {Icon && <Icon size={16} />}
        <span>{label}</span>
      </NavLink>
    );
  }

  // ---- items → Collapsible ----
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between gap-2 w-full cursor-pointer py-1.5 px-2 rounded-md hover:bg-sidebar-accent">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} />}
          <span>{label}</span>
        </div>
        <ChevronRight
          size={16}
          className={clsx([
            "transition-transform duration-200",
            isOpen ? "rotate-90" : "rotate-0",
          ])}
        />
      </CollapsibleTrigger>

      <CollapsibleContent
        className={clsx(
          "ml-4 border-l pl-2 mt-2 flex flex-col gap-1 overflow-hidden",
          "data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up"
        )}
      >
        {items?.map((child) => (
          <AppSidebarItem {...child} key={child.label} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
