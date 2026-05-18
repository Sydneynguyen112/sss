// Admin customization types — đơn giản hoá: items[] + schedule (date → itemId).
// Không còn enabled/mode/fixedId. Có items thì dùng, schedule override ngày cụ thể.

export interface KeywordItem {
  id: string;
  word: string;
  wordEn?: string;
  ipa?: string;
  tagline?: string;
}

export interface KeywordOverride {
  items: KeywordItem[];
  schedule: Record<string, string>;
}

export interface GreetingItem {
  id: string;
  text: string;
}

export type TimeSlot = "morning" | "noon" | "evening" | "night";

export interface GreetingOverride {
  items: Record<TimeSlot, GreetingItem[]>;
  schedule: Record<string, Partial<Record<TimeSlot, string>>>;
}

// QuoteItem giờ bao gồm imageUrl — merge với background cũ. 1 item = 1 cặp châm ngôn + ảnh.
export interface QuoteItem {
  id: string;
  text: string;
  author?: string;
  imageUrl?: string;
}

export interface QuoteOverride {
  items: QuoteItem[];
  schedule: Record<string, string>;
}

export type MealSlotKey = "breakfast" | "snack" | "lunch" | "dinner";

// Một bữa ăn cụ thể. Cùng shape cho default program và admin override.
export interface MealEntry {
  name: string;
  kcal?: number;
  protein?: number;
  ingredients?: { name: string; amount: string }[];
  note?: string;
}

// 7-day rotating menu: key = "0"=T2, "1"=T3, ..., "6"=CN.
// Admin override từng slot; slot trống → fallback về default program trong code.
export interface CustomMealsOverride {
  program: Record<string, Partial<Record<MealSlotKey, MealEntry>>>;
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

export interface TennisDrillOverride {
  name?: string;
  minutes?: number;
  description?: string;
}

export interface TennisDayOverride {
  drills?: TennisDrillOverride[];
  note?: string;
}

export interface TennisOverride {
  days: Record<string, TennisDayOverride>;
}

export interface OnboardingMessage {
  id: string;
  text: string;
}

export interface OnboardingOverride {
  messages: OnboardingMessage[];
}

export interface Customizations {
  keyword: KeywordOverride;
  greetings: GreetingOverride;
  quote: QuoteOverride;
  meals: CustomMealsOverride;
  tennis: TennisOverride;
  onboarding: OnboardingOverride;
  popups: PopupMessage[];
  updatedAt: string;
}

const emptyKeyword: KeywordOverride = { items: [], schedule: {} };
const emptyGreetings: GreetingOverride = {
  items: { morning: [], noon: [], evening: [], night: [] },
  schedule: {},
};
const emptyQuote: QuoteOverride = { items: [], schedule: {} };
const emptyMeals: CustomMealsOverride = { program: {} };

const emptyTennis: TennisOverride = { days: {} };
const emptyOnboarding: OnboardingOverride = { messages: [] };

export const DEFAULT_CUSTOMIZATIONS: Customizations = {
  keyword: emptyKeyword,
  greetings: emptyGreetings,
  quote: emptyQuote,
  meals: emptyMeals,
  tennis: emptyTennis,
  onboarding: emptyOnboarding,
  popups: [],
  updatedAt: "1970-01-01T00:00:00.000Z",
};
