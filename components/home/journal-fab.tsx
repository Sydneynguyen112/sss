"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useJournal } from "@/lib/hooks/use-journal";

export function JournalFab() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const { addEntry } = useJournal();

  const save = () => {
    if (!text.trim()) {
      setOpen(false);
      return;
    }
    addEntry(text);
    setText("");
    setOpen(false);
  };

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 sm:px-5 py-3 rounded-full bg-primary text-primary-foreground shadow-glow shadow-primary/30 font-medium"
        aria-label="Viết nhật ký sáng"
      >
        <Pen className="w-5 h-5" strokeWidth={2} />
        <span className="hidden sm:inline">Nhật ký sáng</span>
      </motion.button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nhật ký sáng</DialogTitle>
            <DialogDescription>
              Viết tự do — đừng sửa, đừng đánh giá. Để cảm xúc trôi ra.
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Hôm nay em cảm thấy..."
            className="w-full min-h-40 rounded-lg border border-border bg-background p-3 text-base focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Để sau
            </Button>
            <Button onClick={save} disabled={!text.trim()}>
              Lưu nhật ký
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
