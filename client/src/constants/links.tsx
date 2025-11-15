import TabsAnalytics from "@/pages/dashboard/TabsAnalytics";
import TabsOverview from "@/pages/dashboard/TabsOverview";
import {
  LayoutDashboard,
  Users,
  Settings,
  HelpCircle,
  ListTodo,
  Package,
  MessagesSquare,
} from "lucide-react";

export const sidebarLinks = [
  {
    label: "General",
    items: [
      { icon: LayoutDashboard, path: "/", label: "Dashboard" },
      { icon: ListTodo, path: "/tasks", label: "Tasks" },
      { icon: Package, path: "/apps", label: "Apps" },
      { icon: MessagesSquare, path: "/chats", label: "Chats" },
      { icon: Users, path: "/users", label: "Users" },
    ],
  },

  {
    label: "Other",
    items: [
      {
        icon: Settings,
        label: "Settings",
        items: [
          { icon: Settings, path: "/settings/general", label: "General" },
          { icon: Settings, path: "/settings/billing", label: "Billing" },
        ],
      },
      { icon: HelpCircle, path: "/help-center", label: "Help Center" },
    ],
  },
];

export const dashboardTabs = [
  {
    label: `Overview`,
    element: <TabsOverview />,
  },
  {
    label: `Analytics`,
    element: <TabsAnalytics />,
  },
  {
    label: `Reports`,
    element: <TabsOverview />,
  },
  {
    label: `Notifications`,
    element: <TabsOverview />,
  },
];
