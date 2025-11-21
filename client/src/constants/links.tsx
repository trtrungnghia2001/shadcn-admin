import {
  LayoutDashboard,
  Users,
  Settings,
  HelpCircle,
  ListTodo,
  Package,
  MessagesSquare,
  CircleSlash,
  ShieldAlert,
  SearchX,
  Bug,
  Construction,
  ShieldCheck,
  User,
  Palette,
  Bell,
  Smartphone,
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
    label: "Page",
    items: [
      {
        icon: ShieldCheck,
        label: "Auth",
        items: [
          {
            path: "auth/signin",
            label: "Sign In",
          },
          {
            path: "auth/signup",
            label: "Sign Up",
          },
          {
            path: "auth/forgot-password",
            label: "Forgot Password",
          },
          {
            path: "auth/reset-password",
            label: "Reset Password",
          },
          {
            path: "auth/otp",
            label: "OTP",
          },
        ],
      },
      {
        icon: Bug,
        label: "Errors",
        items: [
          {
            icon: CircleSlash,
            path: "/errors/unauthorized",
            label: "Unauthorized",
          },
          {
            icon: ShieldAlert,
            path: "/errors/forbidden",
            label: "Forbidden",
          },
          {
            icon: SearchX,
            path: "/errors/not-found",
            label: "Not Found",
          },
          {
            icon: Bug,
            path: "/errors/internal-server",
            label: "Internal Server Erro",
          },
          {
            icon: Construction,
            path: "/errors/maintenance",
            label: "Maintenance",
          },
        ],
      },
    ],
  },

  {
    label: "Other",
    items: [
      {
        icon: Settings,
        label: "Settings",
        items: [
          { icon: User, path: "/settings/profile", label: "Profile" },
          { icon: Settings, path: "/settings/account", label: "Account" },
          { icon: Palette, path: "/settings/appearance", label: "Appearance" },
          { icon: Bell, path: "/settings/notification", label: "Notification" },
          { icon: Smartphone, path: "/settings/display", label: "Display" },
        ],
      },
      { icon: HelpCircle, path: "/help-center", label: "Help Center" },
    ],
  },
];
