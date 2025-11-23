import { DataTable } from "@/components/customs/data-table";
import { useDataTable } from "@/components/customs/data-table/hooks/use-data-table";
import { DataTablePagination } from "@/components/customs/data-table/components/DataTablePagination";
import { DataTableToolbar } from "@/components/customs/data-table/components/DataTableToolbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ButtonImport from "@/components/customs/button-import";
import { DataTableColumn } from "./components/dttb-columns";
import { roles, statuses } from "./data/constants";
import UserDialog from "./components/UserDialog";
import { useUserStore } from "./data/store";
import DttbBulkActions from "./components/dttb-bulk-action";
import ConfirmDialog from "@/components/customs/confirm-dialog";

const UsersPage = () => {
  const { open, setOpen, data, setCurrentData, currentData, remove } =
    useUserStore();
  const { table } = useDataTable({
    data: data,
    columns: DataTableColumn,
  });

  return (
    <div className="space-y-5">
      {/* top */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2>User List</h2>
          <p className="text-muted-foreground">
            Manage your users and their roles here.
          </p>
        </div>
        <div className="flex gap-2">
          <ButtonImport
            handleImport={(file) => {
              console.log({ file });
            }}
          />
          <Button className="space-x-1" onClick={() => setOpen("create")}>
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
            columnId: "role",
            title: "Role",
            options: roles,
          },
        ]}
      />
      {/* table */}
      <DataTable table={table} />
      {/* pagination */}
      <DataTablePagination table={table} />
      {/* bulk actions */}
      <DttbBulkActions table={table} />
      {/* dialog */}
      <UserDialog
        open={open === "create" || open === "update"}
        onOpenChange={() => setOpen(false)}
      />
      <ConfirmDialog
        open={open === "delete" || open === "deleteSelect"}
        onOpenChange={() => {
          setOpen(false);
          setCurrentData(null);
        }}
        confirmText="Delete"
        confirmVariant="destructive"
        handleConfirm={() => {
          if (open === "delete" && currentData) {
            remove(currentData.id);
          } else if (open === "deleteSelect") {
            // handleDeleteSelectTask(
            //   table.getFilteredSelectedRowModel().rows.map((r) => r.original)
            // );
          }
          table.resetRowSelection();
        }}
      />
    </div>
  );
};

export default UsersPage;
