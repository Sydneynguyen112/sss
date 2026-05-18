// 7-day rotating menu — balanced cho athlete tập tennis 30-60p/ngày
// dowIdx: 0=T2, 1=T3, 2=T4, 3=T5, 4=T6, 5=T7, 6=CN
// Admin có thể override từng slot từng ngày trong /admin/meals.

import type { MealEntry, MealSlotKey } from "@/types/customizations";

export type DowIdx = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type DayMenu = Record<MealSlotKey, MealEntry>;

const PROGRAM: Record<DowIdx, DayMenu> = {
  // T2 — khởi đầu tuần, nạp năng lượng
  0: {
    breakfast: {
      name: "Phở bò viên + cà phê đen",
      kcal: 580, protein: 38,
      ingredients: [
        { name: "Bánh phở", amount: "150g" },
        { name: "Bò viên", amount: "120g" },
        { name: "Hành lá, ngò", amount: "20g" },
      ],
    },
    snack: {
      name: "Chuối + sữa chua Hy Lạp",
      kcal: 220, protein: 12,
      ingredients: [
        { name: "Chuối", amount: "1 quả" },
        { name: "Sữa chua Hy Lạp", amount: "150g" },
      ],
    },
    lunch: {
      name: "Cơm gà nướng + canh bí đỏ",
      kcal: 720, protein: 48,
      ingredients: [
        { name: "Ức gà", amount: "180g" },
        { name: "Cơm trắng", amount: "200g" },
        { name: "Bí đỏ", amount: "150g" },
      ],
    },
    dinner: {
      name: "Cá hồi áp chảo + salad",
      kcal: 540, protein: 42,
      ingredients: [
        { name: "Cá hồi", amount: "150g" },
        { name: "Rau xà lách", amount: "100g" },
        { name: "Dầu olive", amount: "1 muỗng" },
      ],
    },
  },
  // T3
  1: {
    breakfast: {
      name: "Bánh mì ốp la + sữa đậu nành",
      kcal: 520, protein: 28,
      ingredients: [
        { name: "Bánh mì", amount: "1 ổ" },
        { name: "Trứng gà", amount: "2 quả" },
        { name: "Sữa đậu nành", amount: "250ml" },
      ],
    },
    snack: {
      name: "Hạt mix + táo",
      kcal: 250, protein: 8,
      ingredients: [
        { name: "Hạt điều, óc chó", amount: "30g" },
        { name: "Táo", amount: "1 quả" },
      ],
    },
    lunch: {
      name: "Bún bò Huế",
      kcal: 680, protein: 40,
      ingredients: [
        { name: "Bún", amount: "180g" },
        { name: "Bắp bò", amount: "150g" },
        { name: "Chả Huế", amount: "50g" },
      ],
    },
    dinner: {
      name: "Ức gà luộc + rau luộc + cơm",
      kcal: 560, protein: 50,
      ingredients: [
        { name: "Ức gà", amount: "200g" },
        { name: "Rau cải", amount: "150g" },
        { name: "Cơm", amount: "150g" },
      ],
    },
  },
  // T4
  2: {
    breakfast: {
      name: "Yến mạch + chuối + mật ong",
      kcal: 480, protein: 18,
      ingredients: [
        { name: "Yến mạch", amount: "60g" },
        { name: "Sữa tươi", amount: "200ml" },
        { name: "Chuối", amount: "1 quả" },
      ],
    },
    snack: {
      name: "Trứng luộc + dưa leo",
      kcal: 180, protein: 14,
      ingredients: [
        { name: "Trứng gà", amount: "2 quả" },
        { name: "Dưa leo", amount: "100g" },
      ],
    },
    lunch: {
      name: "Cơm tấm sườn bì",
      kcal: 750, protein: 42,
      ingredients: [
        { name: "Cơm tấm", amount: "200g" },
        { name: "Sườn nướng", amount: "150g" },
        { name: "Bì, chả", amount: "60g" },
      ],
    },
    dinner: {
      name: "Tôm hấp + canh chua",
      kcal: 480, protein: 38,
      ingredients: [
        { name: "Tôm", amount: "150g" },
        { name: "Canh chua cá", amount: "1 bát" },
      ],
    },
  },
  // T5
  3: {
    breakfast: {
      name: "Bún riêu cua",
      kcal: 560, protein: 32,
      ingredients: [
        { name: "Bún", amount: "150g" },
        { name: "Riêu cua + đậu hũ", amount: "120g" },
      ],
    },
    snack: {
      name: "Sinh tố bơ + whey",
      kcal: 300, protein: 28,
      ingredients: [
        { name: "Bơ", amount: "1/2 quả" },
        { name: "Whey protein", amount: "30g" },
        { name: "Sữa tươi", amount: "200ml" },
      ],
    },
    lunch: {
      name: "Cơm cá kho tộ + rau muống",
      kcal: 700, protein: 44,
      ingredients: [
        { name: "Cá kho", amount: "180g" },
        { name: "Rau muống xào", amount: "150g" },
        { name: "Cơm", amount: "200g" },
      ],
    },
    dinner: {
      name: "Salad ức gà + khoai lang",
      kcal: 520, protein: 46,
      ingredients: [
        { name: "Ức gà", amount: "180g" },
        { name: "Khoai lang", amount: "150g" },
        { name: "Salad mix", amount: "100g" },
      ],
    },
  },
  // T6
  4: {
    breakfast: {
      name: "Xôi gà + sữa tươi",
      kcal: 600, protein: 34,
      ingredients: [
        { name: "Xôi", amount: "200g" },
        { name: "Gà xé", amount: "100g" },
      ],
    },
    snack: {
      name: "Sữa chua + granola",
      kcal: 240, protein: 14,
      ingredients: [
        { name: "Sữa chua", amount: "150g" },
        { name: "Granola", amount: "40g" },
      ],
    },
    lunch: {
      name: "Phở gà + chả lụa",
      kcal: 680, protein: 46,
      ingredients: [
        { name: "Bánh phở", amount: "180g" },
        { name: "Gà xé", amount: "120g" },
        { name: "Chả lụa", amount: "50g" },
      ],
    },
    dinner: {
      name: "Bò bít tết + khoai tây nướng",
      kcal: 620, protein: 50,
      ingredients: [
        { name: "Thăn bò", amount: "180g" },
        { name: "Khoai tây", amount: "200g" },
        { name: "Bơ tỏi", amount: "20g" },
      ],
    },
  },
  // T7 — cuối tuần, free a bit
  5: {
    breakfast: {
      name: "Bánh cuốn + chả lụa",
      kcal: 540, protein: 26,
      ingredients: [
        { name: "Bánh cuốn", amount: "200g" },
        { name: "Chả lụa", amount: "80g" },
      ],
    },
    snack: {
      name: "Trà sữa ít đường + bánh quy yến mạch",
      kcal: 280, protein: 8,
      ingredients: [
        { name: "Trà sữa ít đường", amount: "300ml" },
        { name: "Bánh quy yến mạch", amount: "2 cái" },
      ],
    },
    lunch: {
      name: "Lẩu thái hải sản (chia sẻ)",
      kcal: 720, protein: 48,
      ingredients: [
        { name: "Tôm, mực, cá", amount: "300g" },
        { name: "Bún", amount: "150g" },
        { name: "Rau nhúng", amount: "200g" },
      ],
    },
    dinner: {
      name: "Pizza ức gà + salad",
      kcal: 680, protein: 40,
      ingredients: [
        { name: "Pizza ức gà", amount: "2 miếng" },
        { name: "Salad mix", amount: "120g" },
      ],
    },
  },
  // CN — recovery day, nhẹ và dễ tiêu
  6: {
    breakfast: {
      name: "Cháo gà + trứng bắc thảo",
      kcal: 480, protein: 28,
      ingredients: [
        { name: "Cháo", amount: "1 bát" },
        { name: "Gà xé", amount: "100g" },
        { name: "Trứng bắc thảo", amount: "1 quả" },
      ],
    },
    snack: {
      name: "Nước ép cam + hạnh nhân",
      kcal: 220, protein: 8,
      ingredients: [
        { name: "Nước cam", amount: "250ml" },
        { name: "Hạnh nhân", amount: "25g" },
      ],
    },
    lunch: {
      name: "Cơm cuộn rong biển + súp miso",
      kcal: 620, protein: 36,
      ingredients: [
        { name: "Cơm cuộn", amount: "8 miếng" },
        { name: "Súp miso", amount: "1 bát" },
      ],
    },
    dinner: {
      name: "Canh hầm sườn + cơm gạo lứt",
      kcal: 540, protein: 42,
      ingredients: [
        { name: "Sườn non", amount: "180g" },
        { name: "Cơm gạo lứt", amount: "150g" },
        { name: "Rau củ", amount: "150g" },
      ],
    },
  },
};

export function getDefaultMenu(dowIdx: DowIdx): DayMenu {
  return PROGRAM[dowIdx];
}

export const DOW_LABEL: Record<DowIdx, string> = {
  0: "Thứ Hai",
  1: "Thứ Ba",
  2: "Thứ Tư",
  3: "Thứ Năm",
  4: "Thứ Sáu",
  5: "Thứ Bảy",
  6: "Chủ Nhật",
};

export const DOW_INDICES: DowIdx[] = [0, 1, 2, 3, 4, 5, 6];
