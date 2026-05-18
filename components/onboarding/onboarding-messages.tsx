"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomizations } from "@/lib/hooks/use-customizations";
import { cn } from "@/lib/utils";

const FALLBACK_TEXT =
  "Chào anh, em rất vui khi anh ghé thăm trang này. Ở đây em sẽ gửi anh vài điều nhỏ mỗi ngày ♡";

export function OnboardingMessages({ onComplete }: { onComplete: () => void }) {
  const custom = useCustomizations();
  const messages = useMemo(() => {
    const list = custom.onboarding?.messages ?? [];
    return list.length > 0 ? list : [{ id: "fallback", text: FALLBACK_TEXT }];
  }, [custom.onboarding]);

  const [idx, setIdx] = useState(0);
  const total = messages.length;
  const current = messages[idx]!;
  const isLast = idx === total - 1;

  const next = () => {
    if (isLast) onComplete();
    else setIdx((i) => i + 1);
  };

  return (
    <div className="glass rounded-3xl p-7 sm:p-9 shadow-soft w-full max-w-lg">
      <div className="flex items-center gap-1.5 mb-6">
        {messages.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i <= idx ? "bg-primary" : "bg-border",
            )}
          />
        ))}
      </div>

      <div className="min-h-[160px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-base sm:text-lg leading-relaxed text-text-primary whitespace-pre-line"
          >
            {current.text}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-8 pt-5 border-t border-border/40">
        <span className="text-xs text-text-muted tabular-nums">
          {idx + 1} / {total}
        </span>
        <Button onClick={next}>
          {isLast ? "Đăng nhập" : "Tiếp"}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
