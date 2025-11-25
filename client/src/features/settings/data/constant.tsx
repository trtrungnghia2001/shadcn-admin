import AccountForm from "../components/AccountForm";
import AppearanceForm from "../components/AppearanceForm";
import DisplayForm from "../components/DisplayForm";
import NotificationsForm from "../components/NotificationsForm";

export const settingTabs = [
  {
    key: "Account",
    element: <AccountForm />,
    title: "Account",
    description: `Update your account settings. Set your preferred language and timezone.`,
  },
  {
    key: "Appearance",
    element: <AppearanceForm />,
    title: "Appearance",
    description: `Customize the appearance of the app. Automatically switch between day and night themes.`,
  },
  {
    key: "Notification",
    element: <NotificationsForm />,
    title: "Notification",
    description: `Configure how you receive notifications.`,
  },
  {
    key: "Display",
    element: <DisplayForm />,
    title: "Display",
    description: `Turn items on or off to control what's displayed in the app.`,
  },
];
export const languages = [
  { label: "Vietnam", value: "vn" },
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
];
export const fonts = [`Inter`, `Open Sans`, `Roboto`, `System`];
export const themes = [
  {
    bgColor: `bg-[#ecedef]`,
    bgItemColor: `bg-white`,
    itemColor: `bg-[#ecedef]`,
    value: `light`,
  },
  {
    bgColor: `bg-slate-950`,
    bgItemColor: `bg-slate-800`,
    itemColor: `bg-slate-400`,
    value: `dark`,
  },
];
