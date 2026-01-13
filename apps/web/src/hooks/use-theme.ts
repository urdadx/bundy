import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export const THEME_LIGHT = "light";
export const THEME_DARK = "dark";

export function useThemeToggle() {
  const [hydrated, setHydrated] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === THEME_DARK;

  const toggle = useCallback(() => {
    setTheme(isDark ? THEME_LIGHT : THEME_DARK);
  }, [isDark, setTheme]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return { isDark, toggle, hydrated, theme: resolvedTheme };
}
