import type { ApiResponse } from "@/lib/type";
import type { UserDTO } from "./schema";

export interface User {
  _id: string;
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
  create: (user: UserDTO) => Promise<ApiResponse<T>>;
  update: (id: string, user: UserDTO) => Promise<ApiResponse<T>>;
  remove: (id: string) => Promise<ApiResponse<T>>;
  removeIds: (ids: string[]) => Promise<ApiResponse<T>>;
  fetchAll: (query: string) => Promise<ApiResponse<T[]>>;
  fetchById: (id: string) => Promise<ApiResponse<T>>;
  importExcel: (file: File) => Promise<ApiResponse<T[]>>;
  exportExcel: () => Promise<void>;

  // dialog
  open: UsersDialogType;
  setOpen: (open: UsersDialogType) => void;
  currentData: User | null;
  setCurrentData: (user: User | null) => void;
};
