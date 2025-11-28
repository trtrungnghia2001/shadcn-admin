import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pagination, { type PaginationProps } from "../../pagination";
import type { Table } from "@tanstack/react-table";
import { useEffect } from "react";

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  rowsPerPage?: number;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  pagination?: PaginationProps;
}

export function DataTablePagination<TData>({
  table,
  rowsPerPage,
  onRowsPerPageChange,
  pagination,
}: DataTablePaginationProps<TData>) {
  const currentPage =
    pagination?.currentPage ?? table.getState().pagination.pageIndex + 1;

  const totalPages = pagination?.totalPages ?? table.getPageCount();
  const pageSize = rowsPerPage ?? table.getState().pagination.pageSize;

  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize]);

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-between lg:space-x-8">
      {/* left */}
      <div className="flex items-center space-x-2 flex-1">
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            const size = Number(value);
            if (onRowsPerPageChange) {
              onRowsPerPageChange(size);
            } else {
              table.setPageSize(size);
            }
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize.toString()} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 25, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm font-medium">Rows per page</p>
      </div>
      {/* right */}
      <div className="flex items-center gap-4">
        <div className="hidden md:block text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            if (pagination) {
              pagination.onPageChange(page);
            } else {
              table.setPageIndex(page - 1);
            }
          }}
        />
      </div>
    </div>
  );
}
