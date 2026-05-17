"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAutoTheme } from "@/lib/hooks/use-auto-theme";
import type { Settings, Theme } from "@/types";

type ThemeContextValue = {
  theme: Theme;
  settings: Settings;
  setSettings: (next: Settings | ((prev: Settings) => Settings)) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useAutoTheme();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}
