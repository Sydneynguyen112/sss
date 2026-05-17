"use client";

import type { Event } from "@/types";
import { cn } from "@/lib/utils";
import { eventTop, eventHeight } from "@/lib/utils/timeline-math";
import { UtensilsCrossed, Target, Briefcase, MessageSquare, Sparkles, Moon, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TYPE_STYLES: Record<Event["type"], { ring: string; bg: string; icon: LucideIcon }> = {
  meal: { ring: "border-l-warning", bg: "bg-amber-50/70 dark:bg-amber-900/20", icon: UtensilsCrossed },
  goal: { ring: "border-l-primary", bg: "bg-primary/10", icon: Target },
  work: { ring: "border-l-secondary", bg: "bg-white/70 dark:bg-surface/70", icon: Briefcase },
  meeting: { ring: "border-l-blue-400", bg: "bg-blue-50/70 dark:bg-blue-900/20", icon: MessageSquare },
  self: { ring: "border-l-teal-400", bg: "bg-tertiary/70", icon: Sparkles },
  rest: { ring: "border-l-muted", bg: "bg-muted/40", icon: Moon },
};

export function EventCard({
  event,
  onClick,
  leftOffset = 0,
}: {
  event: Event;
  onClick?: () => void;
  leftOffset?: number;
}) {
  const style = TYPE_STYLES[event.type];
  const Icon = style.icon;
  const top = eventTop(event.time);
  const height = eventHeight(event.time, event.endTime);
  const compact = height < 60;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        top,
        height,
        left: `${64 + leftOffset}px`,
        right: "8px",
      }}
      className={cn(
        "absolute text-left rounded-xl backdrop-blur-md shadow-soft border-l-4 px-3 py-2 transition-all hover:translate-y-[-1px] hover:shadow-md overflow-hidden",
        style.ring,
        style.bg,
      )}
    >
      <div className="flex items-start gap-2 h-full">
        <Icon className="w-4 h-4 mt-0.5 text-text-secondary shrink-0" strokeWidth={1.75} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold tabular-nums text-text-secondary">
            {event.time} – {event.endTime}
          </p>
          <p className={cn("font-medium leading-tight truncate", compact ? "text-xs" : "text-sm")}>
            {event.title}
          </p>
          {!compact && event.description && (
            <p className="text-xs text-text-muted line-clamp-2 mt-0.5">{event.description}</p>
          )}
          {!compact && event.tags && event.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-1">
              {event.tags.slice(0, 2).map((t) => (
                <Badge key={t} variant="outline" className="text-[10px] py-0 px-1.5">
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
