import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type TableOptions,
  type TableState,
  type VisibilityState,
} from "@tanstack/react-table";
import React from "react";

interface DataTableProps<TData> {
  data: TData[];
  mode?: "client" | "server";
  columns: ColumnDef<TData>[];
  initialState?: Partial<TableState>;
  options?: Omit<TableOptions<TData>, "data" | "columns" | "state">;
}

export function useDataTable<TData>({
  data,
  mode = "client",
  columns,
  initialState = {},
  options,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(
    initialState.sorting ?? []
  );

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    initialState.columnFilters ?? []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState.columnVisibility ?? {});

  const [rowSelection, setRowSelection] = React.useState(
    initialState.rowSelection ?? {}
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,

      ...initialState,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    getFilteredRowModel: mode === "client" ? getFilteredRowModel() : undefined,
    ...options,
  });

  return {
    table,
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
  };
}
