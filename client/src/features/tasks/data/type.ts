export interface Task {
  id: string;
  title: string;
  status: string;
  label: string;
  priority: string;
}
export type ContextActionType =
  | { type: "ADD"; payload: Task }
  | { type: "UPDATE"; payload: Task }
  | {
      type: "UPDATE_SELECTED";
      dataArray: Task[];
      key: string;
      value: string | number;
    }
  | { type: "DELETE"; payload: Task }
  | { type: "DELETE_SELECTED"; dataArray: Task[] }
  | { type: "IMPORT"; dataArray: Task[] };

export type TaskContextType = {
  tasks: Task[];
  handleAddTask: (task: Task) => void;
  handleUpdateTask: (task: Task) => void;
  handleUpdateSelectTask: (
    tasks: Task[],
    key: string,
    value: string | number
  ) => void;
  handleDeleteTask: (task: Task) => void;
  handleDeleteSelectTask: (tasks: Task[]) => void;
  handleImportTask: (tasks: Task[]) => void;

  open: TasksDialogType;
  setOpen: (open: TasksDialogType) => void;
  currentData: Task | null;
  setCurrentData: (task: Task | null) => void;
};
export type TasksDialogType =
  | "create"
  | "update"
  | "delete"
  | "deleteSelect"
  | boolean;
