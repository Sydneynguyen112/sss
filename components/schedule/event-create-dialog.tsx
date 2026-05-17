"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSchedule } from "@/lib/hooks/use-schedule";
import { addMinutesHHMM } from "@/lib/utils/date-helpers";
import type { EventType } from "@/types";

const TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: "self", label: "Cá nhân" },
  { value: "work", label: "Công việc" },
  { value: "meeting", label: "Họp" },
  { value: "goal", label: "Mục tiêu" },
  { value: "meal", label: "Bữa ăn" },
  { value: "rest", label: "Nghỉ ngơi" },
];

export function EventCreateDialog({
  open,
  onOpenChange,
  defaultDate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultDate: string;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState(60);
  const [type, setType] = useState<EventType>("self");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { addEvent } = useSchedule();

  const save = () => {
    if (!title.trim()) return setError("Cần nhập tiêu đề");
    if (!/^\d{2}:\d{2}$/.test(time)) return setError("Giờ không hợp lệ");
    addEvent({
      date,
      time,
      endTime: addMinutesHHMM(time, duration),
      title: title.trim(),
      type,
      description: description.trim() || undefined,
    });
    setTitle("");
    setDescription("");
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm sự kiện mới</DialogTitle>
          <DialogDescription>Đặt một mốc thời gian cho ngày của bạn.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label htmlFor="ev-title">Tiêu đề</Label>
            <Input id="ev-title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="ev-date">Ngày</Label>
              <Input id="ev-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ev-time">Giờ</Label>
              <Input id="ev-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="ev-duration">Thời lượng (phút)</Label>
              <Input id="ev-duration" type="number" min={5} step={5} value={duration} onChange={(e) => setDuration(Math.max(5, parseInt(e.target.value || "0", 10)))} />
            </div>
            <div className="space-y-1">
              <Label>Loại</Label>
              <Select value={type} onValueChange={(v) => setType(v as EventType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="ev-desc">Mô tả (tuỳ chọn)</Label>
            <textarea
              id="ev-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-16 rounded-md border border-border bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          {error && <p className="text-xs text-danger">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Huỷ</Button>
          <Button onClick={save}>Thêm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
