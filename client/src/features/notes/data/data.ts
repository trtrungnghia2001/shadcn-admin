import type { Column, Task } from "./type";

export const initialColumns: Column[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "testing", title: "Testing" },
  { id: "done", title: "Done" },
];

export const initialTasks: Task[] = [
  // TO DO (6)
  {
    id: "task-1",
    title: "Setup project",
    desc: "Init repo & install deps",
    columnId: "todo",
  },
  {
    id: "task-2",
    title: "Configure ESLint",
    desc: "Code quality rules",
    columnId: "todo",
  },
  {
    id: "task-3",
    title: "Setup Tailwind",
    desc: "UI styling",
    columnId: "todo",
  },
  {
    id: "task-4",
    title: "Design database schema",
    desc: "MongoDB schema",
    columnId: "todo",
  },
  {
    id: "task-5",
    title: "Create API base",
    desc: "Express server",
    columnId: "todo",
  },
  {
    id: "task-6",
    title: "Auth flow design",
    desc: "JWT + refresh",
    columnId: "todo",
  },

  // IN PROGRESS (6)
  {
    id: "task-7",
    title: "Login API",
    desc: "JWT authentication",
    columnId: "in-progress",
  },
  {
    id: "task-8",
    title: "Register API",
    desc: "User signup",
    columnId: "in-progress",
  },
  {
    id: "task-9",
    title: "Google OAuth",
    desc: "OAuth2 login",
    columnId: "in-progress",
  },
  {
    id: "task-10",
    title: "User profile page",
    desc: "Update profile UI",
    columnId: "in-progress",
  },
  {
    id: "task-11",
    title: "Kanban layout",
    desc: "Columns UI",
    columnId: "in-progress",
  },
  {
    id: "task-12",
    title: "Drag task logic",
    desc: "dnd-kit sortable",
    columnId: "in-progress",
  },

  // REVIEW (5)
  {
    id: "task-13",
    title: "Code review auth",
    desc: "Security check",
    columnId: "review",
  },
  {
    id: "task-14",
    title: "Refactor reducers",
    desc: "Redux optimization",
    columnId: "review",
  },
  {
    id: "task-15",
    title: "UI consistency",
    desc: "Shadcn components",
    columnId: "review",
  },
  {
    id: "task-16",
    title: "API response format",
    desc: "Standardize response",
    columnId: "review",
  },
  {
    id: "task-17",
    title: "Error handling",
    desc: "Global error handler",
    columnId: "review",
  },

  // TESTING (5)
  {
    id: "task-18",
    title: "Unit test auth",
    desc: "JWT test cases",
    columnId: "testing",
  },
  {
    id: "task-19",
    title: "Drag & drop test",
    desc: "Task reorder",
    columnId: "testing",
  },
  {
    id: "task-20",
    title: "Mobile UI test",
    desc: "Responsive layout",
    columnId: "testing",
  },
  {
    id: "task-21",
    title: "API load test",
    desc: "Performance",
    columnId: "testing",
  },
  {
    id: "task-22",
    title: "Bug fixing",
    desc: "Fix reported bugs",
    columnId: "testing",
  },

  // DONE (6)
  {
    id: "task-23",
    title: "Project setup",
    desc: "Initial setup done",
    columnId: "done",
  },
  {
    id: "task-24",
    title: "Base layout",
    desc: "Header & layout",
    columnId: "done",
  },
  {
    id: "task-25",
    title: "Theme switch",
    desc: "Dark / light mode",
    columnId: "done",
  },
  {
    id: "task-26",
    title: "API deploy",
    desc: "Deploy backend",
    columnId: "done",
  },
  {
    id: "task-27",
    title: "Frontend deploy",
    desc: "Vercel deploy",
    columnId: "done",
  },
  {
    id: "task-28",
    title: "CI/CD setup",
    desc: "GitHub Actions",
    columnId: "done",
  },
];
