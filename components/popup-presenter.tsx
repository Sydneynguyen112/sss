"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCustomizations } from "@/lib/hooks/use-customizations";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import type { PopupMessage } from "@/types/customizations";

const SEEN_KEY = "hanhtrinh.popups.seen";

function isActive(p: PopupMessage, today: string): boolean {
  if (p.activeFrom && today < p.activeFrom) return false;
  if (p.activeUntil && today > p.activeUntil) return false;
  return true;
}

export function PopupPresenter() {
  const pathname = usePathname();
  const inAdmin = pathname.startsWith("/admin");
  const custom = useCustomizations();
  const [seen, setSeen] = useLocalStorage<string[]>(SEEN_KEY, []);
  const [mounted, setMounted] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const candidate = useMemo<PopupMessage | null>(() => {
    if (!mounted || inAdmin) return null;
    const today = new Date().toISOString().slice(0, 10);
    const list = custom.popups.filter((p) => {
      if (!isActive(p, today)) return false;
      if (p.oncePerVisitor && seen.includes(p.id)) return false;
      return true;
    });
    return list[0] ?? null;
  }, [custom.popups, seen, mounted, inAdmin]);

  useEffect(() => {
    if (candidate && openId !== candidate.id) {
      const t = setTimeout(() => setOpenId(candidate.id), 800);
      return () => clearTimeout(t);
    }
  }, [candidate, openId]);

  if (!candidate || !mounted) return null;

  const close = () => {
    if (candidate.oncePerVisitor && !seen.includes(candidate.id)) {
      setSeen([candidate.id, ...seen].slice(0, 200));
    }
    setOpenId(null);
  };

  return (
    <Dialog open={openId === candidate.id} onOpenChange={(v) => !v && close()}>
      <DialogContent className="max-w-sm overflow-hidden border-0 bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground p-0 shadow-glow">
        <AnimatePresence>
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="p-8 text-center space-y-4"
          >
            {candidate.emoji && (
              <div className="text-5xl leading-none mx-auto">{candidate.emoji}</div>
            )}
            <h2 className="text-xl sm:text-2xl font-semibold leading-tight text-balance">
              {candidate.title}
            </h2>
            <p className="text-sm sm:text-base text-primary-foreground/90 font-light leading-relaxed whitespace-pre-wrap text-balance">
              {candidate.body}
            </p>
            <Button
              variant="secondary"
              onClick={close}
              className="mt-2 bg-white/15 hover:bg-white/25 text-primary-foreground border-0"
            >
              Cảm ơn em ♡
            </Button>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
