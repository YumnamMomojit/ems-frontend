import { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pulsehr-theme");
      return stored || "dark"; // Changed default to 'dark'
    }
    return "dark"; // Changed default to 'dark'
  });


  useEffect(() => {
    const root = document.documentElement;
    console.log('ThemeProvider useEffect running, theme:', theme);
    console.log('Current HTML classes before:', root.className);
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    console.log('Current HTML classes after:', root.className);
    localStorage.setItem("pulsehr-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
