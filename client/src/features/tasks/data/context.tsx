import { createContext, useContext } from "react";
import type { ContextActionType, Task, TaskContextType } from "./type";

export const taskReducer = (state: Task[], action: ContextActionType) => {
  switch (action.type) {
    case "ADD": {
      const newTask: Task = { ...action.payload, id: Date.now().toString() };
      return [newTask, ...state];
    }
    case "UPDATE":
      return state.map((task) =>
        task.id === action.payload?.id ? { ...task, ...action.payload } : task
      );
    case "UPDATE_SELECTED": {
      const rowIds = action.dataArray.map((item) => item.id);

      return state.map((item) =>
        rowIds.includes(item.id)
          ? {
              ...item,
              [action.key]: action.value,
            }
          : item
      );
    }
    case "DELETE":
      return state.filter((task) => task.id !== action.payload?.id);
    case "DELETE_SELECTED": {
      const rowIds = action.dataArray.map((item) => item.id);

      return state.filter((item) => !rowIds.includes(item.id));
    }
    case "IMPORT":
      return [...state, ...action.dataArray];
    default:
      return state;
  }
};

export const TaskContext = createContext<TaskContextType | null>(null);

export const useTaskContext = (): TaskContextType => {
  const ctx = useContext(TaskContext);

  if (!ctx) {
    throw new Error("useTaskContext must be used inside <TaskProvider>");
  }

  return ctx;
};
