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
