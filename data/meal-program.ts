// Thực đơn xoay vòng 30 ngày — balanced cho athlete tập tennis 30-60p/ngày.
// Admin có thể override từng ngày trong /admin/meals (key "0"..."29").
// Mapping date → idx: floor(date.getTime() / 86_400_000) % 30 — ổn định, rolling.

import type { MealEntry, MealSlotKey } from "@/types/customizations";

export const PROGRAM_LENGTH = 30;
export type DayMenu = Record<MealSlotKey, MealEntry>;

export function rotationIdxForDate(d: Date): number {
  const days = Math.floor(d.getTime() / 86_400_000);
  return ((days % PROGRAM_LENGTH) + PROGRAM_LENGTH) % PROGRAM_LENGTH;
}

export const DAY_INDICES: number[] = Array.from({ length: PROGRAM_LENGTH }, (_, i) => i);

// Helper để rút gọn khai báo — 30 ngày là nhiều
const M = (
  name: string,
  kcal: number,
  protein: number,
  ingredients: { name: string; amount: string }[] = [],
  note?: string,
): MealEntry => ({ name, kcal, protein, ingredients, note });

const PROGRAM: Record<number, DayMenu> = {
  0: {
    breakfast: M("Phở bò viên + cà phê đen", 580, 38, [
      { name: "Bánh phở", amount: "150g" }, { name: "Bò viên", amount: "120g" },
    ]),
    snack: M("Chuối + sữa chua Hy Lạp", 220, 12, [
      { name: "Chuối", amount: "1 quả" }, { name: "Sữa chua Hy Lạp", amount: "150g" },
    ]),
    lunch: M("Cơm gà nướng + canh bí đỏ", 720, 48, [
      { name: "Ức gà", amount: "180g" }, { name: "Cơm", amount: "200g" }, { name: "Bí đỏ", amount: "150g" },
    ]),
    dinner: M("Cá hồi áp chảo + salad", 540, 42, [
      { name: "Cá hồi", amount: "150g" }, { name: "Salad mix", amount: "100g" },
    ]),
  },
  1: {
    breakfast: M("Bánh mì ốp la + sữa đậu nành", 520, 28, [
      { name: "Bánh mì", amount: "1 ổ" }, { name: "Trứng", amount: "2 quả" }, { name: "Sữa đậu nành", amount: "250ml" },
    ]),
    snack: M("Hạt mix + táo", 250, 8, [
      { name: "Hạt điều, óc chó", amount: "30g" }, { name: "Táo", amount: "1 quả" },
    ]),
    lunch: M("Bún bò Huế", 680, 40, [
      { name: "Bún", amount: "180g" }, { name: "Bắp bò", amount: "150g" }, { name: "Chả Huế", amount: "50g" },
    ]),
    dinner: M("Ức gà luộc + rau luộc + cơm", 560, 50, [
      { name: "Ức gà", amount: "200g" }, { name: "Rau cải", amount: "150g" }, { name: "Cơm", amount: "150g" },
    ]),
  },
  2: {
    breakfast: M("Yến mạch + chuối + mật ong", 480, 18, [
      { name: "Yến mạch", amount: "60g" }, { name: "Sữa tươi", amount: "200ml" }, { name: "Chuối", amount: "1 quả" },
    ]),
    snack: M("Trứng luộc + dưa leo", 180, 14, [
      { name: "Trứng", amount: "2 quả" }, { name: "Dưa leo", amount: "100g" },
    ]),
    lunch: M("Cơm tấm sườn bì", 750, 42, [
      { name: "Cơm tấm", amount: "200g" }, { name: "Sườn nướng", amount: "150g" }, { name: "Bì + chả", amount: "60g" },
    ]),
    dinner: M("Tôm hấp + canh chua", 480, 38, [
      { name: "Tôm", amount: "150g" }, { name: "Canh chua cá", amount: "1 bát" },
    ]),
  },
  3: {
    breakfast: M("Bún riêu cua", 560, 32, [
      { name: "Bún", amount: "150g" }, { name: "Riêu cua + đậu hũ", amount: "120g" },
    ]),
    snack: M("Sinh tố bơ + whey", 300, 28, [
      { name: "Bơ", amount: "1/2 quả" }, { name: "Whey protein", amount: "30g" }, { name: "Sữa tươi", amount: "200ml" },
    ]),
    lunch: M("Cơm cá kho tộ + rau muống", 700, 44, [
      { name: "Cá kho", amount: "180g" }, { name: "Rau muống xào", amount: "150g" }, { name: "Cơm", amount: "200g" },
    ]),
    dinner: M("Salad ức gà + khoai lang", 520, 46, [
      { name: "Ức gà", amount: "180g" }, { name: "Khoai lang", amount: "150g" },
    ]),
  },
  4: {
    breakfast: M("Xôi gà + sữa tươi", 600, 34, [
      { name: "Xôi", amount: "200g" }, { name: "Gà xé", amount: "100g" },
    ]),
    snack: M("Sữa chua + granola", 240, 14, [
      { name: "Sữa chua", amount: "150g" }, { name: "Granola", amount: "40g" },
    ]),
    lunch: M("Phở gà + chả lụa", 680, 46, [
      { name: "Bánh phở", amount: "180g" }, { name: "Gà xé", amount: "120g" }, { name: "Chả lụa", amount: "50g" },
    ]),
    dinner: M("Bò bít tết + khoai tây nướng", 620, 50, [
      { name: "Thăn bò", amount: "180g" }, { name: "Khoai tây", amount: "200g" },
    ]),
  },
  5: {
    breakfast: M("Bánh cuốn + chả lụa", 540, 26, [
      { name: "Bánh cuốn", amount: "200g" }, { name: "Chả lụa", amount: "80g" },
    ]),
    snack: M("Bánh quy yến mạch + trà sữa ít đường", 280, 8, [
      { name: "Bánh quy yến mạch", amount: "2 cái" }, { name: "Trà sữa ít đường", amount: "300ml" },
    ]),
    lunch: M("Lẩu thái hải sản", 720, 48, [
      { name: "Tôm, mực, cá", amount: "300g" }, { name: "Bún", amount: "150g" }, { name: "Rau nhúng", amount: "200g" },
    ]),
    dinner: M("Pizza ức gà + salad", 680, 40, [
      { name: "Pizza ức gà", amount: "2 miếng" }, { name: "Salad mix", amount: "120g" },
    ]),
  },
  6: {
    breakfast: M("Cháo gà + trứng bắc thảo", 480, 28, [
      { name: "Cháo", amount: "1 bát" }, { name: "Gà xé", amount: "100g" }, { name: "Trứng bắc thảo", amount: "1 quả" },
    ]),
    snack: M("Nước ép cam + hạnh nhân", 220, 8, [
      { name: "Nước cam", amount: "250ml" }, { name: "Hạnh nhân", amount: "25g" },
    ]),
    lunch: M("Cơm cuộn rong biển + súp miso", 620, 36, [
      { name: "Cơm cuộn", amount: "8 miếng" }, { name: "Súp miso", amount: "1 bát" },
    ]),
    dinner: M("Canh hầm sườn + cơm gạo lứt", 540, 42, [
      { name: "Sườn non", amount: "180g" }, { name: "Cơm gạo lứt", amount: "150g" }, { name: "Rau củ", amount: "150g" },
    ]),
  },
  7: {
    breakfast: M("Hủ tiếu Nam Vang", 560, 34, [
      { name: "Hủ tiếu", amount: "150g" }, { name: "Tôm + thịt", amount: "120g" }, { name: "Gan + trứng cút", amount: "50g" },
    ]),
    snack: M("Sữa chua dâu + óc chó", 230, 12, [
      { name: "Sữa chua dâu", amount: "150g" }, { name: "Óc chó", amount: "20g" },
    ]),
    lunch: M("Mì xào hải sản", 700, 42, [
      { name: "Mì xào", amount: "180g" }, { name: "Tôm + mực", amount: "180g" }, { name: "Rau cải", amount: "100g" },
    ]),
    dinner: M("Gà nướng mật ong + rau hấp", 580, 48, [
      { name: "Đùi gà", amount: "200g" }, { name: "Bông cải xanh", amount: "150g" },
    ]),
  },
  8: {
    breakfast: M("Mì Quảng tôm thịt", 580, 36, [
      { name: "Mì Quảng", amount: "180g" }, { name: "Tôm + thịt heo", amount: "120g" },
    ]),
    snack: M("Chuối + bơ đậu phộng", 280, 12, [
      { name: "Chuối", amount: "1 quả" }, { name: "Bơ đậu phộng", amount: "2 muỗng" },
    ]),
    lunch: M("Cơm chiên dương châu", 720, 38, [
      { name: "Cơm chiên", amount: "250g" }, { name: "Tôm + xúc xích + trứng", amount: "150g" },
    ]),
    dinner: M("Cá basa kho tộ + canh rau", 520, 40, [
      { name: "Cá basa", amount: "180g" }, { name: "Cơm", amount: "150g" }, { name: "Canh rau ngót", amount: "1 bát" },
    ]),
  },
  9: {
    breakfast: M("Bánh canh giò heo", 590, 32, [
      { name: "Bánh canh", amount: "200g" }, { name: "Giò heo", amount: "120g" },
    ]),
    snack: M("Trứng cuộn rong biển + nước cam", 220, 16, [
      { name: "Trứng cuộn", amount: "2 quả" }, { name: "Nước cam", amount: "200ml" },
    ]),
    lunch: M("Bún chả Hà Nội", 700, 44, [
      { name: "Bún", amount: "150g" }, { name: "Thịt nướng", amount: "150g" }, { name: "Chả viên", amount: "80g" },
    ]),
    dinner: M("Cá ngừ áp chảo + cơm gạo lứt", 540, 46, [
      { name: "Cá ngừ", amount: "150g" }, { name: "Cơm gạo lứt", amount: "150g" }, { name: "Salad", amount: "80g" },
    ]),
  },
  10: {
    breakfast: M("Bánh xèo + rau sống", 560, 26, [
      { name: "Bánh xèo", amount: "1 cái lớn" }, { name: "Tôm thịt", amount: "100g" }, { name: "Rau sống", amount: "100g" },
    ]),
    snack: M("Sinh tố chuối + protein", 290, 26, [
      { name: "Chuối", amount: "1 quả" }, { name: "Whey", amount: "30g" }, { name: "Sữa hạnh nhân", amount: "200ml" },
    ]),
    lunch: M("Cơm thịt kho trứng + dưa cải", 720, 42, [
      { name: "Thịt kho", amount: "150g" }, { name: "Trứng", amount: "1 quả" }, { name: "Cơm", amount: "200g" },
    ]),
    dinner: M("Súp gà nấm + bánh mì nguyên cám", 480, 38, [
      { name: "Súp gà nấm", amount: "1 bát lớn" }, { name: "Bánh mì nguyên cám", amount: "2 lát" },
    ]),
  },
  11: {
    breakfast: M("Bún mọc", 540, 32, [
      { name: "Bún", amount: "150g" }, { name: "Mọc + chả", amount: "120g" },
    ]),
    snack: M("Quả việt quất + sữa chua", 200, 12, [
      { name: "Việt quất", amount: "100g" }, { name: "Sữa chua", amount: "150g" },
    ]),
    lunch: M("Cơm gà Hải Nam", 680, 46, [
      { name: "Gà luộc", amount: "180g" }, { name: "Cơm gừng", amount: "200g" },
    ]),
    dinner: M("Mực xào sa tế + rau cải", 500, 42, [
      { name: "Mực", amount: "180g" }, { name: "Rau cải", amount: "150g" },
    ]),
  },
  12: {
    breakfast: M("Trứng cuộn phô mai + bánh mì", 540, 32, [
      { name: "Trứng", amount: "3 quả" }, { name: "Phô mai", amount: "30g" }, { name: "Bánh mì", amount: "1 ổ" },
    ]),
    snack: M("Trái cây dầm sữa chua", 240, 10, [
      { name: "Xoài + thanh long", amount: "150g" }, { name: "Sữa chua", amount: "100g" },
    ]),
    lunch: M("Bún thịt nướng", 700, 42, [
      { name: "Bún", amount: "180g" }, { name: "Thịt nướng", amount: "150g" }, { name: "Chả giò", amount: "1 cuốn" },
    ]),
    dinner: M("Cá thu sốt cà + cơm + rau", 560, 44, [
      { name: "Cá thu", amount: "180g" }, { name: "Cơm", amount: "150g" }, { name: "Rau luộc", amount: "120g" },
    ]),
  },
  13: {
    breakfast: M("Bún cá thì là", 560, 36, [
      { name: "Bún", amount: "150g" }, { name: "Cá basa chiên", amount: "150g" },
    ]),
    snack: M("Khoai lang luộc + sữa", 250, 10, [
      { name: "Khoai lang", amount: "200g" }, { name: "Sữa tươi", amount: "200ml" },
    ]),
    lunch: M("Cơm gà xối mỡ", 760, 44, [
      { name: "Gà chiên", amount: "200g" }, { name: "Cơm", amount: "200g" },
    ]),
    dinner: M("Lẩu nấm chay nhẹ + đậu hũ", 460, 28, [
      { name: "Nấm các loại", amount: "200g" }, { name: "Đậu hũ", amount: "150g" }, { name: "Mì", amount: "100g" },
    ]),
  },
  14: {
    breakfast: M("Bánh bao thịt + sữa", 480, 22, [
      { name: "Bánh bao", amount: "2 cái" }, { name: "Sữa tươi", amount: "250ml" },
    ]),
    snack: M("Hạt chia pudding", 260, 14, [
      { name: "Hạt chia", amount: "30g" }, { name: "Sữa hạnh nhân", amount: "250ml" }, { name: "Mật ong", amount: "1 muỗng" },
    ]),
    lunch: M("Bún bò Nam Bộ", 660, 40, [
      { name: "Bún", amount: "150g" }, { name: "Thịt bò xào", amount: "150g" }, { name: "Đậu phộng", amount: "20g" },
    ]),
    dinner: M("Tôm rang me + cơm gạo lứt", 540, 40, [
      { name: "Tôm", amount: "180g" }, { name: "Cơm gạo lứt", amount: "150g" },
    ]),
  },
  15: {
    breakfast: M("Phở bò tái nạm", 600, 42, [
      { name: "Bánh phở", amount: "180g" }, { name: "Bò tái + nạm", amount: "150g" },
    ]),
    snack: M("Sữa đậu nành + bánh flan", 240, 10, [
      { name: "Sữa đậu nành", amount: "250ml" }, { name: "Bánh flan", amount: "1 cái" },
    ]),
    lunch: M("Cơm bò lúc lắc + salad", 740, 50, [
      { name: "Bò lúc lắc", amount: "180g" }, { name: "Cơm", amount: "200g" }, { name: "Salad cà chua", amount: "80g" },
    ]),
    dinner: M("Cá hồi nướng giấy bạc + măng tây", 540, 44, [
      { name: "Cá hồi", amount: "150g" }, { name: "Măng tây", amount: "120g" },
    ]),
  },
  16: {
    breakfast: M("Bánh giò + nước mía", 460, 16, [
      { name: "Bánh giò", amount: "1 cái" }, { name: "Nước mía", amount: "300ml" },
    ]),
    snack: M("Trứng luộc + nho", 200, 14, [
      { name: "Trứng", amount: "2 quả" }, { name: "Nho", amount: "100g" },
    ]),
    lunch: M("Mì hoành thánh tôm", 620, 38, [
      { name: "Mì", amount: "150g" }, { name: "Hoành thánh tôm", amount: "8 viên" },
    ]),
    dinner: M("Gà kho gừng + cơm + rau", 560, 44, [
      { name: "Gà kho", amount: "180g" }, { name: "Cơm", amount: "150g" }, { name: "Rau ngót luộc", amount: "120g" },
    ]),
  },
  17: {
    breakfast: M("Bún suông", 540, 30, [
      { name: "Bún", amount: "150g" }, { name: "Tôm + thịt suông", amount: "120g" },
    ]),
    snack: M("Bánh chuối yến mạch tự làm", 270, 10, [
      { name: "Chuối + yến mạch nướng", amount: "1 phần" },
    ]),
    lunch: M("Cơm cá ngừ kho thơm", 680, 42, [
      { name: "Cá ngừ", amount: "150g" }, { name: "Thơm (dứa)", amount: "80g" }, { name: "Cơm", amount: "200g" },
    ]),
    dinner: M("Bò xào ớt chuông + cơm gạo lứt", 580, 46, [
      { name: "Thịt bò", amount: "150g" }, { name: "Ớt chuông", amount: "100g" }, { name: "Cơm gạo lứt", amount: "150g" },
    ]),
  },
  18: {
    breakfast: M("Bánh mì pate trứng + sữa", 540, 26, [
      { name: "Bánh mì", amount: "1 ổ" }, { name: "Pate + trứng", amount: "100g" }, { name: "Sữa tươi", amount: "200ml" },
    ]),
    snack: M("Trái cây tươi mix", 200, 6, [
      { name: "Dưa hấu + dứa", amount: "200g" },
    ]),
    lunch: M("Cơm sườn ram mặn", 720, 40, [
      { name: "Sườn ram", amount: "180g" }, { name: "Cơm", amount: "200g" }, { name: "Canh", amount: "1 bát" },
    ]),
    dinner: M("Ức gà nướng tiêu + rau củ", 520, 50, [
      { name: "Ức gà", amount: "200g" }, { name: "Rau củ nướng", amount: "150g" },
    ]),
  },
  19: {
    breakfast: M("Mì gói trứng + cải ngọt", 460, 22, [
      { name: "Mì gói", amount: "1 gói" }, { name: "Trứng", amount: "2 quả" }, { name: "Cải ngọt", amount: "80g" },
    ]),
    snack: M("Sữa chua + chuối lạnh", 230, 12, [
      { name: "Sữa chua", amount: "150g" }, { name: "Chuối lạnh", amount: "1 quả" },
    ]),
    lunch: M("Bánh canh cua", 660, 38, [
      { name: "Bánh canh", amount: "180g" }, { name: "Thịt cua", amount: "120g" }, { name: "Tôm", amount: "60g" },
    ]),
    dinner: M("Cá rô phi chiên + canh khổ qua", 540, 42, [
      { name: "Cá rô phi", amount: "180g" }, { name: "Khổ qua nhồi thịt", amount: "1 bát" }, { name: "Cơm", amount: "150g" },
    ]),
  },
  20: {
    breakfast: M("Cháo lòng + giò chéo quẩy", 540, 32, [
      { name: "Cháo lòng", amount: "1 bát" }, { name: "Giò chéo quẩy", amount: "2 cái" },
    ]),
    snack: M("Nước dừa + bánh đậu xanh", 220, 6, [
      { name: "Nước dừa", amount: "300ml" }, { name: "Bánh đậu xanh", amount: "30g" },
    ]),
    lunch: M("Cơm gà rang gừng", 700, 44, [
      { name: "Gà rang", amount: "180g" }, { name: "Cơm", amount: "200g" }, { name: "Canh rau", amount: "1 bát" },
    ]),
    dinner: M("Tôm hùm đất rang + bún", 560, 40, [
      { name: "Tôm hùm đất", amount: "200g" }, { name: "Bún", amount: "120g" },
    ]),
  },
  21: {
    breakfast: M("Bánh ướt thịt nướng", 520, 28, [
      { name: "Bánh ướt", amount: "200g" }, { name: "Thịt nướng", amount: "100g" },
    ]),
    snack: M("Sinh tố dâu + hạt chia", 250, 14, [
      { name: "Dâu tây", amount: "100g" }, { name: "Sữa", amount: "200ml" }, { name: "Hạt chia", amount: "15g" },
    ]),
    lunch: M("Cơm gà teriyaki", 720, 46, [
      { name: "Gà teriyaki", amount: "180g" }, { name: "Cơm", amount: "200g" }, { name: "Cà rốt + súp lơ", amount: "100g" },
    ]),
    dinner: M("Salad cá ngừ + bánh mì", 480, 38, [
      { name: "Cá ngừ", amount: "120g" }, { name: "Rau xanh", amount: "150g" }, { name: "Bánh mì", amount: "1 ổ nhỏ" },
    ]),
  },
  22: {
    breakfast: M("Phở chay", 460, 18, [
      { name: "Bánh phở", amount: "150g" }, { name: "Nấm + đậu hũ", amount: "150g" },
    ]),
    snack: M("Ức gà luộc + táo", 280, 30, [
      { name: "Ức gà", amount: "100g" }, { name: "Táo", amount: "1 quả" },
    ]),
    lunch: M("Cơm bò xào lúc lắc", 740, 50, [
      { name: "Thịt bò", amount: "180g" }, { name: "Cơm", amount: "200g" }, { name: "Khoai tây chiên", amount: "80g" },
    ]),
    dinner: M("Cá kèo nướng muối ớt + cơm", 540, 42, [
      { name: "Cá kèo", amount: "150g" }, { name: "Cơm", amount: "150g" }, { name: "Rau sống", amount: "80g" },
    ]),
  },
  23: {
    breakfast: M("Bánh mì xíu mại", 520, 26, [
      { name: "Bánh mì", amount: "1 ổ" }, { name: "Xíu mại", amount: "120g" },
    ]),
    snack: M("Yogurt + hạt dẻ", 240, 12, [
      { name: "Sữa chua không đường", amount: "150g" }, { name: "Hạt dẻ", amount: "25g" },
    ]),
    lunch: M("Bún cá Nha Trang", 660, 40, [
      { name: "Bún", amount: "180g" }, { name: "Chả cá + cá", amount: "150g" },
    ]),
    dinner: M("Gà nướng lá chanh + cơm gạo lứt", 580, 48, [
      { name: "Đùi gà", amount: "180g" }, { name: "Cơm gạo lứt", amount: "150g" },
    ]),
  },
  24: {
    breakfast: M("Cháo cá lóc", 480, 30, [
      { name: "Cháo", amount: "1 bát lớn" }, { name: "Cá lóc", amount: "120g" },
    ]),
    snack: M("Bánh chocolate + sữa hạnh nhân", 280, 8, [
      { name: "Bánh chocolate đen", amount: "30g" }, { name: "Sữa hạnh nhân", amount: "250ml" },
    ]),
    lunch: M("Cơm tấm bì chả", 740, 40, [
      { name: "Cơm tấm", amount: "200g" }, { name: "Bì + chả + trứng", amount: "150g" },
    ]),
    dinner: M("Lẩu gà lá é + bún", 560, 44, [
      { name: "Thịt gà", amount: "200g" }, { name: "Lá é + bún", amount: "200g" },
    ]),
  },
  25: {
    breakfast: M("Bún mắm", 560, 36, [
      { name: "Bún", amount: "180g" }, { name: "Tôm + thịt heo + cá", amount: "150g" },
    ]),
    snack: M("Smoothie xoài + protein", 280, 26, [
      { name: "Xoài", amount: "100g" }, { name: "Whey", amount: "25g" }, { name: "Sữa", amount: "200ml" },
    ]),
    lunch: M("Cơm sườn chua ngọt", 720, 42, [
      { name: "Sườn chua ngọt", amount: "180g" }, { name: "Cơm", amount: "200g" },
    ]),
    dinner: M("Cá hồi sốt teriyaki + bông cải", 560, 44, [
      { name: "Cá hồi", amount: "160g" }, { name: "Bông cải xanh", amount: "150g" },
    ]),
  },
  26: {
    breakfast: M("Bánh khọt + nước mắm chua ngọt", 480, 24, [
      { name: "Bánh khọt", amount: "6 cái" }, { name: "Tôm + rau sống", amount: "100g" },
    ]),
    snack: M("Sữa tươi + bánh quy bơ", 260, 10, [
      { name: "Sữa tươi", amount: "250ml" }, { name: "Bánh quy bơ", amount: "3 cái" },
    ]),
    lunch: M("Cơm xào hải sản chua ngọt", 700, 40, [
      { name: "Tôm + mực + thịt", amount: "180g" }, { name: "Cơm", amount: "200g" },
    ]),
    dinner: M("Bò áp chảo + khoai lang nướng", 600, 48, [
      { name: "Bò", amount: "180g" }, { name: "Khoai lang", amount: "180g" },
    ]),
  },
  27: {
    breakfast: M("Bánh canh chả cá", 540, 32, [
      { name: "Bánh canh", amount: "180g" }, { name: "Chả cá", amount: "120g" },
    ]),
    snack: M("Đậu phộng rang + sữa đậu nành", 250, 14, [
      { name: "Đậu phộng rang", amount: "30g" }, { name: "Sữa đậu nành", amount: "250ml" },
    ]),
    lunch: M("Cơm cá hồi sốt cam", 720, 46, [
      { name: "Cá hồi", amount: "160g" }, { name: "Cơm", amount: "180g" }, { name: "Rau cải", amount: "100g" },
    ]),
    dinner: M("Đậu hũ Nhật + cơm + canh miso", 460, 28, [
      { name: "Đậu hũ", amount: "200g" }, { name: "Cơm", amount: "150g" }, { name: "Canh miso", amount: "1 bát" },
    ]),
  },
  28: {
    breakfast: M("Bún ốc", 520, 32, [
      { name: "Bún", amount: "150g" }, { name: "Ốc + giò", amount: "150g" },
    ]),
    snack: M("Cherry + hạnh nhân", 220, 8, [
      { name: "Cherry", amount: "100g" }, { name: "Hạnh nhân", amount: "20g" },
    ]),
    lunch: M("Phở áp chảo bò", 720, 44, [
      { name: "Phở áp chảo", amount: "200g" }, { name: "Bò xào", amount: "150g" },
    ]),
    dinner: M("Gà hấp xôi mè + rau cải", 580, 46, [
      { name: "Gà", amount: "180g" }, { name: "Xôi mè", amount: "120g" }, { name: "Rau cải", amount: "100g" },
    ]),
  },
  29: {
    breakfast: M("Bánh cuốn nhân tôm thịt", 560, 30, [
      { name: "Bánh cuốn", amount: "200g" }, { name: "Tôm thịt", amount: "100g" }, { name: "Chả lụa", amount: "50g" },
    ]),
    snack: M("Salad trái cây + sữa chua", 220, 10, [
      { name: "Trái cây mix", amount: "150g" }, { name: "Sữa chua", amount: "100g" },
    ]),
    lunch: M("Cơm gà nướng sa tế", 740, 48, [
      { name: "Gà nướng sa tế", amount: "180g" }, { name: "Cơm", amount: "200g" }, { name: "Dưa leo", amount: "80g" },
    ]),
    dinner: M("Lẩu hải sản nhẹ cuối tháng", 580, 46, [
      { name: "Tôm + mực + cá", amount: "250g" }, { name: "Bún", amount: "120g" }, { name: "Rau nhúng", amount: "150g" },
    ]),
  },
};

export function getDefaultMenu(idx: number): DayMenu {
  return PROGRAM[idx % PROGRAM_LENGTH]!;
}
