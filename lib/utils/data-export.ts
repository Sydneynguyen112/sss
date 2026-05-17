import { STORAGE } from "./storage-keys";

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function exportAllData(): void {
  if (typeof window === "undefined") return;
  const dump: Record<string, unknown> = {};
  for (const key of Object.values(STORAGE)) {
    const raw = window.localStorage.getItem(key);
    try {
      dump[key] = raw ? JSON.parse(raw) : null;
    } catch {
      dump[key] = raw;
    }
  }
  const blob = new Blob([JSON.stringify(dump, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hanhtrinh-data-${todayKey()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
