import { useEffect, useReducer, useState } from "react";
import type { Task, TasksDialogType } from "./type";
import { TaskContext, taskReducer } from "./context";
import { tasksData } from "./data";

const initData =
  JSON.parse(localStorage.getItem("tasksData") as string) || tasksData;

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  // task state management
  const [tasks, dispatch] = useReducer(taskReducer, initData);

  const handleAddTask = (task: Task) => {
    dispatch({
      type: "ADD",
      payload: task,
    });
  };
  const handleUpdateTask = (task: Task) => {
    dispatch({
      type: "UPDATE",
      payload: task,
    });
    setOpen("update");
    setCurrentData(null);
  };
  const handleDeleteTask = (task: Task) => {
    dispatch({
      type: "DELETE",
      payload: task,
    });
  };
  const handleDeleteSelectTask = (tasks: Task[]) => {
    dispatch({
      type: "DELETE_SELECTED",
      dataArray: tasks,
    });
  };
  const handleImportTask = (tasks: Task[]) => {
    dispatch({
      type: "IMPORT",
      dataArray: tasks,
    });
  };

  useEffect(() => {
    localStorage.setItem("tasksData", JSON.stringify(tasks));
  }, [tasks]);

  const [open, setOpen] = useState<TasksDialogType>(false);
  const [currentData, setCurrentData] = useState<Task | null>(null);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        handleAddTask,
        handleDeleteTask,
        handleUpdateTask,
        handleDeleteSelectTask,
        handleImportTask,
        open,
        setOpen,
        currentData,
        setCurrentData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
