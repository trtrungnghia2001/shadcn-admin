import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/type";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { SigninDTO, SignupDTO } from "./schema";
import type { AccountDTO } from "@/features/settings/data/schema";

export type AuthType = {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  accessToken: string;
};

type AuthStoreType = {
  auth: AuthType | null;
  signin: (data: SigninDTO) => Promise<ApiResponse<AuthType>>;
  signup: (data: SignupDTO) => Promise<ApiResponse<AuthType>>;
  signout: () => Promise<ApiResponse<AuthType>>;
  updateMe: (data: AccountDTO) => Promise<ApiResponse<AuthType>>;
};

export const useAuthStore = create<AuthStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        auth: null,
        signin: async (data) => {
          const resp = (
            await axiosInstance.post<ApiResponse<AuthType>>(`auth/signin`, data)
          ).data;

          set({
            auth: resp.data,
          });

          return resp;
        },
        signup: async (data) => {
          const resp = (
            await axiosInstance.post<ApiResponse<AuthType>>(`auth/signup`, data)
          ).data;

          return resp;
        },
        signout: async () => {
          const resp = (
            await axiosInstance.post<ApiResponse<AuthType>>(`auth/signout`)
          ).data;

          set({
            auth: null,
          });

          return resp;
        },
        updateMe: async (data) => {
          const resp = (
            await axiosInstance.post<ApiResponse<AuthType>>(
              `auth/me/update`,
              data
            )
          ).data;

          set({
            auth: { ...get().auth, ...resp.data },
          });

          return resp;
        },
      }),
      {
        name: "auth",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
