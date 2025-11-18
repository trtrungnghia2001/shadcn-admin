import { DataTable } from "@/components/customs/data-table";
import { tasks } from "./data/data";
import { DataTableColumn } from "./components/dttb-columns";
import { useDataTable } from "@/components/customs/data-table/hooks/use-data-table";
import { DataTablePagination } from "@/components/customs/data-table/components/DataTablePagination";
import { DataTableBulkActions } from "@/components/customs/data-table/components/DataTableBulkActions";
import { DataTableToolbar } from "@/components/customs/data-table/components/DataTableToolbar";
import { priorities, statuses } from "./data/constants";
import { Button } from "@/components/ui/button";
import { Download, Plus, Trash2 } from "lucide-react";
import ButtonImport from "@/components/customs/button-import";
import {
  exportToXLSX,
  importXLSX,
} from "@/components/customs/data-table/utils/import-export-file";
import { useEffect, useState } from "react";
import type { Task } from "./data/type";
import { toast } from "sonner";

const TasksPage = () => {
  const [data, setData] = useState<Task[]>(() => {
    const tasksLocal = localStorage.getItem("tasks-data");
    return tasksLocal ? JSON.parse(tasksLocal) : tasks;
  });
  useEffect(() => {
    localStorage.setItem("tasks-data", JSON.stringify(data));
  }, [data]);

  const { table } = useDataTable({
    data: data,
    columns: DataTableColumn,
  });

  return (
    <div className="space-y-5">
      {/* top */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2>Tasks</h2>
          <p className="text-muted-foreground">
            Here's a list of your tasks for this month!
          </p>
        </div>
        <div className="flex gap-2">
          <ButtonImport
            handleImport={async (file) => {
              const dataImport = (await importXLSX(file)) as Task[];

              setData((prev) => [...prev, ...dataImport]);
            }}
          />
          <Button
            className="space-x-1"
            onClick={() => toast.error(`err`)}
            // onClick={() => setOpen("create")}
          >
            <span>Create</span> <Plus size={18} />
          </Button>
        </div>
      </div>
      {/* toolbar */}
      <DataTableToolbar
        table={table}
        filters={[
          { columnId: "status", title: "Status", options: statuses },
          {
            columnId: "priority",
            title: "Priority",
            options: priorities,
          },
        ]}
      />
      {/* table */}
      <DataTable table={table} />
      {/* pagination */}
      <DataTablePagination table={table} />
      {/* bulk actions */}
      <DataTableBulkActions
        table={table}
        entityName="tasks"
        items={[
          {
            icon: <Download />,
            title: "Download",
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
              const rowIds = table
                .getFilteredSelectedRowModel()
                .rows.map((r) => r.original)
                .map((r) => r.id);
              setData((prev) =>
                prev.filter((item) => !rowIds.includes(item.id))
              );
              table.resetRowSelection();
            },
          },
        ]}
      />
    </div>
  );
};

export default TasksPage;
