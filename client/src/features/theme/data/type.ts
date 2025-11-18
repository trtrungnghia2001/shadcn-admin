export type Theme = "light" | "dark" | "system";

export interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark"; // theme thực tế đang dùng
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
