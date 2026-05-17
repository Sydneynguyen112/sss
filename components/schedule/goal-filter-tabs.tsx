"use client";

import { useGoals } from "@/lib/hooks/use-goals";
import { Progress } from "@/components/ui/progress";
import { findTemplate } from "@/data/goal-templates";
import { cn } from "@/lib/utils";

export function GoalFilterTabs({
  selectedGoalId,
  onSelect,
}: {
  selectedGoalId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const { goals } = useGoals();

  if (goals.length === 0) return null;

  const selected = selectedGoalId ? goals.find((g) => g.id === selectedGoalId) : null;
  const selectedTpl = selected ? findTemplate(selected.templateKey) : null;

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1 -mx-2 px-2">
        <TabPill
          active={selectedGoalId === null}
          onClick={() => onSelect(null)}
          label="Tất cả"
        />
        {goals.map((g) => {
          const tpl = findTemplate(g.templateKey);
          return (
            <TabPill
              key={g.id}
              active={selectedGoalId === g.id}
              onClick={() => onSelect(g.id)}
              label={g.name}
              dotColor={tpl?.accent}
            />
          );
        })}
      </div>

      {selected && selectedTpl && (
        <div className="rounded-2xl border border-border/60 bg-surface/40 p-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: selectedTpl.accent }}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{selected.name}</p>
              <p className="text-xs text-text-muted">
                {selected.time} · {selected.duration} phút · {selected.durationWeeks} tuần
              </p>
            </div>
          </div>
          <div className="flex-1 min-w-[180px] space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Tiến độ</span>
              <span className="font-semibold tabular-nums">{selected.progress}%</span>
            </div>
            <Progress value={selected.progress} className="h-1.5" />
          </div>
        </div>
      )}
    </div>
  );
}

function TabPill({
  active,
  onClick,
  label,
  dotColor,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  dotColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
        active
          ? "bg-primary text-primary-foreground border-primary shadow-soft"
          : "bg-surface/40 text-text-secondary hover:text-text-primary hover:bg-surface/70 border-border/60",
      )}
    >
      {dotColor && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: active ? "currentColor" : dotColor }}
        />
      )}
      {label}
    </button>
  );
}
