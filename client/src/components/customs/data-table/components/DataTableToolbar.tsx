import { Cross2Icon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { useState } from "react";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  searchPlaceholder?: string;
  searchKey?: string;
  onSearchChange?: (value: string) => void;
  filters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
};

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Filter...",
  searchKey,
  onSearchChange,
  filters = [],
}: DataTableToolbarProps<TData>) {
  const [searchValue, setSearchValue] = useState("");
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter;

  const handleLocalFilter = (value: string) => {
    if (searchKey) table.getColumn(searchKey)?.setFilterValue(value);
    else table.setGlobalFilter(value);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        {/* Search input */}
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            handleLocalFilter(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearchChange?.(searchValue);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {/* Faceted filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId);
            if (!column) return null;
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            );
          })}

          {/* Reset filters button */}
          {isFiltered && (
            <Button
              variant="outline"
              onClick={() => {
                table.resetColumnFilters();
                table.setGlobalFilter("");
                setSearchValue("");
              }}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ms-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <DataTableViewOptions table={table} />
    </div>
  );
}
