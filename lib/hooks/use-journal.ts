"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";
import { STORAGE } from "@/lib/utils/storage-keys";
import { dateKey } from "@/lib/utils/date-helpers";
import type { JournalEntry, MoodKind } from "@/types";

export function useJournal() {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>(STORAGE.JOURNAL, []);

  const addEntry = useCallback(
    (text: string, mood?: MoodKind) => {
      if (!text.trim()) return null;
      const entry: JournalEntry = {
        id: crypto.randomUUID(),
        date: dateKey(new Date()),
        text: text.trim(),
        mood,
      };
      setEntries((prev) => [entry, ...prev]);
      return entry;
    },
    [setEntries],
  );

  return { entries, addEntry };
}
