import type { ApiResponse } from "@/lib/type";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  status: "active" | "inactive" | "invited" | "suspended";
  role: "superadmin" | "admin" | "cashier" | "manager";
  createdAt: Date;
  updatedAt: Date;
}

type UsersDialogType =
  | "create"
  | "update"
  | "delete"
  | "deleteSelect"
  | boolean;

export type UserStoreType<T> = {
  data: T[];
  create: (user: Partial<T>) => Promise<ApiResponse<T>>;
  update: (id: string, user: Partial<T>) => Promise<ApiResponse<T>>;
  remove: (id: string) => Promise<ApiResponse<T>>;
  fetchAll: () => Promise<ApiResponse<T[]>>;
  fetchById: (id: string) => Promise<ApiResponse<T>>;

  // dialog
  open: UsersDialogType;
  setOpen: (open: UsersDialogType) => void;
  currentData: User | null;
  setCurrentData: (user: User | null) => void;
};
