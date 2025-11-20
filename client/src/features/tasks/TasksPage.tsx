import { DataTable } from "@/components/customs/data-table";
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
import type { Task } from "./data/type";
import TaskSheet from "./components/TaskSheet";
import { useTaskContext } from "./data/context";
import { useState } from "react";
import ConfirmDialog from "@/components/customs/confirm-dialog";

const TasksPage = () => {
  const {
    edit,
    setEdit,
    tasks,
    handleDeleteSelectTask,
    handleImportTask,
    dialog,
    setDialog,
  } = useTaskContext();
  const [openSheet, setOpenSheet] = useState(false);

  const { table } = useDataTable({
    data: tasks,
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
              handleImportTask(dataImport);
            }}
          />
          <Button className="space-x-1" onClick={() => setOpenSheet(true)}>
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
              setDialog({
                isOpen: true,
                handleConfirmDelete: () => {
                  handleDeleteSelectTask(
                    table
                      .getFilteredSelectedRowModel()
                      .rows.map((r) => r.original)
                  );

                  table.resetRowSelection();
                },
              });
            },
          },
        ]}
      />
      {/* dialog */}
      <TaskSheet
        open={openSheet || edit.isEdit}
        onOpenChange={(open) => {
          setOpenSheet(open);
          setEdit({ isEdit: false, taskEdit: null });
        }}
      />
      <ConfirmDialog
        handleConfirm={() => dialog.handleConfirmDelete()}
        confirmText="Delete"
        open={dialog.isOpen}
        onOpenChange={(open) => setDialog({ ...dialog, isOpen: open })}
        confirmVariant="destructive"
      />
    </div>
  );
};

export default TasksPage;
