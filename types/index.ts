export type Theme = "light" | "dark";

export type GoalTemplateKey =
  | "tennis"
  | "reading"
  | "language"
  | "gym"
  | "yoga"
  | "writing"
  | "art";

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type EventType = "meal" | "goal" | "work" | "meeting" | "self" | "rest";

export type MoodKind = "peaceful" | "energetic" | "sleepy" | "creative";

export type MealSlot = "breakfast" | "lunch" | "snack" | "dinner";

export interface Settings {
  userName: string;
  partnerName?: string;
  autoTheme: boolean;
  manualTheme?: Theme;
  language: "vi" | "en";
}

export interface SessionStep {
  title: string;
  minutes: number;
  description: string;
}

export interface SessionTemplate {
  name: string;
  summary: string;
  steps: SessionStep[];
}

export interface GoalTemplate {
  key: GoalTemplateKey;
  name: string;
  shortName: string;
  icon: string;
  accent: string;
  description: string;
  defaultSchedule: DayOfWeek[];
  defaultTime: string;
  defaultDuration: number;
  category: "physical" | "learning" | "creative";
  dailySessions: SessionTemplate[];
  // Bài tập nhẹ tại nhà, gợi ý vào ngày KHÔNG có lịch chính (ví dụ Tennis ngày nghỉ → drill tại nhà)
  homeDrills?: SessionTemplate[];
  homeDrillDuration?: number;
  homeDrillTime?: string;
}

export interface Goal {
  id: string;
  templateKey: GoalTemplateKey;
  name: string;
  startDate: string;
  durationWeeks: number;
  schedule: DayOfWeek[];
  time: string;
  duration: number;
  progress: number;
}

export interface MoodEntry {
  id: string;
  mood: MoodKind;
  timestamp: string;
  note?: string;
}

export interface SessionMedia {
  id: string;
  type: "image" | "video";
  data: string;
  createdAt: string;
}

export interface Session {
  id: string;
  goalId: string;
  date: string;
  sessionIdx: number;
  completedSteps: number[];
  photos: SessionMedia[];
  note?: string;
  completed: boolean;
}

export interface MealIngredient {
  name: string;
  amount: string;
  icon?: string;
}

export interface MealOption {
  slot: MealSlot;
  name: string;
  kcal: number;
  protein: number;
  prepTime: number;
  ingredients: MealIngredient[];
  tip: string;
}

export interface Event {
  id: string;
  date: string;
  time: string;
  endTime: string;
  title: string;
  type: EventType;
  description?: string;
  location?: string;
  tags?: string[];
  attachments?: string[];
  goalId?: string;
  mealData?: {
    kcal: number;
    protein: number;
    ingredients: MealIngredient[];
  };
}

export interface Quote {
  text: string;
  author: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  mood?: MoodKind;
}
