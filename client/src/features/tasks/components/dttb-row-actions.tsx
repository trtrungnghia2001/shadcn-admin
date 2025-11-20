import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Row, Table } from "@tanstack/react-table";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import type { Task } from "../data/type";
import { useTaskContext } from "../data/context";

type DataTableRowActionsProps<TData> = {
  row: Row<TData>;
  table: Table<TData>;
};

export function DataTableRowActions<TData>({
  row,
  table,
}: DataTableRowActionsProps<TData>) {
  const data = row.original as Task;
  const { handleDeleteTask, setEdit, setDialog } = useTaskContext();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setEdit({
              isEdit: true,
              taskEdit: data,
            });
          }}
        >
          Edit
          <DropdownMenuShortcut>
            <Pencil size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setDialog({
              isOpen: true,
              handleConfirmDelete: () => {
                handleDeleteTask(data);
                table.resetRowSelection();
              },
            });
          }}
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
