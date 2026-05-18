"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { STORAGE } from "@/lib/utils/storage-keys";
import { OnboardingMessages } from "./onboarding-messages";
import { UserLoginDialog } from "./user-login-dialog";

const EXCLUDED_PREFIXES = ["/admin"];

export function OnboardingGate() {
  const pathname = usePathname();
  const [authed, setAuthed] = useLocalStorage<boolean>(STORAGE.USER_LOGGED_IN, false);
  const [onboarded, setOnboarded] = useLocalStorage<boolean>(STORAGE.ONBOARDED, false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (EXCLUDED_PREFIXES.some((p) => pathname?.startsWith(p))) return;
    if (authed) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [mounted, authed, pathname]);

  if (!mounted) return null;
  if (EXCLUDED_PREFIXES.some((p) => pathname?.startsWith(p))) return null;
  if (authed) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-4 bg-background"
      style={{ backdropFilter: "blur(24px)" }}
    >
      {!onboarded ? (
        <OnboardingMessages onComplete={() => setOnboarded(true)} />
      ) : (
        <UserLoginDialog onSuccess={() => setAuthed(true)} />
      )}
    </div>
  );
}
