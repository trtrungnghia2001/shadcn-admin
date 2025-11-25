import { useState, useEffect, type ReactNode } from "react";
import type { Theme } from "./type";
import { ThemeContext } from "./context";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("app-theme") as Theme;
    // check theme system
    if (!savedTheme) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return savedTheme;
  });

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("light");
    else setTheme("system");
  };

  useEffect(() => {
    // update theme
    const html = document.documentElement;
    if (theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");

    // save theme
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
