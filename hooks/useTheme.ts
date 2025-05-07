import { ThemeContext } from "@/context/themeContext";
import { useContext } from "react";

// Custom hook to use the theme without unnecessary re-renders
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}