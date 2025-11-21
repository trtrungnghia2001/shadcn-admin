import { DataTable } from "@/components/customs/data-table";
import { useDataTable } from "@/components/customs/data-table/hooks/use-data-table";
import { DataTablePagination } from "@/components/customs/data-table/components/DataTablePagination";
import { DataTableBulkActions } from "@/components/customs/data-table/components/DataTableBulkActions";
import { DataTableToolbar } from "@/components/customs/data-table/components/DataTableToolbar";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ButtonImport from "@/components/customs/button-import";
import { usersData } from "./data/data";
import { DataTableColumn } from "./components/dttb-columns";
import { roles, statuses } from "./data/constants";
import UserDialog from "./components/UserDialog";

const UsersPage = () => {
  const { table } = useDataTable({
    data: usersData,
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
          <Button
            className="space-x-1"
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
      <DataTableBulkActions table={table} />
      <UserDialog open />
    </div>
  );
};

export default UsersPage;
