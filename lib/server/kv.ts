import { Redis } from "@upstash/redis";

let cached: Redis | null = null;

export function getKv(): Redis {
  if (cached) return cached;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error(
      "KV credentials missing. Set KV_REST_API_URL + KV_REST_API_TOKEN in env (Vercel auto-injects when KV is provisioned).",
    );
  }
  cached = new Redis({ url, token });
  return cached;
}

export function isKvConfigured(): boolean {
  return !!(
    (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) &&
    (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

export const KV_KEYS = {
  // auth: short-lived magic link tokens (10-min TTL)
  magicToken: (token: string) => `auth:magic:${token}`,
  // admin overrides
  keyword: "admin:keyword",
  greetings: "admin:greetings",
  background: "admin:background",
  popups: "admin:popups",
  weekendMeals: "admin:meals:weekend",
} as const;
