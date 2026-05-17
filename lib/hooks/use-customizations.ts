"use client";

import { useEffect, useState } from "react";
import { DEFAULT_CUSTOMIZATIONS, type Customizations } from "@/types/customizations";

const CACHE_KEY = "hanhtrinh.customizations.cache.v3";
const REFRESH_INTERVAL = 30_000; // 30s

// Cleanup old cache versions
if (typeof window !== "undefined") {
  try {
    window.localStorage.removeItem("hanhtrinh.customizations.cache");
  } catch {}
}

let memoryCache: Customizations | null = null;

function readCache(): Customizations | null {
  if (memoryCache) return memoryCache;
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (raw) {
      memoryCache = JSON.parse(raw) as Customizations;
      return memoryCache;
    }
  } catch {
    // ignore
  }
  return null;
}

function writeCache(data: Customizations) {
  memoryCache = data;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota
  }
}

async function fetchCustomizations(): Promise<Customizations | null> {
  try {
    const res = await fetch("/api/customizations", { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Customizations;
  } catch {
    return null;
  }
}

export function useCustomizations(): Customizations {
  const [data, setData] = useState<Customizations>(() => readCache() ?? DEFAULT_CUSTOMIZATIONS);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      const fresh = await fetchCustomizations();
      if (!alive || !fresh) return;
      setData(fresh);
      writeCache(fresh);
    };
    tick();
    const interval = setInterval(tick, REFRESH_INTERVAL);
    const onFocus = () => tick();
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      alive = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  return data;
}
