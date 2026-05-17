// Tennis beginner → tournament 15/07/2026. Mỗi ngày 30-60 phút, tập tại nhà.
// 8 tuần roadmap, phân theo ngày trong tuần.

export interface TennisDrill {
  name: string;
  minutes: number;
  description: string;
}

export interface TennisDay {
  date: string;          // YYYY-MM-DD
  weekIndex: number;     // 0-based
  weekFocus: string;
  totalMinutes: number;
  drills: TennisDrill[];
  note?: string;
}

export const TENNIS_PROGRAM_START = "2026-05-18";
export const TENNIS_PROGRAM_END = "2026-07-15";

const WEEK_THEMES = [
  { focus: "Tuần 1 · Grip + stance + shadow swing", desc: "Học cầm vợt continental/eastern, đứng đúng tư thế, đánh tay không 50 lần mỗi cú." },
  { focus: "Tuần 2 · Forehand cơ bản", desc: "Tập forehand qua tường, đánh bóng nhẹ 30 lần liên tục, follow-through đúng." },
  { focus: "Tuần 3 · Backhand 2 tay", desc: "Cú đánh ổn nhất cho người mới — tập 2 tay, xoay hông + vai." },
  { focus: "Tuần 4 · Footwork + di chuyển", desc: "Split-step, side-step, chéo bước. Chân nhanh = 70% tennis." },
  { focus: "Tuần 5 · Giao bóng (serve)", desc: "Tung bóng đúng vị trí, chuỗi động tác trơn tru. 60% vào ô là pass." },
  { focus: "Tuần 6 · Volley + return", desc: "Volley tay không, return giao bóng ngắn. Phản xạ + grip transition." },
  { focus: "Tuần 7 · Match patterns", desc: "Rally crosscourt 10 quả + down-the-line. Chiến thuật điểm." },
  { focus: "Tuần 8 · Tournament prep", desc: "Mock match, taper, mental rehearsal. Sẵn sàng giải 15/07." },
];

// Mỗi day-of-week (Mon=0..Sun=6) có "drill template" cho mỗi tuần.
function dayTemplate(weekIdx: number, dowIdx: number): { drills: TennisDrill[]; note?: string } {
  // Common warm-up 5 phút
  const warmup: TennisDrill = {
    name: "Khởi động",
    minutes: 5,
    description: "Xoay cổ tay, vai, hông. Chạy bước nhỏ 2 phút.",
  };
  const cooldown: TennisDrill = {
    name: "Giãn cơ + ghi chú",
    minutes: 5,
    description: "Giãn vai, tay, chân. Note 1 cảm nhận hôm nay vào sổ.",
  };

  // Theme-based drill — content thay đổi theo tuần để vẫn xoay vần focus
  const focusByDow: Record<number, { name: string; description: string; minutes: number }> = {
    0: { name: "Technique day — shadow swing", description: "Đứng trước gương, đánh tay không 60 lần forehand + 60 lần backhand. Quay video tự xem.", minutes: 25 },
    1: { name: "Footwork + agility", description: "Ladder drills, side-step, sprint 5m × 10. Nhịp tim lên 140+.", minutes: 25 },
    2: { name: "Visualization + xem video", description: "Xem 1 trận pro 15 phút (Federer/Sinner). Đóng mắt, mô phỏng mình đánh.", minutes: 20 },
    3: { name: "Serve practice", description: "Tung bóng + serve không bóng × 40. Chú ý vị trí tung bóng phía trên đầu trước mặt.", minutes: 25 },
    4: { name: "Wall practice — forehand", description: "Đứng cách tường 3m, đập bóng forehand đều 5 phút × 4 set. Mục tiêu 30 quả liên tục.", minutes: 30 },
    5: { name: "Full session combo", description: "Forehand 10p + Backhand 10p + Serve 10p + Mini-match (tự đếm điểm). Buổi nặng nhất tuần.", minutes: 45 },
    6: { name: "Light recovery + stretching", description: "Yoga 10 phút + foam roll. Hoặc đi bộ + suy ngẫm tuần qua.", minutes: 15 },
  };

  const focus = focusByDow[dowIdx] ?? focusByDow[0]!;

  // Tweak content theo tuần (thêm hint specific)
  const weekHints: Record<number, string> = {
    0: " (Tuần đầu: chậm, đúng tư thế quan trọng hơn nhanh.)",
    1: " (Tuần 2: forehand vẫn là focus chính.)",
    2: " (Tuần 3: thêm backhand vào mỗi lần đánh.)",
    3: " (Tuần 4: chú ý chân — bước trước khi đánh.)",
    4: " (Tuần 5: serve cần kiên nhẫn — 60% vào ô.)",
    5: " (Tuần 6: volley = phản xạ + nhẹ tay.)",
    6: " (Tuần 7: chiến thuật — đánh đâu cho thắng.)",
    7: " (Tuần 8: GIẢI ĐẤU — taper, tự tin.)",
  };

  const mainDrill: TennisDrill = {
    name: focus.name,
    minutes: focus.minutes,
    description: focus.description + (weekHints[weekIdx] ?? ""),
  };

  // Day-specific accessory
  const accessory: TennisDrill =
    dowIdx === 5
      ? { name: "Mini-match tự đếm", description: "Đánh vào tường + tự đếm điểm như đang thi đấu. 10 phút.", minutes: 10 }
      : dowIdx === 6
      ? { name: "Reflection journal", description: "Viết 3 dòng: tốt nhất tuần, cải thiện gì, cảm xúc.", minutes: 5 }
      : { name: "Grip strength", description: "Bóp bóng tennis 50 lần mỗi tay.", minutes: 5 };

  const drills = [warmup, mainDrill, accessory, cooldown];
  // Tuần 8 (week index 7): tăng intensity, thêm match prep
  if (weekIdx === 7) {
    drills.splice(2, 0, {
      name: "Match prep — mental rehearsal",
      minutes: 8,
      description: "Tưởng tượng từng trận, từng pha. Visualize chiến thắng cụ thể.",
    });
  }

  const note = dowIdx === 6 ? "Hôm nay là ngày nghỉ chủ động — đừng cố quá." : undefined;
  return { drills, note };
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function diffDays(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / 86_400_000);
}

export function generateProgram(): TennisDay[] {
  const start = new Date(TENNIS_PROGRAM_START + "T00:00:00");
  const end = new Date(TENNIS_PROGRAM_END + "T00:00:00");
  const totalDays = diffDays(end, start) + 1;
  const out: TennisDay[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = addDays(start, i);
    const weekIdx = Math.min(7, Math.floor(i / 7));
    // Map JS day (0=Sun) → Mon=0..Sun=6
    const dowIdx = (d.getDay() + 6) % 7;
    const { drills, note } = dayTemplate(weekIdx, dowIdx);
    const theme = WEEK_THEMES[weekIdx]!;
    const totalMinutes = drills.reduce((a, x) => a + x.minutes, 0);
    out.push({
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      weekIndex: weekIdx,
      weekFocus: theme.focus,
      totalMinutes,
      drills,
      note,
    });
  }
  return out;
}

export function getProgramDay(dateKey: string): TennisDay | null {
  const program = generateProgram();
  return program.find((d) => d.date === dateKey) ?? null;
}
