export const STORAGE = {
  SETTINGS: "hanhtrinh.settings",
  GOALS: "hanhtrinh.goals",
  SCHEDULE: "hanhtrinh.schedule",
  MOODS: "hanhtrinh.moods",
  SESSIONS: "hanhtrinh.sessions",
  JOURNAL: "hanhtrinh.journal",
  ONBOARDED: "hanhtrinh.onboarded",
} as const;

export type StorageKey = (typeof STORAGE)[keyof typeof STORAGE];

export const DEFAULT_SETTINGS = {
  userName: "anh yêu",
  partnerName: "em yêu",
  autoTheme: true,
  language: "vi" as const,
};
