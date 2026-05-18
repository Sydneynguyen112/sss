"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function UserLoginDialog({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json().catch(() => ({} as { error?: string }));
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={() => { /* undismissable */ }}>
      <DialogContent
        className="max-w-md p-0 overflow-hidden bg-transparent border-0 shadow-none"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Đăng nhập</DialogTitle>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          onSubmit={submit}
          className="glass rounded-3xl p-7 sm:p-9 shadow-soft space-y-5"
        >
          <div className="text-center space-y-2">
            <div className="inline-grid place-items-center w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold">Đăng nhập</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Muốn biết được tên đăng nhập và mật khẩu, thì lẹ lẹ nhắn cho em liềnn đi ♡
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-name">Tên đăng nhập</Label>
            <Input
              id="user-name"
              type="text"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Vd: Emiuanh"
              className="text-base"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-pw">Mật khẩu</Label>
            <Input
              id="user-pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="text-base"
              autoComplete="current-password"
            />
            {error && <p className="text-xs text-danger">{error}</p>}
          </div>

          <Button type="submit" disabled={busy || !username.trim() || !password.trim()} className="w-full">
            {busy ? "Đang kiểm tra..." : "Vào nhà em"}
          </Button>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
