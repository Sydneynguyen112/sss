"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import type { Theme } from "@/types";

export function SettingsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { settings, setSettings } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cài đặt</DialogTitle>
          <DialogDescription>Điều chỉnh giao diện theo ý anh.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
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
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
