import {
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  Sparkles,
  BadgeCheck,
  Command,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";
import { sidebarLinks } from "./data/constant";
import { useAuthStore } from "@/features/_authen/data/store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function AppSidebar() {
  const { pathname } = useLocation();

  const { auth, signout } = useAuthStore();

  return (
    <Sidebar collapsible="icon">
      {/* ================= 1. HEADER ================= */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Acme Corp</span>
                <span className="truncate text-xs text-muted-foreground">
                  Enterprise
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ================= 2. CONTENT (MENU LINKS) ================= */}
      <SidebarContent>
        {sidebarLinks.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = item.icon;
                const hasSubItems = item.items && item.items.length > 0;

                // TRƯỜNG HỢP A: Menu có cấp con (Auth, Errors, Settings)
                if (hasSubItems) {
                  // Kiểm tra xem có item con nào đang active không để tự động mở toang nhóm đó ra
                  const isSubItemActive = item.items?.some(
                    (sub) => pathname === sub.path,
                  );

                  return (
                    <Collapsible
                      key={item.label}
                      asChild
                      defaultOpen={isSubItemActive} // Tự mở nếu có con đang active
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          {/* Highlight nhẹ menu cha nếu có menu con đang active */}
                          <SidebarMenuButton
                            tooltip={item.label}
                            isActive={isSubItemActive}
                          >
                            {Icon && <Icon className="h-4 w-4" />}
                            <span>{item.label}</span>
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => {
                              const SubIcon = subItem.icon;
                              const isSubActive = pathname === subItem.path;

                              return (
                                <SidebarMenuSubItem key={subItem.label}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isSubActive} // Bật trạng thái Active cho sub-item
                                  >
                                    <Link to={subItem.path}>
                                      {SubIcon && (
                                        <SubIcon className="h-4 w-4" />
                                      )}
                                      <span>{subItem.label}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // TRƯỜNG HỢP B: Menu đơn lẻ (Dashboard, Tasks...)
                const isActive = pathname === item.path;

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      isActive={isActive} // Bật trạng thái Active cho item đơn
                    >
                      <Link to={item.path}>
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ================= 3. FOOTER ================= */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar>
                    <AvatarImage src={auth?.avatar || ""} alt="@shadcn" />
                    <AvatarFallback>
                      {auth?.name.split(" ").map((item) => item[0])}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{auth?.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {auth?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar>
                      <AvatarImage src={auth?.avatar || ""} alt="@shadcn" />
                      <AvatarFallback>
                        {auth?.name.split(" ").map((item) => item[0])}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {auth?.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {auth?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    Account settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={signout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
