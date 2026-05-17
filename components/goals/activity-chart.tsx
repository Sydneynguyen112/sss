"use client";

import { useMemo, useState } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGoals } from "@/lib/hooks/use-goals";
import { useSessions } from "@/lib/hooks/use-sessions";
import { getFocusHoursByDay, getMonthlySessionCounts } from "@/lib/utils/goals-analytics";
import { dateKey } from "@/lib/utils/date-helpers";

function GlassTooltip({ active, payload, label, unit }: { active?: boolean; payload?: { value: number }[]; label?: string; unit: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-md px-3 py-2 text-xs shadow-soft">
      <p className="font-medium">{label}</p>
      <p className="text-primary tabular-nums">{payload[0]!.value.toFixed(1)} {unit}</p>
    </div>
  );
}

export default function ActivityChart() {
  const { goals } = useGoals();
  const { sessions } = useSessions();
  const [tab, setTab] = useState<"weekly" | "monthly">("weekly");

  const today = useMemo(() => new Date(), []);
  const weekStart = useMemo(() => {
    // Start of week (Monday)
    const d = new Date(today);
    const dow = d.getDay();
    const diff = (dow === 0 ? 6 : dow - 1);
    d.setDate(d.getDate() - diff);
    return d;
  }, [today]);

  const weeklyData = useMemo(
    () => getFocusHoursByDay(sessions, goals, weekStart, 7),
    [sessions, goals, weekStart],
  );

  const monthlyData = useMemo(
    () => getMonthlySessionCounts(sessions, today.getFullYear()),
    [sessions, today],
  );

  const todayKey = dateKey(today);

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 shadow-soft h-full flex flex-col">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <p className="label-eyebrow">Hoạt động</p>
          <h2 className="text-xl font-semibold">Activity Fluidity</h2>
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="h-8">
            <TabsTrigger value="weekly" className="text-xs">Tuần</TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs">Tháng</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly" />
          <TabsContent value="monthly" />
        </Tabs>
      </div>

      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height={240}>
          {tab === "weekly" ? (
            <BarChart data={weeklyData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.35} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} unit="h" />
              <Tooltip content={<GlassTooltip unit="giờ" />} cursor={{ fill: "var(--tertiary)", opacity: 0.4 }} />
              <Bar dataKey="hours" fill="url(#barGradient)" radius={[6, 6, 0, 0]}>
                {weeklyData.map((d) => (
                  <Cell key={d.dateKey} fillOpacity={d.dateKey === todayKey ? 1 : 0.7} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <BarChart data={monthlyData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<GlassTooltip unit="buổi" />} cursor={{ fill: "var(--tertiary)", opacity: 0.4 }} />
              <Bar dataKey="sessions" fill="var(--primary)" radius={[6, 6, 0, 0]}>
                {monthlyData.map((d) => (
                  <Cell key={d.monthIdx} fillOpacity={d.monthIdx === today.getMonth() ? 1 : 0.45} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
