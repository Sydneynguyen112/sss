"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";
import { STORAGE } from "@/lib/utils/storage-keys";
import type { Goal } from "@/types";

export function useGoals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>(STORAGE.GOALS, []);

  const addGoal = useCallback(
    (g: Omit<Goal, "id">): Goal => {
      const newGoal: Goal = { ...g, id: crypto.randomUUID() };
      setGoals((prev) => [...prev, newGoal]);
      return newGoal;
    },
    [setGoals],
  );

  const updateGoal = useCallback(
    (id: string, patch: Partial<Omit<Goal, "id">>) => {
      setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
    },
    [setGoals],
  );

  const removeGoal = useCallback(
    (id: string) => {
      setGoals((prev) => prev.filter((g) => g.id !== id));
    },
    [setGoals],
  );

  const replaceGoals = useCallback(
    (next: Goal[]) => setGoals(next),
    [setGoals],
  );

  const getById = useCallback(
    (id: string) => goals.find((g) => g.id === id),
    [goals],
  );

  return { goals, addGoal, updateGoal, removeGoal, replaceGoals, getById };
}
