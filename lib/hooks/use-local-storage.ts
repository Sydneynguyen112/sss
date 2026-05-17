"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SetValue<T> = T | ((prev: T) => T);

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: SetValue<T>) => void, () => void] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);
  const initialRef = useRef(initialValue);

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      // ignore parse errors — keep initial
    }
    setHydrated(true);
  }, [key]);

  // Cross-tab sync via storage event
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      try {
        setValue(e.newValue ? (JSON.parse(e.newValue) as T) : initialRef.current);
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  const update = useCallback(
    (next: SetValue<T>) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(key, JSON.stringify(resolved));
            // Notify same-tab listeners (storage event only fires across tabs)
            window.dispatchEvent(
              new CustomEvent("hanhtrinh:storage", {
                detail: { key, value: resolved },
              }),
            );
          } catch {
            // quota or serialize errors — silently swallow for v1
          }
        }
        return resolved;
      });
    },
    [key],
  );

  const remove = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
    setValue(initialRef.current);
  }, [key]);

  // Same-tab event sync (custom event since 'storage' only fires for OTHER tabs)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<{ key: string; value: T }>).detail;
      if (detail?.key === key) setValue(detail.value);
    };
    window.addEventListener("hanhtrinh:storage", onCustom);
    return () => window.removeEventListener("hanhtrinh:storage", onCustom);
  }, [key]);

  return [hydrated ? value : initialRef.current, update, remove];
}
