import { getKv, isKvConfigured, KV_KEYS } from "./kv";
import {
  DEFAULT_CUSTOMIZATIONS,
  type Customizations,
  type KeywordOverride,
  type GreetingOverride,
  type PopupMessage,
  type BackgroundOverride,
  type WeekendMealsOverride,
} from "@/types/customizations";

async function readKey<T>(key: string, fallback: T): Promise<T> {
  if (!isKvConfigured()) return fallback;
  const v = await getKv().get<T>(key);
  return v ?? fallback;
}

async function writeKey<T>(key: string, value: T): Promise<void> {
  if (!isKvConfigured()) throw new Error("KV chưa cấu hình.");
  await getKv().set(key, value);
}

export async function readAllCustomizations(): Promise<Customizations> {
  if (!isKvConfigured()) return DEFAULT_CUSTOMIZATIONS;

  const [keyword, greetings, popups, background, weekendMeals] = await Promise.all([
    readKey<KeywordOverride>(KV_KEYS.keyword, DEFAULT_CUSTOMIZATIONS.keyword),
    readKey<GreetingOverride>(KV_KEYS.greetings, DEFAULT_CUSTOMIZATIONS.greetings),
    readKey<PopupMessage[]>(KV_KEYS.popups, DEFAULT_CUSTOMIZATIONS.popups),
    readKey<BackgroundOverride>(KV_KEYS.background, DEFAULT_CUSTOMIZATIONS.background),
    readKey<WeekendMealsOverride>(KV_KEYS.weekendMeals, DEFAULT_CUSTOMIZATIONS.weekendMeals),
  ]);

  return {
    keyword,
    greetings,
    popups,
    background,
    weekendMeals,
    updatedAt: new Date().toISOString(),
  };
}

export async function writeKeyword(v: KeywordOverride): Promise<void> {
  await writeKey(KV_KEYS.keyword, v);
}

export async function writeGreetings(v: GreetingOverride): Promise<void> {
  await writeKey(KV_KEYS.greetings, v);
}

export async function writePopups(list: PopupMessage[]): Promise<void> {
  await writeKey(KV_KEYS.popups, list);
}

export async function writeBackground(v: BackgroundOverride): Promise<void> {
  await writeKey(KV_KEYS.background, v);
}

export async function writeWeekendMeals(v: WeekendMealsOverride): Promise<void> {
  await writeKey(KV_KEYS.weekendMeals, v);
}
