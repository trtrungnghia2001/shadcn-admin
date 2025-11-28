import { DataTableBulkActions } from "@/components/customs/data-table/components/DataTableBulkActions";
import { exportToXLSX } from "@/components/customs/data-table/utils/import-export-file";
import type { Table } from "@tanstack/react-table";
import { ArrowDownUp, CircleArrowUp, Download, Trash2 } from "lucide-react";
import { roles, statuses } from "../data/constants";
import type { User } from "../data/type";
import { useUserStore } from "../data/store";

interface DttbBulkActionsProps {
  table: Table<User>;
}

export function DttbBulkActions({ table }: DttbBulkActionsProps) {
  const { setOpen } = useUserStore();
  return (
    <DataTableBulkActions
      table={table}
      entityName="tasks"
      items={[
        {
          icon: <CircleArrowUp />,
          title: "Update status",

          list: statuses.map((item) => ({
            title: item.label,
            onClick: () => {
              // const rows = table
              //   .getFilteredSelectedRowModel()
              //   .rows.map((r) => r.original);
              // handleUpdateSelectTask(rows, "status", item.value);
            },
          })),
        },
        {
          icon: <ArrowDownUp />,
          title: "Update priority",

          list: roles.map((item) => ({
            title: item.label,
            icon: <item.icon />,
            onClick: () => {
              // const rows = table
              //   .getFilteredSelectedRowModel()
              //   .rows.map((r) => r.original);
              // handleUpdateSelectTask(rows, "priority", item.value);
            },
          })),
        },
        {
          icon: <Download />,
          title: "Export",
          onClick: () => {
            const rows = table
              .getFilteredSelectedRowModel()
              .rows.map((r) => r.original);
            exportToXLSX({ rows });
          },
        },
        {
          icon: <Trash2 />,
          title: "Delete",
          variant: "destructive",
          onClick: () => {
            setOpen("deleteSelect");
          },
        },
      ]}
    />
  );
}

export default DttbBulkActions;
