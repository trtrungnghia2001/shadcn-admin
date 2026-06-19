import { create } from "zustand";

interface NotificationState {
  isOpen: boolean;
  onChange: (isOpen: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  isOpen: false,
  onChange: (isOpen) => set({ isOpen }),
}));
