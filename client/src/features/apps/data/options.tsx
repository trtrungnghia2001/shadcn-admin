import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";

export const appTypeOptions = [
  {
    label: "All Apps",
    value: "all",
  },
  {
    label: "Connected",
    value: "connected",
  },
  {
    label: "Not Connected",
    value: "connect",
  },
];
export const appSortOptions = [
  {
    label: "Ascending",
    value: "asc",
    icon: ArrowDownAZ,
  },
  {
    label: "Descending",
    value: "desc",
    icon: ArrowUpAZ,
  },
];
