"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { exportAllData } from "@/lib/utils/data-export";
import { Download, Trash2 } from "lucide-react";
import type { Theme } from "@/types";

export function SettingsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { settings, setSettings } = useTheme();
  const [localName, setLocalName] = useState(settings.userName);
  const [localPartner, setLocalPartner] = useState(settings.partnerName ?? "");

  const save = () => {
    setSettings((s) => ({ ...s, userName: localName.trim() || "anh yêu", partnerName: localPartner.trim() || undefined }));
    onOpenChange(false);
  };

  const clearAll = () => {
    if (typeof window === "undefined") return;
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cài đặt</DialogTitle>
          <DialogDescription>Điều chỉnh app theo phong cách của bạn.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <Section title="Tài khoản">
            <div className="space-y-2">
              <Label htmlFor="userName">Tên của bạn</Label>
              <Input id="userName" value={localName} onChange={(e) => setLocalName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partnerName">Tên người yêu (tuỳ chọn)</Label>
              <Input id="partnerName" value={localPartner} onChange={(e) => setLocalPartner(e.target.value)} />
            </div>
          </Section>

          <Section title="Giao diện">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tự động đổi sáng/tối</p>
                <p className="text-xs text-text-muted">6h sáng → 18h: sáng. 18h → 6h: tối.</p>
              </div>
              <Switch
                checked={settings.autoTheme}
                onCheckedChange={(v) => setSettings((s) => ({ ...s, autoTheme: v }))}
              />
            </div>
            {!settings.autoTheme && (
              <div className="flex gap-2">
                {(["light", "dark"] as Theme[]).map((t) => (
                  <Button
                    key={t}
                    variant={settings.manualTheme === t ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setSettings((s) => ({ ...s, manualTheme: t }))}
                  >
                    {t === "light" ? "Sáng" : "Tối"}
                  </Button>
                ))}
              </div>
            )}
          </Section>

          <Section title="Dữ liệu">
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={exportAllData} className="justify-start">
                <Download className="w-4 h-4 mr-2" />
                Tải về dữ liệu (JSON)
              </Button>
              <AlertDialog>
                <AlertDialogTrigger
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "justify-start text-danger hover:text-danger",
                  )}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xoá toàn bộ dữ liệu
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xoá toàn bộ dữ liệu?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Mọi mục tiêu, lịch trình, ảnh và nhật ký sẽ bị xoá vĩnh viễn. Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Huỷ</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAll} className="bg-danger hover:bg-danger/90">
                      Xoá tất cả
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button onClick={save}>Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="label-eyebrow">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
