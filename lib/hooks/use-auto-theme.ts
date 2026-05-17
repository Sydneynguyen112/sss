"use client";

import { useCallback, useEffect, useState } from "react";
import type { Settings, Theme } from "@/types";
import { STORAGE, DEFAULT_SETTINGS } from "@/lib/utils/storage-keys";
import { useLocalStorage } from "./use-local-storage";

export function computeTheme(now: Date, settings: Settings): Theme {
  if (settings.autoTheme === false && settings.manualTheme) {
    return settings.manualTheme;
  }
  const h = now.getHours();
  return h >= 6 && h < 18 ? "light" : "dark";
}

export function useAutoTheme() {
  const [settings, setSettings] = useLocalStorage<Settings>(
    STORAGE.SETTINGS,
    DEFAULT_SETTINGS,
  );
  const [theme, setTheme] = useState<Theme>("light");

  const apply = useCallback((t: Theme) => {
    setTheme(t);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", t === "dark");
    }
  }, []);

  useEffect(() => {
    apply(computeTheme(new Date(), settings));

    const interval = setInterval(() => {
      apply(computeTheme(new Date(), settings));
    }, 60_000);

    const onVisibility = () => {
      if (!document.hidden) apply(computeTheme(new Date(), settings));
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [settings, apply]);

  return { theme, settings, setSettings };
}
