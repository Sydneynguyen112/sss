"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Mail } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(
    errorCode === "expired" ? "Link đã hết hạn — gửi lại nhé." :
    errorCode === "forbidden" ? "Email không có quyền admin." :
    errorCode === "invalid" ? "Link không hợp lệ." :
    null
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error((await res.json())?.error ?? "Gửi thất bại");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Có lỗi xảy ra");
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

        {status === "sent" ? (
          <div className="space-y-3 py-4">
            <div className="grid place-items-center w-12 h-12 rounded-full bg-success/15 text-success">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold">Đã gửi email</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Nếu email <strong>{email}</strong> có quyền admin, một link đăng nhập đã được gửi tới hộp thư.
              Link sẽ hết hạn sau <strong>10 phút</strong>.
            </p>
            <p className="text-xs text-text-muted">
              Kiểm tra cả thư mục Spam / Promotions nếu không thấy.
            </p>
            <Button variant="outline" onClick={() => setStatus("idle")} className="w-full mt-2">
              Gửi lại
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email admin</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vd@gmail.com"
                autoFocus
                required
                disabled={status === "sending"}
              />
            </div>
            {errorMsg && (
              <p className="text-sm text-danger">{errorMsg}</p>
            )}
            <Button type="submit" disabled={status === "sending" || !email} className="w-full">
              {status === "sending" ? "Đang gửi..." : "Gửi link đăng nhập"}
            </Button>
            <p className="text-xs text-text-muted leading-relaxed">
              Nhập email → nhận link → bấm vào để đăng nhập. Không cần mật khẩu.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
