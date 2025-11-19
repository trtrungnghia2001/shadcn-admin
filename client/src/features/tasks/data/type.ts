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
  | { type: "DELETE"; payload: Task }
  | { type: "IMPORT"; dataArray: Task[] }
  | { type: "DELETE_SELECTED"; dataArray: Task[] };

export type TaskEditType = {
  taskEdit: Task | null;
  isEdit: boolean;
};
export type TaskContextType = {
  tasks: Task[];
  handleAddTask: (task: Task) => void;
  handleUpdateTask: (task: Task) => void;
  handleDeleteTask: (task: Task) => void;
  handleDeleteSelectTask: (tasks: Task[]) => void;
  handleImportTask: (tasks: Task[]) => void;
  edit: TaskEditType;
  setEdit: (edit: TaskEditType) => void;
};
