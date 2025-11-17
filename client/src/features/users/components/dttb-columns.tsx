import { DataTableColumnHeader } from "@/components/customs/data-table/components/DataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "../data/type";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { roles, statuses } from "../data/constants";
import { DataTableRowActions } from "./dttb-row-actions";

export const DataTableColumn: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;
      const name = `${firstName} ${lastName}`;

      return (
        <Tooltip>
          <TooltipTrigger>{name}</TooltipTrigger>
          <TooltipContent>
            <p>{name}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = statuses.find(
        (item) => item.value === row.original.status
      );
      return <Badge className={status?.className}>{status?.label}</Badge>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = roles.find((item) => item.value === row.original.role);
      if (!role) return null;
      return (
        <div className="flex items-center gap-2">
          <role.icon size={16} className="text-muted-foreground" />
          <span className="capitalize">{role?.label}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
