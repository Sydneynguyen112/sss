"use client";

import Link from "next/link";
import { useState } from "react";
import { Leaf, Settings as SettingsIcon } from "lucide-react";
import { useTheme } from "./theme-provider";
import { SettingsModal } from "./settings/settings-modal";

function initials(name?: string) {
  if (!name) return "♡";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function TopNav() {
  const { settings } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 glass border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary text-primary-foreground shadow-soft transition-transform group-hover:scale-105">
                <Leaf className="w-5 h-5" strokeWidth={1.75} />
              </span>
              <span className="font-bold text-lg tracking-tight">Today</span>
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="grid place-items-center w-9 h-9 rounded-full text-text-secondary hover:text-primary hover:bg-tertiary/60 transition"
                aria-label="Cài đặt"
              >
                <SettingsIcon className="w-5 h-5" strokeWidth={1.75} />
              </button>
              <div
                className="grid place-items-center w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xs font-bold"
                aria-hidden
              >
                {initials(settings.userName)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
