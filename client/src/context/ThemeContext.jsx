import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext({
  theme: "",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dim");

  const toggleTheme = () => {
    setTheme(theme === "dim" ? "light" : "dim");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div data-theme={theme} className="min-h-screen">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
