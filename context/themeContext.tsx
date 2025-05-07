import React, { createContext, useContext } from "react";
import { useSelector } from "react-redux";

import { Colors } from "@/contants/Colors";
import { CustomTheme } from "@/utils/types";

export const ThemeContext = createContext<CustomTheme | undefined>(undefined);

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const themeMode = useSelector((state: any) => state.theme.mode);
  const theme = React.useMemo<CustomTheme>(() => (themeMode === "dark" ? Colors.dark : Colors.light), [themeMode]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}