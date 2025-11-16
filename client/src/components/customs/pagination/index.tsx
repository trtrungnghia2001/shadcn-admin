import { memo } from "react";
import { getPageNumbers } from "./data/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-wrap items-center space-x-2">
      {/* First Page */}
      <Button
        variant="outline"
        size="icon"
        className="hidden size-8 lg:flex"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <span className="sr-only">Go to first page</span>
        <ChevronsLeft />
      </Button>

      {/* Previous */}
      <Button
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <span className="sr-only">Go to previous page</span>
        <ChevronLeft />
      </Button>

      {/* Page Numbers */}
      {pageNumbers.map((pageNumber, index) => (
        <div key={`${pageNumber}-${index}`} className="flex items-center">
          {pageNumber === "..." ? (
            <span className="text-muted-foreground px-1 text-sm">...</span>
          ) : (
            <Button
              variant={currentPage === pageNumber ? "default" : "outline"}
              className="h-8 min-w-8 px-2"
              onClick={() => onPageChange(pageNumber as number)}
            >
              <span className="sr-only">Go to page {pageNumber}</span>
              {pageNumber}
            </Button>
          )}
        </div>
      ))}

      {/* Next */}
      <Button
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span className="sr-only">Go to next page</span>
        <ChevronRight />
      </Button>

      {/* Last Page */}
      <Button
        variant="outline"
        size="icon"
        className="hidden size-8 lg:flex"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <span className="sr-only">Go to last page</span>
        <ChevronsRight />
      </Button>
    </div>
  );
};

export default memo(Pagination);
