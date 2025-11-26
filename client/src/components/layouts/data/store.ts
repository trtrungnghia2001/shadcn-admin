import { create } from "zustand";

type LayoutStoreType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useLayoutStore = create<LayoutStoreType>()((set) => ({
  open: true,
  setOpen: (open) => {
    set({ open });
  },
}));
