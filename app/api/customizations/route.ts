import { NextResponse } from "next/server";
import { readAllCustomizations } from "@/lib/server/customizations";
import { DEFAULT_CUSTOMIZATIONS } from "@/types/customizations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await readAllCustomizations();
    return NextResponse.json(data, {
      headers: { "cache-control": "no-store, max-age=0" },
    });
  } catch (e) {
    console.error("[customizations] read failed:", e);
    return NextResponse.json(DEFAULT_CUSTOMIZATIONS, {
      headers: { "cache-control": "no-store, max-age=0" },
    });
  }
}
