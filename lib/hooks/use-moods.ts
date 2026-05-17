"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./use-local-storage";
import { STORAGE } from "@/lib/utils/storage-keys";
import { dateKey } from "@/lib/utils/date-helpers";
import type { MoodEntry, MoodKind } from "@/types";

const MAX_ENTRIES = 100;

export function useMoods() {
  const [moods, setMoods] = useLocalStorage<MoodEntry[]>(STORAGE.MOODS, []);

  const addMood = useCallback(
    (mood: MoodKind, note?: string) => {
      const entry: MoodEntry = {
        id: crypto.randomUUID(),
        mood,
        timestamp: new Date().toISOString(),
        note,
      };
      setMoods((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
      return entry;
    },
    [setMoods],
  );

  const todayMood = useMemo<MoodKind | null>(() => {
    const today = dateKey(new Date());
    const todays = moods.filter((m) => m.timestamp.startsWith(today));
    return todays[0]?.mood ?? null;
  }, [moods]);

  return { moods, addMood, todayMood };
}
