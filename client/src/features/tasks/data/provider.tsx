import { useEffect, useReducer, useState } from "react";
import type { Task, TaskEditType } from "./type";
import { TaskContext, taskReducer } from "./context";
import { tasksData } from "./data";

const initData =
  JSON.parse(localStorage.getItem("tasksData") as string) || tasksData;

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
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
    setEdit({ isEdit: false, taskEdit: null });
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

  const [edit, setEdit] = useState<TaskEditType>({
    isEdit: false,
    taskEdit: null,
  });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        handleAddTask,
        handleDeleteTask,
        handleUpdateTask,
        handleDeleteSelectTask,
        handleImportTask,
        edit,
        setEdit,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
