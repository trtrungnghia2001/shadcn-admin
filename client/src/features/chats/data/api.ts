import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/type";
import type { ChatMessageType, ChatMessageDTO, ChatUserType } from "./type";

export const getUsersApi = async () => {
  return (await axiosInstance.get<ApiResponse<ChatUserType[]>>(`/chat/users`))
    .data;
};
export const getSendApi = async (data: ChatMessageDTO) => {
  return (
    await axiosInstance.post<ApiResponse<ChatMessageType>>(`/chat/send`, data)
  ).data;
};
export const getMessageApi = async (receiverId: string) => {
  return (
    await axiosInstance.get<ApiResponse<ChatMessageType[]>>(
      `/chat/users/message/` + receiverId
    )
  ).data;
};
