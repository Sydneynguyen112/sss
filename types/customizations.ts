// Shared types for admin overrides — used both on server (KV) and client (hook).
// Pattern chung: mỗi override có `items[]` + `mode` (random/fixed-id) + `schedule` (date → itemId).

export type PickMode = "random" | "fixed";

export interface KeywordItem {
  id: string;
  word: string;
  wordEn: string;
  ipa?: string;
  tagline: string;
}

export interface KeywordOverride {
  enabled: boolean;
  mode: PickMode;
  items: KeywordItem[];
  fixedId?: string;
  schedule: Record<string, string>; // YYYY-MM-DD → itemId
}

export interface GreetingItem {
  id: string;
  text: string;
}

export type TimeSlot = "morning" | "noon" | "evening" | "night";

export interface GreetingOverride {
  enabled: boolean;
  mode: PickMode;
  items: Record<TimeSlot, GreetingItem[]>;
  fixedIds?: Partial<Record<TimeSlot, string>>;
  schedule: Record<string, Partial<Record<TimeSlot, string>>>;
}

export interface QuoteItem {
  id: string;
  text: string;
  author: string;
}

export interface QuoteOverride {
  enabled: boolean;
  mode: PickMode;
  items: QuoteItem[];
  fixedId?: string;
  schedule: Record<string, string>;
}

export interface BackgroundItem {
  id: string;
  imageUrl: string;
  label?: string;
}

export interface BackgroundOverride {
  enabled: boolean;
  mode: PickMode;
  items: BackgroundItem[];
  fixedId?: string;
  schedule: Record<string, string>;
}

export type MealSlotKey = "breakfast" | "lunch" | "dinner";

export interface CustomMealItem {
  id: string;
  slot: MealSlotKey;
  name: string;
  note?: string;
}

export interface CustomMealsOverride {
  enabled: boolean;
  mode: PickMode;
  items: Record<MealSlotKey, CustomMealItem[]>;
  fixedIds?: Partial<Record<MealSlotKey, string>>;
  schedule: Record<string, Partial<Record<MealSlotKey, string>>>;
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

export interface Customizations {
  keyword: KeywordOverride;
  greetings: GreetingOverride;
  quote: QuoteOverride;
  background: BackgroundOverride;
  meals: CustomMealsOverride;
  popups: PopupMessage[];
  updatedAt: string;
}

const emptyKeyword: KeywordOverride = {
  enabled: false, mode: "random", items: [], schedule: {},
};
const emptyGreetings: GreetingOverride = {
  enabled: false, mode: "random",
  items: { morning: [], noon: [], evening: [], night: [] },
  schedule: {},
};
const emptyQuote: QuoteOverride = {
  enabled: false, mode: "random", items: [], schedule: {},
};
const emptyBackground: BackgroundOverride = {
  enabled: false, mode: "random", items: [], schedule: {},
};
const emptyMeals: CustomMealsOverride = {
  enabled: false, mode: "random",
  items: { breakfast: [], lunch: [], dinner: [] },
  schedule: {},
};

export const DEFAULT_CUSTOMIZATIONS: Customizations = {
  keyword: emptyKeyword,
  greetings: emptyGreetings,
  quote: emptyQuote,
  background: emptyBackground,
  meals: emptyMeals,
  popups: [],
  updatedAt: "1970-01-01T00:00:00.000Z",
};
