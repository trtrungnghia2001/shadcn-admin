import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { memo } from "react";

interface SortableItemProps {
  id: string;
  type: "task" | "column";
  children: React.ReactNode;
}

function SortableItem({ id, type, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isOver } =
    useSortable({ id: id, data: { id, type } });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx([
        "cursor-grab",
        isOver && "opacity-50",
        type === "column" && `min-h-[400px]`,
      ])}
    >
      {children}
    </li>
  );
}

export default memo(SortableItem);
