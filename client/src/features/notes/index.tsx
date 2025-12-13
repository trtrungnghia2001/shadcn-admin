import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useAppDispatch, useAppSelector } from "./data/hook";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import SortableItem from "./components/SortableItem";
import NoteColumn from "./components/NoteColumn";
import { setColumns } from "./data/columnSlice";
import { setTasks } from "./data/taskSlice";
import { useEffect, useState } from "react";
import NoteTask from "./components/NoteTask";
import type { Column, Task } from "./data/type";

const NotesPage = () => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector((state) => state.columns);
  const tasks = useAppSelector((state) => state.tasks);
  const [tasksDraft, setTasksDraft] = useState(tasks);
  const [columnsDraft, setColumnsDraft] = useState(columns);
  const [activeId, setActiveId] = useState<{
    id: string;
    type: "task" | "column";
  } | null>(null);
  useEffect(() => {
    setTasksDraft(tasks);
  }, [tasks]);

  useEffect(() => {
    setColumnsDraft(columns);
  }, [columns]);

  const onDragStart = (e: DragStartEvent) => {
    setActiveId({
      id: e.active.id.toString(),
      type: e.active.data.current?.type,
    });
  };
  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!active || !over || active.id === over.id) return;

    // CxC
    if (
      active.data.current?.type === "column" &&
      over.data.current?.type === "column"
    ) {
      const activeIdx = columnsDraft.findIndex((c) => c.id === active.id);
      const overIdx = columnsDraft.findIndex((c) => c.id === over.id);

      if (activeIdx !== overIdx) {
        setColumnsDraft(arrayMove(columnsDraft, activeIdx, overIdx));
      }
      return;
    }

    // TxT
    if (
      active.data.current?.type === "task" &&
      over.data.current?.type === "task"
    ) {
      const activeTask = tasksDraft.find((t) => t.id === active.id);
      const overTask = tasksDraft.find((t) => t.id === over.id);
      if (!activeTask || !overTask) return;

      // Same column
      if (activeTask.columnId === overTask.columnId) {
        const activeIdx = tasksDraft.findIndex((t) => t.id === active.id);
        const overIdx = tasksDraft.findIndex((t) => t.id === over.id);

        if (activeIdx !== overIdx) {
          setTasksDraft(arrayMove(tasksDraft, activeIdx, overIdx));
        }
        return;
      }

      // Different column
      if (activeTask.columnId !== overTask.columnId) {
        setTasksDraft(
          tasksDraft.map((t) =>
            t.id === active.id ? { ...t, columnId: overTask.columnId } : t
          )
        );
        return;
      }
    }

    // TxC
    if (
      active.data.current?.type === "task" &&
      over.data.current?.type === "column"
    ) {
      const activeTask = tasksDraft.find((t) => t.id === active.id);
      if (!activeTask) return;

      if (activeTask.columnId !== over.id) {
        setTasksDraft(
          tasksDraft.map((t) =>
            t.id === active.id.toString()
              ? { ...t, columnId: over.id.toString() }
              : t
          )
        );
      }
      return;
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { over } = e;
    if (!over) return;

    // commit preview → redux
    dispatch(setColumns(columnsDraft));
    dispatch(setTasks(tasksDraft));
  };

  return (
    <div className="h-full flex flex-col gap-5">
      {/* top */}
      <div>
        <h2>Notes</h2>
        <p className="text-muted-foreground">
          Here's a list of your apps for the integration! Use redux-toolkit and
          dnd kit
        </p>
      </div>
      {/* dnd */}
      <div className="flex-1 overflow-auto px-4 scrollbar-beauty">
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={columnsDraft.map((c) => c.id)}>
            <ul className="flex gap-4 overflow-x-auto h-full">
              {columnsDraft.map((column) => (
                <SortableItem key={column.id} id={column.id} type="column">
                  <NoteColumn
                    column={column}
                    tasks={tasksDraft.filter(
                      (task) => task.columnId === column.id
                    )}
                  />
                </SortableItem>
              ))}
            </ul>
          </SortableContext>
          <DragOverlay dropAnimation={null}>
            {activeId ? (
              <>
                {activeId.type === "task" && (
                  <NoteTask
                    task={tasks.find((t) => t.id === activeId.id) as Task}
                  />
                )}
                {activeId.type === "column" && (
                  <NoteColumn
                    column={
                      columnsDraft.find((c) => c.id === activeId.id) as Column
                    }
                    tasks={tasksDraft.filter((t) => t.columnId === activeId.id)}
                  />
                )}
              </>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default NotesPage;
