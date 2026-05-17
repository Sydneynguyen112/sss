"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { STORAGE } from "@/lib/utils/storage-keys";

export function GoalsHeader() {
  // Restart onboarding for "+ Start a new journey" — sets onboarded=false, dialog appears via OnboardingGate
  const [, setOnboarded] = useLocalStorage<boolean>(STORAGE.ONBOARDED, false);
  const [confirming, setConfirming] = useState(false);

  const handleAdd = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    setOnboarded(false);
  };

  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="label-eyebrow">Goals</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Morning Clarity</h1>
        <p className="text-text-secondary mt-1 max-w-xl">
          Theo dõi sự trưởng thành qua lăng kính bình yên.
        </p>
      </div>
      <div className="flex gap-2">
        <Link href="/roadmap" className={cn(buttonVariants({ variant: "outline" }))}>
          Mở Hành Trình
        </Link>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-1.5" />
          {confirming ? "Bấm lần nữa để mở lại setup" : "Hành trình mới"}
        </Button>
      </div>
    </header>
  );
}
