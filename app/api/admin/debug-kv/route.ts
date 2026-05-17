import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/auth";
import { getKv, isKvConfigured, KV_KEYS } from "@/lib/server/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const envCheck = {
    KV_REST_API_URL: !!process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
    UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    isKvConfigured: isKvConfigured(),
  };

  if (!isKvConfigured()) {
    return NextResponse.json({ ok: false, reason: "KV not configured", env: envCheck });
  }

  try {
    const kv = getKv();
    const testKey = "admin:debug:roundtrip";
    const testValue = { hello: "world", ts: Date.now() };
    await kv.set(testKey, testValue);
    const got = await kv.get(testKey);

    const [keyword, greetings, quote, meals] = await Promise.all([
      kv.get(KV_KEYS.keyword),
      kv.get(KV_KEYS.greetings),
      kv.get(KV_KEYS.quote),
      kv.get(KV_KEYS.meals),
    ]);

    return NextResponse.json({
      ok: true,
      env: envCheck,
      roundtripTest: { wrote: testValue, readBack: got, match: JSON.stringify(got) === JSON.stringify(testValue) },
      currentData: {
        keyword: { items: (keyword as { items?: unknown[] } | null)?.items?.length ?? 0, raw: keyword },
        greetings: { raw: greetings },
        quote: { items: (quote as { items?: unknown[] } | null)?.items?.length ?? 0, raw: quote },
        meals: { raw: meals },
      },
    });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      reason: "KV operation threw error",
      error: e instanceof Error ? e.message : String(e),
      env: envCheck,
    });
  }
}
