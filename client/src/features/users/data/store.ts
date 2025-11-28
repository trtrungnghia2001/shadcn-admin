import { create } from "zustand";
import type { User, UserStoreType } from "./type";
import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/type";

export const useUserStore = create<UserStoreType<User>>()((set, get) => ({
  data: [],
  create: async (user) => {
    const resp = (await axiosInstance.post<ApiResponse<User>>("/users", user))
      .data;
    set({
      data: [resp.data, ...get().data],
    });
    return resp;
  },
  update: async (id, user) => {
    const resp = (
      await axiosInstance.put<ApiResponse<User>>("/users/" + id, user)
    ).data;
    set({
      data: get().data.map((item) =>
        item._id === id ? { ...item, ...resp.data } : item
      ),
    });
    return resp;
  },
  remove: async (id) => {
    const resp = (await axiosInstance.delete<ApiResponse<User>>("/users/" + id))
      .data;
    set({
      data: get().data.filter((item) => item._id !== id),
    });
    return resp;
  },
  removeIds: async (ids) => {
    const resp = (
      await axiosInstance.delete<ApiResponse<User>>("/users", { data: { ids } })
    ).data;

    return resp;
  },
  fetchAll: async (query = "") => {
    const resp = (
      await axiosInstance.get<ApiResponse<User[]>>("/users?" + query)
    ).data;
    set({
      data: resp.data,
    });
    return resp;
  },
  fetchById: async (id) => {
    const resp = (await axiosInstance.get<ApiResponse<User>>("/users/" + id))
      .data;
    return resp;
  },
  importExcel: async (file) => {
    const fromData = new FormData();
    fromData.append("file", file);
    const resp = (
      await axiosInstance.post<ApiResponse<User[]>>("/users/import", fromData)
    ).data;
    return resp;
  },
  exportExcel: async () => {
    const resp = await axiosInstance.get("/users/export", {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(resp.data);

    // Tạo link tạm để trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  // dialog
  open: false,
  setOpen: (open) => {
    set({ open });
  },
  currentData: null,
  setCurrentData: (user) => {
    set({ currentData: user });
  },
}));
