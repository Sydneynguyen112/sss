"use client";

import { useMemo, useState } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSessions } from "@/lib/hooks/use-sessions";
import { useGoals } from "@/lib/hooks/use-goals";
import { getFocusHoursByDay, getMonthlySessionCounts } from "@/lib/utils/goals-analytics";

function GlassTip({ active, payload, label, unit }: { active?: boolean; payload?: { value: number }[]; label?: string; unit: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-md px-3 py-2 text-xs shadow-soft">
      <p className="font-medium">{label}</p>
      <p className="text-primary tabular-nums">{payload[0]!.value} {unit}</p>
    </div>
  );
}

export default function ProgressChart() {
  const { sessions } = useSessions();
  const { goals } = useGoals();
  const [tab, setTab] = useState<"week" | "month">("month");

  const today = useMemo(() => new Date(), []);

  const weekData = useMemo(() => {
    const d = new Date(today);
    const diff = d.getDay() === 0 ? 6 : d.getDay() - 1;
    d.setDate(d.getDate() - diff);
    return getFocusHoursByDay(sessions, goals, d, 7);
  }, [sessions, goals, today]);

  const monthData = useMemo(
    () => getMonthlySessionCounts(sessions, today.getFullYear()),
    [sessions, today],
  );

  return (
    <div className="glass rounded-3xl p-5 sm:p-7 shadow-soft">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="label-eyebrow">Biểu đồ tiến độ</p>
          <h2 className="text-xl sm:text-2xl font-semibold">Tiến độ năm {today.getFullYear()}</h2>
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="h-8">
            <TabsTrigger value="week" className="text-xs">Tuần</TabsTrigger>
            <TabsTrigger value="month" className="text-xs">Tháng</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          {tab === "month" ? (
            <BarChart data={monthData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<GlassTip unit="buổi" />} cursor={{ fill: "var(--tertiary)", opacity: 0.4 }} />
              <Bar dataKey="sessions" fill="var(--primary)" radius={[6, 6, 0, 0]}>
                {monthData.map((d) => (
                  <Cell key={d.monthIdx} fillOpacity={d.monthIdx === today.getMonth() ? 1 : 0.4} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <BarChart data={weekData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.35} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} unit="h" />
              <Tooltip content={<GlassTip unit="giờ" />} cursor={{ fill: "var(--tertiary)", opacity: 0.4 }} />
              <Bar dataKey="hours" fill="url(#weekGrad)" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
