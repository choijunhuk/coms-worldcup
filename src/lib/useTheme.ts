import { useCallback, useEffect, useState } from "react";
import { applyTheme, resolveInitialTheme, toggleTheme } from "./theme";
import type { Theme } from "./theme";

/**
 * Provides current theme and a toggle function.
 * Initialises from localStorage / prefers-color-scheme on first mount.
 * Listens to system preference changes when no user preference is stored.
 */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>(() => {
    const initial = resolveInitialTheme();
    applyTheme(initial);
    return initial;
  });

  // Keep in sync if the system preference changes and user has no saved choice
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent): void => {
      try {
        if (localStorage.getItem("coms-wc-theme")) return; // user has explicit preference
      } catch {
        // localStorage blocked — always follow system
      }
      const next: Theme = e.matches ? "dark" : "light";
      applyTheme(next);
      setTheme(next);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggle = useCallback((): void => {
    const next = toggleTheme();
    setTheme(next);
  }, []);

  return { theme, toggle };
}
