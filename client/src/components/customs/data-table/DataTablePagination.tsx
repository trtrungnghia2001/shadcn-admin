import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pagination, { type PaginationProps } from "../pagination";

export interface DataTablePaginationProps {
  rowsPerPage: number;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  pagination: PaginationProps;
}

export function DataTablePagination({
  rowsPerPage,
  onRowsPerPageChange,
  pagination,
}: DataTablePaginationProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-between lg:space-x-8">
      {/* left */}
      <div className="flex items-center space-x-2 flex-1">
        <Select
          value={rowsPerPage.toString()}
          onValueChange={(value) => {
            onRowsPerPageChange(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={rowsPerPage.toString()} />
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
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>

        <Pagination {...pagination} />
      </div>
    </div>
  );
}
