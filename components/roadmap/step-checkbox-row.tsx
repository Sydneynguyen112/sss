"use client";

import { Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { SessionStep } from "@/types";

export function StepCheckboxRow({
  idx,
  step,
  checked,
  onToggle,
}: {
  idx: number;
  step: SessionStep;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li
      className={cn(
        "flex items-start gap-3 rounded-xl p-3 transition-colors border",
        checked ? "border-success/30 bg-success/5" : "border-border hover:border-primary/30 hover:bg-tertiary/20",
      )}
    >
      <div
        className={cn(
          "grid place-items-center w-8 h-8 rounded-full shrink-0 text-sm font-bold tabular-nums",
          checked ? "bg-success text-white" : "bg-primary/10 text-primary",
        )}
      >
        {checked ? <Check className="w-4 h-4" /> : idx + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={cn("font-medium leading-tight", checked && "line-through opacity-60")}>
            {step.title}
          </p>
          <span className="text-xs text-text-muted tabular-nums shrink-0">{step.minutes} phút</span>
        </div>
        <p className={cn("text-xs text-text-secondary mt-1", checked && "opacity-50")}>
          {step.description}
        </p>
      </div>
      <Checkbox
        checked={checked}
        onCheckedChange={onToggle}
        className="mt-1 shrink-0"
        aria-label={`Hoàn thành bước ${idx + 1}: ${step.title}`}
      />
    </li>
  );
}
