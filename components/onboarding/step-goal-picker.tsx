"use client";

import * as LucideIcons from "lucide-react";
import { GOAL_TEMPLATES } from "@/data/goal-templates";
import { cn } from "@/lib/utils";
import type { GoalTemplateKey } from "@/types";

const MAX_SELECTABLE = 3;

function getIcon(name: string): React.ComponentType<{ className?: string; strokeWidth?: number }> {
  const Icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>>;
  return Icons[name] ?? LucideIcons.Sparkles;
}

export function StepGoalPicker({
  selected,
  onChange,
}: {
  selected: GoalTemplateKey[];
  onChange: (next: GoalTemplateKey[]) => void;
}) {
  const toggle = (key: GoalTemplateKey) => {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key));
    } else if (selected.length < MAX_SELECTABLE) {
      onChange([...selected, key]);
    }
  };

  return (
    <div className="space-y-3 mt-4">
      <p className="text-xs text-text-muted">
        Đã chọn {selected.length}/{MAX_SELECTABLE}. Đừng tham quá — từng bước thôi.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {GOAL_TEMPLATES.map((t) => {
          const Icon = getIcon(t.icon);
          const active = selected.includes(t.key);
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => toggle(t.key)}
              className={cn(
                "relative text-left p-4 rounded-2xl border-2 transition-all",
                active
                  ? "border-primary bg-primary/5 shadow-soft"
                  : "border-border hover:border-primary/40 hover:bg-tertiary/30",
              )}
            >
              <div
                className="grid place-items-center w-10 h-10 rounded-xl text-white mb-3"
                style={{ backgroundColor: t.accent }}
              >
                <Icon className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <p className="font-semibold leading-tight">{t.name}</p>
              <p className="text-xs text-text-muted mt-1 line-clamp-2">{t.description}</p>
              {active && (
                <span className="absolute top-3 right-3 grid place-items-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
