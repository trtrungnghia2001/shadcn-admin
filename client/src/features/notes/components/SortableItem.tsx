// SortableItem.tsx
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
  // Gắn chặt data vào hook useSortable để dnd-kit truy xuất tức thì
  const { attributes, listeners, setNodeRef, transform, transition, isOver } =
    useSortable({
      id: id,
      data: { id, type },
    });

  const style = {
    // Lưu ý: Đối với cấu trúc lồng nhau phức tạp, dùng CSS.Transform sẽ chuẩn hơn CSS.Translate
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx([
        "cursor-grab list-none",
        isOver && "opacity-50",
        type === "column" && `min-h-[400px]`,
      ])}
    >
      {children}
    </li>
  );
}

export default memo(SortableItem);
