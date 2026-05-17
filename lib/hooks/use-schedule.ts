"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./use-local-storage";
import { STORAGE } from "@/lib/utils/storage-keys";
import type { Event, Goal } from "@/types";
import { generateSchedule, mergeSchedule } from "@/lib/utils/schedule-generator";

export function useSchedule() {
  const [events, setEvents] = useLocalStorage<Event[]>(STORAGE.SCHEDULE, []);

  const byDate = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const ev of events) {
      const list = map.get(ev.date) ?? [];
      list.push(ev);
      map.set(ev.date, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.time.localeCompare(b.time));
    }
    return map;
  }, [events]);

  const getEventsForDate = useCallback(
    (key: string) => byDate.get(key) ?? [],
    [byDate],
  );

  const upcomingFromNow = useCallback(
    (key: string, hhmm: string, limit = 3) => {
      const list = byDate.get(key) ?? [];
      return list.filter((e) => e.time >= hhmm).slice(0, limit);
    },
    [byDate],
  );

  const datesWithEvents = useMemo(
    () => new Set(events.map((e) => e.date)),
    [events],
  );

  const addEvent = useCallback(
    (ev: Omit<Event, "id">) => {
      const newEv: Event = { ...ev, id: crypto.randomUUID() };
      setEvents((prev) => [...prev, newEv]);
      return newEv;
    },
    [setEvents],
  );

  const updateEvent = useCallback(
    (id: string, patch: Partial<Omit<Event, "id">>) => {
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    },
    [setEvents],
  );

  const removeEvent = useCallback(
    (id: string) => {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    },
    [setEvents],
  );

  const regenerateFromGoals = useCallback(
    (goals: Goal[], fromDate: Date = new Date(), days = 14) => {
      const fresh = generateSchedule(goals, fromDate, days);
      setEvents((prev) => mergeSchedule(prev, fresh));
    },
    [setEvents],
  );

  return {
    events,
    byDate,
    getEventsForDate,
    upcomingFromNow,
    datesWithEvents,
    addEvent,
    updateEvent,
    removeEvent,
    regenerateFromGoals,
  };
}
