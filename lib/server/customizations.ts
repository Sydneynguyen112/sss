import { getKv, isKvConfigured, KV_KEYS } from "./kv";
import {
  DEFAULT_CUSTOMIZATIONS,
  type Customizations,
  type KeywordOverride,
  type GreetingOverride,
  type QuoteOverride,
  type BackgroundOverride,
  type CustomMealsOverride,
  type PopupMessage,
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

  const [keyword, greetings, quote, background, meals, popups] = await Promise.all([
    readKey<KeywordOverride>(KV_KEYS.keyword, DEFAULT_CUSTOMIZATIONS.keyword),
    readKey<GreetingOverride>(KV_KEYS.greetings, DEFAULT_CUSTOMIZATIONS.greetings),
    readKey<QuoteOverride>(KV_KEYS.quote, DEFAULT_CUSTOMIZATIONS.quote),
    readKey<BackgroundOverride>(KV_KEYS.background, DEFAULT_CUSTOMIZATIONS.background),
    readKey<CustomMealsOverride>(KV_KEYS.meals, DEFAULT_CUSTOMIZATIONS.meals),
    readKey<PopupMessage[]>(KV_KEYS.popups, DEFAULT_CUSTOMIZATIONS.popups),
  ]);

  return {
    keyword,
    greetings,
    quote,
    background,
    meals,
    popups,
    updatedAt: new Date().toISOString(),
  };
}

export const writeKeyword = (v: KeywordOverride) => writeKey(KV_KEYS.keyword, v);
export const writeGreetings = (v: GreetingOverride) => writeKey(KV_KEYS.greetings, v);
export const writeQuote = (v: QuoteOverride) => writeKey(KV_KEYS.quote, v);
export const writeBackground = (v: BackgroundOverride) => writeKey(KV_KEYS.background, v);
export const writeMeals = (v: CustomMealsOverride) => writeKey(KV_KEYS.meals, v);
export const writePopups = (list: PopupMessage[]) => writeKey(KV_KEYS.popups, list);
