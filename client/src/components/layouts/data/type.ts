import type { IconType } from "react-icons/lib";

export interface SidebarItem {
  icon?: IconType;
  path: string;
  label: string;
  items?: SidebarItem[];
}

// Nhóm sidebar
export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}
