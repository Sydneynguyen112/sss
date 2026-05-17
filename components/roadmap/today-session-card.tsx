"use client";

import { motion } from "framer-motion";
import { Clock, Zap, ArrowRight, Leaf, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGoals } from "@/lib/hooks/use-goals";
import { deriveTodayPrimarySession, totalDurationMinutes } from "@/lib/utils/roadmap-content";
import { intensityLabel } from "@/lib/utils/session-content";

export function TodaySessionCard() {
  const { goals } = useGoals();
  const today = deriveTodayPrimarySession(goals);

  const scrollToGoal = () => {
    if (!today) return;
    const el = document.getElementById(`goal-card-${today.goal.id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass rounded-3xl p-6 sm:p-7 shadow-soft h-full flex flex-col justify-between gap-6"
    >
      <div>
        <p className="label-eyebrow">Phiên tập hôm nay</p>
        {today ? (
          <>
            <h2 className="text-xl sm:text-2xl font-semibold mt-2 leading-tight">
              {today.session.name}
            </h2>
            <p className="text-xs text-primary mt-1 font-medium">{today.goal.name}</p>
            <p className="text-sm text-text-secondary mt-2 line-clamp-3 text-balance">
              {today.session.summary}
            </p>
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <Chip icon={<Clock className="w-3.5 h-3.5" />}>
                {totalDurationMinutes(today.session)} phút
              </Chip>
              <Chip icon={<Zap className="w-3.5 h-3.5" />}>
                {intensityLabel(totalDurationMinutes(today.session))}
              </Chip>
              {today.kind === "homeDrill" && (
                <Chip icon={<Home className="w-3.5 h-3.5" />}>Tại nhà</Chip>
              )}
            </div>
          </>
        ) : (
          <div className="mt-2 space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold leading-tight">
              Hôm nay là ngày nghỉ 🌿
            </h2>
            <p className="text-sm text-text-secondary">
              Đi dạo, đọc sách, hoặc gọi cho người yêu. Cơ thể cần phục hồi.
            </p>
          </div>
        )}
      </div>

      {today ? (
        <Button onClick={scrollToGoal} size="lg" className="w-full">
          Bắt đầu phiên tập ngay
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <Button variant="outline" disabled className="w-full">
          <Leaf className="w-4 h-4 mr-2" />
          Hẹn ngày mai
        </Button>
      )}
    </motion.div>
  );
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary/60 text-text-primary text-xs font-medium">
      {icon}
      {children}
    </span>
  );
}
