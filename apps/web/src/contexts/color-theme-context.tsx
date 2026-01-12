import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type ColorTheme = "default" | "ocean" | "forest" | "sunset";

interface ColorThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("wordsearch-color-theme");
      return (stored as ColorTheme) || "default";
    }
    return "default";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wordsearch-color-theme", colorTheme);
    }
  }, [colorTheme]);

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  const context = useContext(ColorThemeContext);
  if (context === undefined) {
    throw new Error("useColorTheme must be used within a ColorThemeProvider");
  }
  return context;
}
