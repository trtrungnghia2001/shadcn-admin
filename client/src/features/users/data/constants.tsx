import { CreditCard, Shield, UserCheck, Users } from "lucide-react";

export const roles = [
  {
    label: "Superadmin",
    value: "superadmin",
    icon: Shield,
  },
  {
    label: "Admin",
    value: "admin",
    icon: UserCheck,
  },
  {
    label: "Manager",
    value: "manager",
    icon: Users,
  },
  {
    label: "Cashier",
    value: "cashier",
    icon: CreditCard,
  },
];
export const statuses = [
  {
    label: "Active",
    value: "active",
    className: "bg-green-100 text-green-700 border border-green-200",
  },
  {
    label: "Inactive",
    value: "inactive",
    className: "bg-gray-100 text-gray-700 border border-gray-200",
  },
  {
    label: "Invited",
    value: "invited",
    className: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  {
    label: "Suspended",
    value: "suspended",
    className: "bg-red-100 text-red-700 border border-red-200",
  },
];
