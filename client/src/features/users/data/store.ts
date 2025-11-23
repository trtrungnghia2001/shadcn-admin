import { create } from "zustand";
import type { User, UserStoreType } from "./type";
import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/type";
import { usersData } from "./data";

export const useUserStore = create<UserStoreType<User>>()((set, get) => ({
  data: usersData,
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
        item.id === id ? { ...item, ...resp.data } : item
      ),
    });
    return resp;
  },
  remove: async (id) => {
    const resp = (await axiosInstance.delete<ApiResponse<User>>("/users/" + id))
      .data;
    set({
      data: get().data.filter((item) => item.id !== id),
    });
    return resp;
  },
  fetchAll: async () => {
    const resp = (await axiosInstance.get<ApiResponse<User[]>>("/users?")).data;
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
