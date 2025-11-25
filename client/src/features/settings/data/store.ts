import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface FontState {
  font: string;
  setFont: (font: string) => void;
}

export const useFontStore = create<FontState>()(
  devtools(
    persist(
      (set) => ({
        font: "Inter",
        setFont: (font) => {
          set({ font });

          const cssFont =
            font === "System" ? "system-ui, sans-serif" : font + ", sans-serif";

          document.documentElement.style.setProperty("--app-font", cssFont);
        },
      }),
      { name: "app-font", storage: createJSONStorage(() => localStorage) }
    )
  )
);
