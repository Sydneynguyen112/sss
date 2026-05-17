"use client";

import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  value,
  label,
  caption,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  caption?: string;
}) {
  return (
    <div className="glass rounded-2xl p-5 shadow-soft flex items-start justify-between gap-3">
      <div className="space-y-1 min-w-0">
        <p className="label-eyebrow">{label}</p>
        <p className="text-3xl font-bold tracking-tight tabular-nums">{value}</p>
        {caption && <p className="text-xs text-text-muted">{caption}</p>}
      </div>
      <div className="grid place-items-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
        <Icon className="w-5 h-5" strokeWidth={1.75} />
      </div>
    </div>
  );
}
