"use client";

import { useEffect, useState } from "react";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { STORAGE } from "@/lib/utils/storage-keys";
import { OnboardingDialog } from "./onboarding-dialog";

export function OnboardingGate() {
  const [onboarded, setOnboarded] = useLocalStorage<boolean>(STORAGE.ONBOARDED, false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (onboarded) return null;

  return <OnboardingDialog onComplete={() => setOnboarded(true)} />;
}
