import { Brackets, LogOut, Moon, Plus, Sun, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { getCurrentUser, logoutComsUser } from "../lib/miniApi";
import type { ComsUser } from "../lib/miniApi";
import { useTheme } from "../lib/useTheme";
import { AuthGate } from "./AuthGate";
import { LoginScreen } from "./LoginScreen";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<ComsUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const { theme, toggle } = useTheme();
  const [iconKey, setIconKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then((nextUser) => {
        if (mounted) setUser(nextUser);
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setChecking(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const logout = async (): Promise<void> => {
    setAuthLoading(true);
    try {
      await logoutComsUser();
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleToggle = (): void => {
    toggle();
    setIconKey((k) => k + 1);
  };

  return (
    <AuthGate checking={checking} user={user} loginScreen={<LoginScreen onLogin={setUser} />}>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
        <header className="wc-header sticky top-0 z-40">
          <nav className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
            <Link to="/" className="flex min-w-0 items-center gap-2 font-black">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--app-accent)] text-white">
                <Trophy size={18} className="dark:text-[#0a0c10]" />
              </span>
              <span className="truncate text-[var(--app-text)]">COMS 월드컵</span>
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <NavLink
                className={({ isActive }) => `coms-nav-link ${isActive ? "coms-nav-link-active" : ""}`}
                to="/"
              >
                <Brackets size={15} /> 목록
              </NavLink>
              <NavLink
                className={({ isActive }) => `coms-nav-link ${isActive ? "coms-nav-link-active" : ""}`}
                to="/create"
              >
                <Plus size={15} /> 만들기
              </NavLink>
              <span className="wc-user-badge hidden rounded-full px-3 py-2 text-xs font-black sm:inline-flex">
                {user?.name}
              </span>
              <button
                type="button"
                aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
                className="theme-toggle"
                onClick={handleToggle}
              >
                {theme === "dark" ? (
                  <Sun key={`sun-${iconKey}`} size={16} className="theme-icon-enter" />
                ) : (
                  <Moon key={`moon-${iconKey}`} size={16} className="theme-icon-enter" />
                )}
              </button>
              <button
                type="button"
                className="coms-nav-link"
                onClick={() => void logout()}
                disabled={authLoading}
              >
                <LogOut size={15} /> 로그아웃
              </button>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      </div>
    </AuthGate>
  );
}
