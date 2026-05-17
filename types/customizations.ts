// Shared types for admin overrides — used both on server (KV) and client (hook).

export interface KeywordOverride {
  enabled: boolean;
  word: string;
  wordEn: string;
  tagline: string;
}

export interface GreetingOverride {
  enabled: boolean;
  morning: string;
  noon: string;
  evening: string;
  night: string;
}

export interface PopupMessage {
  id: string;
  title: string;
  body: string;
  emoji?: string;
  createdAt: string;
  activeFrom?: string;
  activeUntil?: string;
  oncePerVisitor: boolean;
}

export interface BackgroundOverride {
  enabled: boolean;
  imageUrl?: string;
}

export interface WeekendMealsOverride {
  enabled: boolean;
  saturday?: { breakfast?: string; lunch?: string; dinner?: string; note?: string };
  sunday?: { breakfast?: string; lunch?: string; dinner?: string; note?: string };
}

export interface Customizations {
  keyword: KeywordOverride;
  greetings: GreetingOverride;
  popups: PopupMessage[];
  background: BackgroundOverride;
  weekendMeals: WeekendMealsOverride;
  updatedAt: string;
}

export const DEFAULT_CUSTOMIZATIONS: Customizations = {
  keyword: { enabled: false, word: "", wordEn: "", tagline: "" },
  greetings: {
    enabled: false,
    morning: "",
    noon: "",
    evening: "",
    night: "",
  },
  popups: [],
  background: { enabled: false },
  weekendMeals: { enabled: false },
  updatedAt: "1970-01-01T00:00:00.000Z",
};
