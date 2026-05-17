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

export type MealSlotKey = "breakfast" | "lunch" | "dinner";

export interface CustomMealItem {
  id: string;
  slot: MealSlotKey;
  name: string;
  note?: string;
  kcal?: number;
  protein?: number;
  ingredients?: { name: string; amount: string }[];
}

export interface CustomMealsOverride {
  items: Record<MealSlotKey, CustomMealItem[]>;
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

export interface Customizations {
  keyword: KeywordOverride;
  greetings: GreetingOverride;
  quote: QuoteOverride;
  meals: CustomMealsOverride;
  tennis: TennisOverride;
  popups: PopupMessage[];
  updatedAt: string;
}

const emptyKeyword: KeywordOverride = { items: [], schedule: {} };
const emptyGreetings: GreetingOverride = {
  items: { morning: [], noon: [], evening: [], night: [] },
  schedule: {},
};
const emptyQuote: QuoteOverride = { items: [], schedule: {} };
const emptyMeals: CustomMealsOverride = {
  items: { breakfast: [], lunch: [], dinner: [] },
  schedule: {},
};

const emptyTennis: TennisOverride = { days: {} };

export const DEFAULT_CUSTOMIZATIONS: Customizations = {
  keyword: emptyKeyword,
  greetings: emptyGreetings,
  quote: emptyQuote,
  meals: emptyMeals,
  tennis: emptyTennis,
  popups: [],
  updatedAt: "1970-01-01T00:00:00.000Z",
};
