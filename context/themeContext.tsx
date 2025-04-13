import React, { createContext, useContext } from "react";
import { useSelector } from "react-redux";

import { Colors } from "@/contants/Colors";
import { CustomTheme } from "@/utils/types";

// Define the type for theme object
// export type CustomTheme = {
//   background: string;
//   textField: string;
//   text: string;
//   placeholder: string;
// };

const ThemeContext = createContext<CustomTheme | undefined>(undefined);

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const themeMode = useSelector((state: any) => state.theme.mode);
  const theme = React.useMemo(() => (themeMode == "dark" ? Colors.dark : Colors.light), [themeMode]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme without unnecessary re-renders
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}