import { DataTableBulkActions } from "@/components/customs/data-table/components/DataTableBulkActions";
import { exportToXLSX } from "@/components/customs/data-table/utils/import-export-file";
import type { Table } from "@tanstack/react-table";
import { ArrowDownUp, CircleArrowUp, Download, Trash2 } from "lucide-react";
import { useTaskContext } from "../data/context";
import { priorities, statuses } from "../data/constants";
import type { Task } from "../data/type";

interface DttbBulkActionsProps {
  table: Table<Task>;
}

export function DttbBulkActions({ table }: DttbBulkActionsProps) {
  const { setOpen, handleUpdateSelectTask } = useTaskContext();
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
            icon: <item.icon />,
            onClick: () => {
              const rows = table
                .getFilteredSelectedRowModel()
                .rows.map((r) => r.original);
              handleUpdateSelectTask(rows, "status", item.value);
            },
          })),
        },
        {
          icon: <ArrowDownUp />,
          title: "Update priority",

          list: priorities.map((item) => ({
            title: item.label,
            icon: <item.icon />,
            onClick: () => {
              const rows = table
                .getFilteredSelectedRowModel()
                .rows.map((r) => r.original);
              handleUpdateSelectTask(rows, "priority", item.value);
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
            exportToXLSX(`selected.xlsx`, rows);
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
