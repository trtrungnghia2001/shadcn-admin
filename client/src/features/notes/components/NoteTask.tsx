import type { Task } from "../data/type";

const NoteTask = ({ task }: { task: Task }) => {
  return (
    <div className="rounded border p-2 bg-white dark:bg-slate-700">
      <div>{task.title}</div>
      <div className="text-xs text-muted-foreground">{task.desc}</div>
    </div>
  );
};

export default NoteTask;
