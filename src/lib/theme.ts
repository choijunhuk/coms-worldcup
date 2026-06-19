/**
 * Theme management — CSS custom property tokens on :root[data-theme]
 * Persists to localStorage; defaults to prefers-color-scheme.
 */

export type Theme = "light" | "dark";

const STORAGE_KEY = "coms-wc-theme";
const ROOT = document.documentElement;

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredTheme(): Theme | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "light" || raw === "dark") return raw;
  } catch {
    // localStorage blocked
  }
  return null;
}

export function applyTheme(theme: Theme): void {
  ROOT.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage blocked
  }
}

export function resolveInitialTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

export function toggleTheme(): Theme {
  const current = ROOT.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const next: Theme = current === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
