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
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { queryClient } from "@/main";
import ButtonExport from "@/components/customs/button-export";

const UsersPage = () => {
  const {
    open,
    setOpen,
    setCurrentData,
    currentData,
    data,
    remove,
    removeIds,
    importExcel,
    exportExcel,
    fetchAll,
  } = useUserStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const fetchAllQuery = useQuery({
    queryKey: ["users", searchParams.toString()],
    queryFn: async () => await fetchAll(searchParams.toString()),
    placeholderData: (previousData) => previousData,
  });

  const importExcelMutation = useMutation({
    mutationFn: async (file: File) => await importExcel(file),
    onSuccess: (data) => toast.success(data.message),
    onError: (error) => toast.error(error.message),
  });
  const exportExcelMutation = useMutation({
    mutationFn: async () => await exportExcel(),
    onSuccess: () => toast.success(`Exported successfully!`),
    onError: (error) => toast.error(error.message),
  });

  const { table, columnFilters } = useDataTable({
    data: data,
    columns: DataTableColumn,
    mode: "server",
  });

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("name", value);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset page khi filter thay đổi
    params.set("page", "1");

    if (columnFilters.length === 0) {
      Array.from(params.keys()).forEach((key) => {
        if (["status", "role"].includes(key)) {
          params.delete(key);
        }
      });

      setSearchParams(params);
      return;
    }

    // Add or delete filters vao url
    columnFilters.forEach((filter) => {
      if (
        filter.value != null &&
        !(Array.isArray(filter.value) && filter.value.length === 0)
      ) {
        const value = Array.isArray(filter.value)
          ? filter.value.join(",")
          : filter.value.toString();
        params.set(filter.id, value);
      } else {
        params.delete(filter.id);
      }
    });

    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    setSearchParams(params);
  };

  const handleRowsPerPageChange = (rowsPerPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", rowsPerPage.toString());
    setSearchParams(params);
  };

  useEffect(() => {
    handleFilter();
  }, [columnFilters]);

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
          <ButtonExport
            handleExport={() => exportExcelMutation.mutate()}
            isLoading={exportExcelMutation.isPending}
          />
          <ButtonImport
            handleImport={(file) => {
              importExcelMutation.mutate(file);
            }}
            isLoading={importExcelMutation.isPending}
          />
          <Button className="space-x-1" onClick={() => setOpen("create")}>
            <span>Create</span> <Plus size={18} />
          </Button>
        </div>
      </div>
      {/* toolbar */}
      <DataTableToolbar
        table={table}
        searchPlaceholder="Search by name..."
        onSearchChange={handleSearch}
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
      <DataTablePagination
        table={table}
        pagination={{
          currentPage: fetchAllQuery.data?.page || 1,
          totalPages: fetchAllQuery.data?.totalPages || 1,
          onPageChange: handlePageChange,
        }}
        rowsPerPage={fetchAllQuery.data?.limit}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

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
        handleConfirm={async () => {
          if (open === "delete" && currentData) {
            await remove(currentData._id);
          } else if (open === "deleteSelect") {
            await removeIds(
              table
                .getFilteredSelectedRowModel()
                .rows.map((r) => r.original)
                .map((item) => item._id)
            );

            // set lai page
            searchParams.set("page", "1");
            setSearchParams(searchParams);
          }
          queryClient.invalidateQueries({ queryKey: ["users"] });
          table.resetRowSelection();
        }}
      />
    </div>
  );
};

export default UsersPage;
