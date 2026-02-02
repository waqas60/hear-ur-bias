import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Create Theme Context
export const ThemeContext = createContext();

// 2. Custom hook for easier access in your components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// 3. Theme Provider
export const ThemeProvider = ({ children }) => {
  // Load saved theme or default to system preference (or dark)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    
    // Check if user's OS is set to dark mode
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Apply theme to the root element
  useEffect(() => {
    // We apply it to documentElement (<html>) so variables are available everywhere
    const root = window.document.documentElement;
    
    // Remove old classes and apply the new one
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};