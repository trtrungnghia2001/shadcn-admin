import { useState, useEffect, type ReactNode } from "react";
import type { Theme } from "./type";
import { ThemeContext } from "./context";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("app-theme") as Theme;
    return savedTheme ?? "system";
  });
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Xác định theme thực tế
  const resolveTheme = (theme: Theme): "light" | "dark" => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  };

  useEffect(() => {
    const updateTheme = () => {
      const resolved = resolveTheme(theme);
      setResolvedTheme(resolved);

      const html = document.documentElement;
      if (resolved === "dark") html.classList.add("dark");
      else html.classList.remove("dark");
    };

    updateTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if (theme === "system") updateTheme();
    };
    mediaQuery.addEventListener("change", listener);

    if (theme !== "system") localStorage.setItem("app-theme", theme);

    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme]);

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("light");
    else setTheme("system"); // optional toggle behavior
  };

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
