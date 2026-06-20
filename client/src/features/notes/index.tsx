// NotesPage.tsx
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"; // Thêm sortableKeyboardCoordinates
import { useAppDispatch, useAppSelector } from "./data/hook";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  rectIntersection,
  useSensor, // Thêm hook này
  useSensors, // Thêm hook này
  PointerSensor, // Thêm cảm biến chuột/touch
  KeyboardSensor, // Thêm cảm biến bàn phím (Tốt cho Accessibility)
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import SortableItem from "./components/SortableItem";
import NoteColumn from "./components/NoteColumn";
import { setColumns } from "./data/columnSlice";
import { setTasks } from "./data/taskSlice";
import { useEffect, useState, useCallback } from "react";
import NoteTask from "./components/NoteTask";
import type { Column, Task } from "./data/type";

const NotesPage = () => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector((state) => state.columns);
  const tasks = useAppSelector((state) => state.tasks);

  const [tasksDraft, setTasksDraft] = useState<Task[]>([]);
  const [columnsDraft, setColumnsDraft] = useState<Column[]>([]);
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

  // 🔥 1. CẤU HÌNH BỘ SENSORS CHUẨN CHO KANBAN BOARD
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Trỏ chuột hoặc ngón tay phải di chuyển ít nhất 8px thì mới kích hoạt Kéo Thả.
        // Giúp người dùng thoải mái click, bấm nút, chọn chữ bên trong Task mà không sợ bị dính lệnh kéo!
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates, // Hỗ trợ kéo thả bằng phím mũi tên (Tăng khả năng tiếp cận)
    }),
  );

  const onDragStart = (e: DragStartEvent) => {
    setActiveId({
      id: e.active.id.toString(),
      type: e.active.data.current?.type,
    });
  };

  // Thuật toán Custom Collision giữ nguyên từ bước trước để chống lỗi Maximum Depth
  const customCollisionDetection: CollisionDetection = useCallback(
    (args) => {
      if (activeId?.type === "column") return closestCorners(args);
      const intersections = closestCorners(args);
      if (intersections.length === 0) return rectIntersection(args);
      return intersections;
    },
    [activeId],
  );

  // 🔥 HÀM ON_DRAG_OVER ĐÃ ĐƯỢC SỬA LỖI KHÔNG QUA ĐƯỢC CỘT KHÁC
  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeIdStr = active.id.toString();
    const overIdStr = over.id.toString();

    if (activeIdStr === overIdStr) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // Chỉ xử lý việc chuyển đổi giữa các Column khi kéo phần tử là "task"
    if (activeType === "task") {
      const activeTask = tasksDraft.find((t) => t.id === activeIdStr);
      if (!activeTask) return;

      // 👉 TRƯỜNG HỢP 1: Kéo Task đè lên một Task khác (TxT) ở KHÁC cột
      if (overType === "task") {
        const overTask = tasksDraft.find((t) => t.id === overIdStr);
        if (!overTask) return;

        // Nếu khác cột, cập nhật cột mới và chèn thẳng vào vị trí của overTask
        if (activeTask.columnId !== overTask.columnId) {
          setTasksDraft((prev) => {
            const activeIdx = prev.findIndex((t) => t.id === activeIdStr);
            const overIdx = prev.findIndex((t) => t.id === overIdStr);

            if (activeIdx === -1 || overIdx === -1) return prev;

            const updated = [...prev];
            // Đổi columnId của activeTask sang cột mới
            updated[activeIdx] = { ...activeTask, columnId: overTask.columnId };

            // Di chuyển vị trí của phần tử trong mảng phẳng
            return arrayMove(updated, activeIdx, overIdx);
          });
        }
      }

      // 👉 TRƯỜNG HỢP 2: Kéo Task đè lên một Column trống / Tiêu đề Column (TxC)
      if (overType === "column") {
        // Nếu cột nhắm tới khác với cột hiện tại của Task
        if (activeTask.columnId !== overIdStr) {
          setTasksDraft((prev) => {
            const activeIdx = prev.findIndex((t) => t.id === activeIdStr);
            if (activeIdx === -1) return prev;

            const updated = [...prev];
            // Cập nhật cột mới cho Task
            updated[activeIdx] = { ...activeTask, columnId: overIdStr };

            // Tìm xem cột đích đã có những task nào chưa
            const targetColumnTasks = updated.filter(
              (t) => t.columnId === overIdStr && t.id !== activeIdStr,
            );

            let targetIndex = updated.length - 1;

            if (targetColumnTasks.length > 0) {
              // Nếu cột đã có task, lấy vị trí của task cuối cùng để chèn vào sau nó
              const lastTaskInTarget =
                targetColumnTasks[targetColumnTasks.length - 1];
              targetIndex = updated.findIndex(
                (t) => t.id === lastTaskInTarget.id,
              );
            }

            return arrayMove(updated, activeIdx, targetIndex);
          });
        }
      }
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;

    const activeIdStr = active.id.toString();
    const overIdStr = over.id.toString();
    const activeType = active.data.current?.type;

    if (activeType === "column") {
      const activeIdx = columnsDraft.findIndex((c) => c.id === activeIdStr);
      const overIdx = columnsDraft.findIndex((c) => c.id === overIdStr);
      if (activeIdx !== overIdx && activeIdx !== -1 && overIdx !== -1) {
        const newColumns = arrayMove(columnsDraft, activeIdx, overIdx);
        setColumnsDraft(newColumns);
        dispatch(setColumns(newColumns));
        dispatch(setTasks(tasksDraft));
        return;
      }
    }

    if (activeType === "task") {
      const activeTask = tasksDraft.find((t) => t.id === activeIdStr);
      const overTask = tasksDraft.find((t) => t.id === overIdStr);
      if (activeTask && overTask && activeTask.columnId === overTask.columnId) {
        const activeIdx = tasksDraft.findIndex((t) => t.id === activeIdStr);
        const overIdx = tasksDraft.findIndex((t) => t.id === overIdStr);
        if (activeIdx !== overIdx && activeIdx !== -1 && overIdx !== -1) {
          const newTasks = arrayMove(tasksDraft, activeIdx, overIdx);
          setTasksDraft(newTasks);
          dispatch(setTasks(newTasks));
          dispatch(setColumns(columnsDraft));
          return;
        }
      }
    }

    dispatch(setColumns(columnsDraft));
    dispatch(setTasks(tasksDraft));
  };

  return (
    <div className="h-full flex flex-col gap-5">
      <div>
        <h2>Notes</h2>
        <p className="text-muted-foreground">
          Here's a list of your apps for the integration! Use redux-toolkit and
          dnd kit
        </p>
      </div>

      <div className="flex-1 overflow-auto px-4 scrollbar-beauty">
        {/* 🔥 2. TRUYỀN BIẾN SENSORS VÀO DND_CONTEXT */}
        <DndContext
          sensors={sensors} // Nhúng bộ cảm biến đã cấu hình vào đây
          collisionDetection={customCollisionDetection}
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
                      (task) => task.columnId === column.id,
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
                    task={tasksDraft.find((t) => t.id === activeId.id) as Task}
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
