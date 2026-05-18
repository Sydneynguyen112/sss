"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { STORAGE } from "@/lib/utils/storage-keys";
import { OnboardingMessages } from "./onboarding-messages";
import { UserLoginDialog } from "./user-login-dialog";

// Hide gate for these route prefixes (admin có flow đăng nhập riêng)
const EXCLUDED_PREFIXES = ["/admin"];

export function OnboardingGate() {
  const pathname = usePathname();
  const [authed, setAuthed] = useLocalStorage<boolean>(STORAGE.USER_LOGGED_IN, false);
  const [onboarded, setOnboarded] = useLocalStorage<boolean>(STORAGE.ONBOARDED, false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  if (EXCLUDED_PREFIXES.some((p) => pathname?.startsWith(p))) return null;
  if (authed) return null;

  if (!onboarded) {
    return <OnboardingMessages onComplete={() => setOnboarded(true)} />;
  }

  return <UserLoginDialog onSuccess={() => setAuthed(true)} />;
}
