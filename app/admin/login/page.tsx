"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Đăng nhập thất bại");
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  };

  return (
    <div className="min-h-[80vh] grid place-items-center px-4">
      <div className="w-full max-w-md glass rounded-3xl p-8 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
            <Leaf className="w-5 h-5" strokeWidth={1.75} />
          </span>
          <div>
            <p className="label-eyebrow">Admin</p>
            <h1 className="text-xl font-semibold">Đăng nhập Hành Trình</h1>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vd@gmail.com"
              autoFocus
              required
              autoComplete="username"
              disabled={status === "submitting"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-pass">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="admin-pass"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                disabled={status === "submitting"}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-7 h-7 rounded-md text-text-muted hover:text-text-primary"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button
            type="submit"
            disabled={status === "submitting" || !email || !password}
            className="w-full"
          >
            {status === "submitting" ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          <p className="text-xs text-text-muted leading-relaxed">
            Chỉ email có trong allowlist <code className="bg-tertiary/40 px-1 rounded">ADMIN_EMAILS</code> + đúng <code className="bg-tertiary/40 px-1 rounded">ADMIN_PASSWORD</code> mới đăng nhập được.
          </p>
        </form>
      </div>
    </div>
  );
}
