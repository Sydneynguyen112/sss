"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./use-local-storage";
import { STORAGE } from "@/lib/utils/storage-keys";
import { dateKey } from "@/lib/utils/date-helpers";
import { resolveSession } from "@/lib/utils/session-content";
import { useGoals } from "./use-goals";
import type { Session, SessionMedia } from "@/types";

function sessionId(goalId: string, dKey: string) {
  return `sess-${goalId}-${dKey}`;
}

export function useSessions() {
  const [sessions, setSessions] = useLocalStorage<Session[]>(STORAGE.SESSIONS, []);
  const { goals, updateGoal } = useGoals();

  const sessionsByKey = useMemo(() => {
    const map = new Map<string, Session>();
    for (const s of sessions) map.set(s.id, s);
    return map;
  }, [sessions]);

  const getOrInit = useCallback(
    (goalId: string, date: Date): Session => {
      const dKey = dateKey(date);
      const id = sessionId(goalId, dKey);
      const existing = sessionsByKey.get(id);
      if (existing) return existing;
      const goal = goals.find((g) => g.id === goalId);
      const sessionIdx = goal ? (resolveSession(goal, date)?.idx ?? 0) : 0;
      return {
        id,
        goalId,
        date: dKey,
        sessionIdx,
        completedSteps: [],
        photos: [],
        completed: false,
      };
    },
    [sessionsByKey, goals],
  );

  const upsert = useCallback(
    (session: Session) => {
      setSessions((prev) => {
        const idx = prev.findIndex((s) => s.id === session.id);
        if (idx === -1) return [...prev, session];
        const next = prev.slice();
        next[idx] = session;
        return next;
      });
    },
    [setSessions],
  );

  const toggleStep = useCallback(
    (goalId: string, date: Date, stepIdx: number) => {
      const sess = getOrInit(goalId, date);
      const has = sess.completedSteps.includes(stepIdx);
      const completedSteps = has
        ? sess.completedSteps.filter((i) => i !== stepIdx)
        : [...sess.completedSteps, stepIdx].sort((a, b) => a - b);
      upsert({ ...sess, completedSteps });
    },
    [getOrInit, upsert],
  );

  const addMedia = useCallback(
    (goalId: string, date: Date, media: Omit<SessionMedia, "id" | "createdAt">) => {
      const sess = getOrInit(goalId, date);
      const item: SessionMedia = {
        ...media,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      upsert({ ...sess, photos: [...sess.photos, item] });
    },
    [getOrInit, upsert],
  );

  const removeMedia = useCallback(
    (goalId: string, date: Date, mediaId: string) => {
      const sess = getOrInit(goalId, date);
      upsert({ ...sess, photos: sess.photos.filter((p) => p.id !== mediaId) });
    },
    [getOrInit, upsert],
  );

  const setNote = useCallback(
    (goalId: string, date: Date, note: string) => {
      const sess = getOrInit(goalId, date);
      upsert({ ...sess, note });
    },
    [getOrInit, upsert],
  );

  const markComplete = useCallback(
    (goalId: string, date: Date) => {
      const sess = getOrInit(goalId, date);
      upsert({ ...sess, completed: true });

      // Update goal progress: completed sessions / scheduled-so-far × 100
      const goal = goals.find((g) => g.id === goalId);
      if (goal) {
        const today = new Date();
        const startISO = goal.startDate;
        const completedCount = sessions.filter(
          (s) => s.goalId === goalId && s.completed,
        ).length + (sess.completed ? 0 : 1);
        const totalScheduledSoFar = countScheduledDays(goal, startISO, today);
        const progress = totalScheduledSoFar > 0
          ? Math.min(100, Math.round((completedCount / totalScheduledSoFar) * 100))
          : 0;
        updateGoal(goalId, { progress });
      }
    },
    [getOrInit, upsert, goals, sessions, updateGoal],
  );

  const unmarkComplete = useCallback(
    (goalId: string, date: Date) => {
      const sess = getOrInit(goalId, date);
      upsert({ ...sess, completed: false });
    },
    [getOrInit, upsert],
  );

  const getSessionFor = useCallback(
    (goalId: string, date: Date): Session => getOrInit(goalId, date),
    [getOrInit],
  );

  const completedDates = useMemo(() => {
    return new Set(sessions.filter((s) => s.completed).map((s) => s.date));
  }, [sessions]);

  return {
    sessions,
    getSessionFor,
    toggleStep,
    addMedia,
    removeMedia,
    setNote,
    markComplete,
    unmarkComplete,
    completedDates,
  };
}

function countScheduledDays(goal: { schedule: string[]; startDate: string }, startISO: string, until: Date): number {
  const start = new Date(startISO);
  if (start > until) return 0;
  let count = 0;
  const cursor = new Date(start);
  const dowMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  while (cursor <= until) {
    const dow = dowMap[cursor.getDay()]!;
    if (goal.schedule.includes(dow)) count++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}
