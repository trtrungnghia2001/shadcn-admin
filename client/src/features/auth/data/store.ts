import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/type";
import { create } from "zustand";

type AuthType = {
  name: string;
  avatar: string;
  email: string;
  accessToken: string;
};

type SigninDTO = {
  email: string;
  password: string;
};
type SignupDTO = {
  email: string;
  password: string;
};

type AuthStoreType = {
  auth: AuthType | null;
  signin: (data: SigninDTO) => Promise<ApiResponse<AuthType>>;
  signup: (data: SignupDTO) => Promise<ApiResponse<AuthType>>;
  signout: () => Promise<ApiResponse<AuthType>>;
};

export const useAuthStore = create<AuthStoreType>()((set) => ({
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
}));
