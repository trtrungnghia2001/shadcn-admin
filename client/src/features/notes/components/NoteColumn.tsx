import { memo } from "react";
import type { Column, Task } from "../data/type";
import NoteTask from "./NoteTask";
import SortableItem from "./SortableItem";
import { SortableContext } from "@dnd-kit/sortable";

const NoteColumn = ({ column, tasks }: { column: Column; tasks: Task[] }) => {
  return (
    <div className="rounded-lg border p-4 bg-muted w-[calc(25%-12px)] min-w-[280px]">
      <div className="mb-4 font-medium">{column.title}</div>
      <SortableContext items={tasks.map((task) => task.id)}>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <SortableItem key={task.id} id={task.id} type="task">
              <NoteTask task={task} />
            </SortableItem>
          ))}
        </ul>
      </SortableContext>
    </div>
  );
};

export default memo(NoteColumn);
