import type { MealOption } from "@/types";

// Profile target: nam · 1m70 · 60kg · tập luyện thường xuyên · tăng cân + giữ cơ.
// TDEE ~2400 kcal/ngày → mục tiêu surplus ~2700-2900 kcal/ngày.
// Bữa sáng: 600-750 kcal · 35-45g protein. Carb phức + protein nạc + chất béo lành.

export const NUTRITION_PROFILE = {
  label: "Nam · 1m70 · 60kg · tăng cân giữ cơ",
  dailyTarget: "≈ 2700 kcal · 130-145g protein",
  breakfastTarget: "≈ 650 kcal · 40g protein",
} as const;

export const MEALS: MealOption[] = [
  // BREAKFAST — 7 (lean-bulk · high protein · cảm hứng Việt + Á)
  {
    slot: "breakfast",
    name: "Yến mạch protein chuối bơ đậu phộng",
    kcal: 620, protein: 42, prepTime: 5,
    ingredients: [
      { name: "Yến mạch cán dẹt", amount: "70g", icon: "🌾" },
      { name: "Sữa tươi không đường", amount: "300ml", icon: "🥛" },
      { name: "Whey protein vani", amount: "30g", icon: "💪" },
      { name: "Chuối chín", amount: "1 quả lớn", icon: "🍌" },
      { name: "Bơ đậu phộng nguyên chất", amount: "2 muỗng", icon: "🥜" },
      { name: "Hạt chia", amount: "1 muỗng", icon: "🌱" },
    ],
    tip: "Ngâm yến mạch qua đêm với sữa, sáng cho whey + topping. Carb chậm + protein + chất béo lành — đúng công thức bulk sạch.",
  },
  {
    slot: "breakfast",
    name: "Cơm tấm trứng ốp la thịt nguội",
    kcal: 720, protein: 40, prepTime: 12,
    ingredients: [
      { name: "Cơm tấm", amount: "180g", icon: "🍚" },
      { name: "Trứng gà", amount: "3 quả", icon: "🥚" },
      { name: "Thịt nguội (ham gà/heo)", amount: "60g", icon: "🥓" },
      { name: "Bơ tươi (avocado)", amount: "1/2 quả", icon: "🥑" },
      { name: "Dưa leo, cà chua", amount: "1 đĩa nhỏ", icon: "🥒" },
      { name: "Nước tương", amount: "1 muỗng", icon: "🥢" },
    ],
    tip: "Trứng op la 2 lòng đào + 1 trứng cuộn = 21g protein riêng phần trứng. Bơ thay sốt giúp tăng kcal lành mạnh.",
  },
  {
    slot: "breakfast",
    name: "Phở bò viên + trứng chần",
    kcal: 680, protein: 45, prepTime: 20,
    ingredients: [
      { name: "Bánh phở", amount: "180g", icon: "🍜" },
      { name: "Thịt bò thăn thái mỏng", amount: "100g", icon: "🥩" },
      { name: "Bò viên gân", amount: "4 viên", icon: "🍖" },
      { name: "Trứng gà chần", amount: "1 quả", icon: "🥚" },
      { name: "Nước dùng bò", amount: "500ml", icon: "🥣" },
      { name: "Hành tây, rau thơm", amount: "1 nắm", icon: "🌿" },
    ],
    tip: "Thêm trứng chần là mẹo nhỏ cho thêm 6g protein mà không đổi vị. Order bát tô lớn nếu ăn ngoài.",
  },
  {
    slot: "breakfast",
    name: "Sinh tố tăng cân chuối oat",
    kcal: 640, protein: 45, prepTime: 4,
    ingredients: [
      { name: "Whey protein", amount: "40g", icon: "💪" },
      { name: "Yến mạch khô", amount: "50g", icon: "🌾" },
      { name: "Chuối đông lạnh", amount: "1 quả lớn", icon: "🍌" },
      { name: "Sữa tươi nguyên kem", amount: "400ml", icon: "🥛" },
      { name: "Bơ đậu phộng", amount: "2 muỗng", icon: "🥜" },
      { name: "Mật ong", amount: "1 muỗng", icon: "🍯" },
    ],
    tip: "Bữa sáng nhanh cho ngày bận. Xay 60s là xong. Hoàn hảo trước hoặc sau buổi tập sớm.",
  },
  {
    slot: "breakfast",
    name: "Bánh mì kẹp đầy đủ (chicken & avocado)",
    kcal: 690, protein: 42, prepTime: 10,
    ingredients: [
      { name: "Bánh mì baguette", amount: "1 ổ vừa", icon: "🥖" },
      { name: "Ức gà nướng/xé", amount: "120g", icon: "🍗" },
      { name: "Trứng ốp la", amount: "2 quả", icon: "🥚" },
      { name: "Bơ tươi", amount: "1/2 quả", icon: "🥑" },
      { name: "Phô mai cheddar", amount: "1 lát", icon: "🧀" },
      { name: "Rau xà lách, cà chua", amount: "1 nắm", icon: "🥬" },
    ],
    tip: "Bánh mì Sài Gòn cải tiến cho mục tiêu bulk: thêm ức gà luộc/nướng + bơ thay vì pate.",
  },
  {
    slot: "breakfast",
    name: "Cơm chiên trứng thịt bò + rau",
    kcal: 700, protein: 38, prepTime: 15,
    ingredients: [
      { name: "Cơm trắng nguội", amount: "200g", icon: "🍚" },
      { name: "Thịt bò băm", amount: "100g", icon: "🥩" },
      { name: "Trứng gà", amount: "2 quả", icon: "🥚" },
      { name: "Đậu Hà Lan + cà rốt", amount: "80g", icon: "🥕" },
      { name: "Hành lá, tỏi, dầu mè", amount: "vừa đủ", icon: "🧄" },
      { name: "Nước tương + tiêu", amount: "vừa đủ", icon: "🥢" },
    ],
    tip: "Cơm nguội qua đêm chiên giòn hơn. Lửa lớn + đảo nhanh — đây là quy tắc bất di bất dịch.",
  },
  {
    slot: "breakfast",
    name: "Sữa chua Hy Lạp granola + trứng luộc",
    kcal: 600, protein: 40, prepTime: 5,
    ingredients: [
      { name: "Sữa chua Hy Lạp", amount: "250g", icon: "🥛" },
      { name: "Granola hạt hỗn hợp", amount: "60g", icon: "🌰" },
      { name: "Berries / chuối", amount: "80g", icon: "🫐" },
      { name: "Trứng luộc lòng đào", amount: "2 quả", icon: "🥚" },
      { name: "Mật ong", amount: "1 muỗng", icon: "🍯" },
      { name: "Hạnh nhân thái lát", amount: "15g", icon: "🌰" },
    ],
    tip: "Sữa chua HY Lạp gấp 2 lần protein so với sữa chua thường. Cộng 2 trứng để đạt mốc 40g.",
  },

  // LUNCH — 7
  {
    slot: "lunch",
    name: "Bún bò Huế",
    kcal: 520, protein: 32, prepTime: 45,
    ingredients: [
      { name: "Bún tươi", amount: "200g", icon: "🍜" },
      { name: "Bắp bò", amount: "120g", icon: "🥩" },
      { name: "Giò heo", amount: "80g", icon: "🍖" },
      { name: "Sả, ớt, mắm ruốc", amount: "vừa đủ", icon: "🌶️" },
      { name: "Rau sống", amount: "1 đĩa", icon: "🥗" },
    ],
    tip: "Cay hơn phở — nhưng đó là điểm hấp dẫn. Đừng giảm ớt quá.",
  },
  {
    slot: "lunch",
    name: "Cơm gà nướng + salad",
    kcal: 580, protein: 38, prepTime: 30,
    ingredients: [
      { name: "Cơm trắng", amount: "150g", icon: "🍚" },
      { name: "Ức gà nướng", amount: "150g", icon: "🍗" },
      { name: "Xà lách trộn", amount: "100g", icon: "🥗" },
      { name: "Cà chua, dưa leo", amount: "100g", icon: "🥒" },
      { name: "Dầu olive", amount: "1 muỗng", icon: "🫒" },
    ],
    tip: "Ướp gà 30 phút trước nướng với tỏi, mật ong, xì dầu — thấm gấp đôi.",
  },
  {
    slot: "lunch",
    name: "Bún thịt nướng",
    kcal: 540, protein: 28, prepTime: 35,
    ingredients: [
      { name: "Bún tươi", amount: "200g", icon: "🍜" },
      { name: "Thịt heo nướng", amount: "120g", icon: "🥩" },
      { name: "Chả giò", amount: "2 cuốn", icon: "🌯" },
      { name: "Rau sống các loại", amount: "1 đĩa", icon: "🌿" },
      { name: "Nước mắm chua ngọt", amount: "50ml", icon: "🐟" },
    ],
    tip: "Sài Gòn nhớ thương — món này ăn lúc nào cũng được, nhưng ngon nhất giữa trưa hè.",
  },
  {
    slot: "lunch",
    name: "Salad cá hồi nướng",
    kcal: 450, protein: 36, prepTime: 25,
    ingredients: [
      { name: "Cá hồi", amount: "150g", icon: "🐟" },
      { name: "Rau xanh hỗn hợp", amount: "120g", icon: "🥬" },
      { name: "Hạt quinoa", amount: "60g", icon: "🌾" },
      { name: "Bơ", amount: "1/2 quả", icon: "🥑" },
      { name: "Sốt mù tạt mật ong", amount: "30ml", icon: "🍯" },
    ],
    tip: "Cá hồi nướng 8 phút mỗi mặt ở 180°C là vừa — đừng quá chín.",
  },
  {
    slot: "lunch",
    name: "Cơm tấm sườn nướng",
    kcal: 620, protein: 30, prepTime: 30,
    ingredients: [
      { name: "Cơm tấm", amount: "180g", icon: "🍚" },
      { name: "Sườn nướng", amount: "150g", icon: "🍖" },
      { name: "Bì heo", amount: "50g", icon: "🥓" },
      { name: "Chả trứng", amount: "50g", icon: "🥚" },
      { name: "Nước mắm + dưa chua", amount: "50ml", icon: "🥒" },
    ],
    tip: "Cơm tấm ăn vỉa hè ngon hơn — nhưng tự làm cũng được nếu siêng ướp sườn qua đêm.",
  },
  {
    slot: "lunch",
    name: "Mì Ý sốt cà chua tôm",
    kcal: 510, protein: 26, prepTime: 20,
    ingredients: [
      { name: "Mì Ý spaghetti", amount: "100g", icon: "🍝" },
      { name: "Tôm sú", amount: "150g", icon: "🦐" },
      { name: "Cà chua nghiền", amount: "200g", icon: "🍅" },
      { name: "Tỏi, hành tây", amount: "vừa đủ", icon: "🧄" },
      { name: "Lá basil", amount: "5-7 lá", icon: "🌿" },
    ],
    tip: "Đừng nấu mì quá mềm — al dente vẫn là chuẩn.",
  },
  {
    slot: "lunch",
    name: "Phở chay nấm",
    kcal: 380, protein: 18, prepTime: 30,
    ingredients: [
      { name: "Bánh phở", amount: "150g", icon: "🍜" },
      { name: "Đậu hũ chiên", amount: "100g", icon: "🟫" },
      { name: "Nấm hỗn hợp", amount: "100g", icon: "🍄" },
      { name: "Nước dùng rau củ", amount: "500ml", icon: "🥣" },
      { name: "Rau thơm", amount: "1 nắm", icon: "🌿" },
    ],
    tip: "Ăn chay 1 ngày/tuần — tốt cho cơ thể và môi trường.",
  },

  // SNACK — 7
  {
    slot: "snack",
    name: "Hạt hỗn hợp + táo",
    kcal: 220, protein: 6, prepTime: 1,
    ingredients: [
      { name: "Hạnh nhân", amount: "15g", icon: "🌰" },
      { name: "Hạt điều", amount: "10g", icon: "🥜" },
      { name: "Hạt óc chó", amount: "10g", icon: "🌰" },
      { name: "Táo", amount: "1 quả", icon: "🍎" },
    ],
    tip: "Hạt rang khô không muối — tốt nhất cho tim mạch.",
  },
  {
    slot: "snack",
    name: "Sữa chua mật ong",
    kcal: 180, protein: 10, prepTime: 1,
    ingredients: [
      { name: "Sữa chua Hy Lạp", amount: "150g", icon: "🥛" },
      { name: "Mật ong", amount: "1 muỗng", icon: "🍯" },
      { name: "Vanilla", amount: "1/4 muỗng", icon: "🌼" },
    ],
    tip: "Sữa chua tự làm ngon hơn — và bạn biết nó không có chất bảo quản.",
  },
  {
    slot: "snack",
    name: "Sinh tố bơ hạnh nhân",
    kcal: 260, protein: 8, prepTime: 5,
    ingredients: [
      { name: "Bơ", amount: "1/2 quả", icon: "🥑" },
      { name: "Sữa hạnh nhân", amount: "200ml", icon: "🥛" },
      { name: "Mật ong", amount: "1 muỗng", icon: "🍯" },
      { name: "Đá", amount: "vài viên", icon: "🧊" },
    ],
    tip: "Bơ Đắk Lắk vào tháng 5-7 ngon nhất, mua nhiều thì đông lạnh để dành.",
  },
  {
    slot: "snack",
    name: "Bánh quy yến mạch chuối",
    kcal: 200, protein: 5, prepTime: 15,
    ingredients: [
      { name: "Yến mạch", amount: "60g", icon: "🌾" },
      { name: "Chuối nghiền", amount: "1 quả", icon: "🍌" },
      { name: "Hạnh nhân thái nhỏ", amount: "20g", icon: "🌰" },
      { name: "Quế bột", amount: "1/4 muỗng", icon: "🟤" },
    ],
    tip: "Không đường, không bơ — vẫn ngọt nhờ chuối chín.",
  },
  {
    slot: "snack",
    name: "Trái cây tổng hợp",
    kcal: 160, protein: 3, prepTime: 5,
    ingredients: [
      { name: "Xoài", amount: "100g", icon: "🥭" },
      { name: "Dưa hấu", amount: "100g", icon: "🍉" },
      { name: "Thanh long", amount: "100g", icon: "🟪" },
      { name: "Bạc hà tươi", amount: "vài lá", icon: "🌿" },
    ],
    tip: "Mùa hè — không có gì làm mát hơn trái cây mát lạnh.",
  },
  {
    slot: "snack",
    name: "Trứng luộc + cà rốt baby",
    kcal: 180, protein: 14, prepTime: 10,
    ingredients: [
      { name: "Trứng gà", amount: "2 quả", icon: "🥚" },
      { name: "Cà rốt baby", amount: "80g", icon: "🥕" },
      { name: "Hummus", amount: "30g", icon: "🟡" },
      { name: "Muối hạt", amount: "ít", icon: "🧂" },
    ],
    tip: "Trứng luộc 7 phút là lòng đào hoàn hảo — protein tốt mà nhanh.",
  },
  {
    slot: "snack",
    name: "Trà sữa nhà làm",
    kcal: 220, protein: 7, prepTime: 8,
    ingredients: [
      { name: "Trà đen", amount: "1 túi", icon: "🍵" },
      { name: "Sữa tươi không đường", amount: "200ml", icon: "🥛" },
      { name: "Mật ong", amount: "1 muỗng", icon: "🍯" },
      { name: "Đá", amount: "vài viên", icon: "🧊" },
    ],
    tip: "Tự pha — ít đường hơn 3 lần so với trà sữa quán. Không trân châu cũng ngon.",
  },

  // DINNER — 7
  {
    slot: "dinner",
    name: "Cá hồi áp chảo + bông cải",
    kcal: 480, protein: 38, prepTime: 25,
    ingredients: [
      { name: "Cá hồi phi lê", amount: "180g", icon: "🐟" },
      { name: "Bông cải xanh", amount: "200g", icon: "🥦" },
      { name: "Khoai lang", amount: "150g", icon: "🍠" },
      { name: "Tỏi + chanh", amount: "vừa đủ", icon: "🧄" },
      { name: "Dầu olive", amount: "1 muỗng", icon: "🫒" },
    ],
    tip: "Áp chảo cá da xuống trước 5 phút, lật 3 phút — da giòn, thịt mọng.",
  },
  {
    slot: "dinner",
    name: "Ức gà nướng + khoai lang",
    kcal: 450, protein: 42, prepTime: 30,
    ingredients: [
      { name: "Ức gà", amount: "180g", icon: "🍗" },
      { name: "Khoai lang", amount: "200g", icon: "🍠" },
      { name: "Măng tây", amount: "100g", icon: "🌱" },
      { name: "Tỏi, gia vị", amount: "vừa đủ", icon: "🧄" },
    ],
    tip: "Meal prep lý tưởng — nấu Chủ Nhật, ăn cả tuần.",
  },
  {
    slot: "dinner",
    name: "Đậu hũ kho nấm",
    kcal: 320, protein: 22, prepTime: 25,
    ingredients: [
      { name: "Đậu hũ trắng", amount: "200g", icon: "🟫" },
      { name: "Nấm đông cô", amount: "100g", icon: "🍄" },
      { name: "Nước tương + đường", amount: "vừa đủ", icon: "🥢" },
      { name: "Hành lá, ớt", amount: "ít", icon: "🌶️" },
      { name: "Cơm trắng", amount: "150g", icon: "🍚" },
    ],
    tip: "Bữa chay nhẹ buổi tối — tốt cho tiêu hoá và giấc ngủ.",
  },
  {
    slot: "dinner",
    name: "Súp gà rau củ",
    kcal: 380, protein: 30, prepTime: 40,
    ingredients: [
      { name: "Thịt gà tươi", amount: "200g", icon: "🍗" },
      { name: "Cà rốt, khoai tây", amount: "200g", icon: "🥕" },
      { name: "Hành tây", amount: "1 củ", icon: "🧅" },
      { name: "Rau mùi", amount: "1 nắm", icon: "🌿" },
      { name: "Bánh mì baguette", amount: "1 ổ nhỏ", icon: "🥖" },
    ],
    tip: "Ngày se lạnh — không gì ấm áp hơn bát súp gà nhà nấu.",
  },
  {
    slot: "dinner",
    name: "Bò xào súp lơ + cơm gạo lứt",
    kcal: 540, protein: 34, prepTime: 20,
    ingredients: [
      { name: "Thịt bò thăn", amount: "150g", icon: "🥩" },
      { name: "Súp lơ xanh", amount: "200g", icon: "🥦" },
      { name: "Cơm gạo lứt", amount: "150g", icon: "🍚" },
      { name: "Tỏi, gừng, dầu hào", amount: "vừa đủ", icon: "🧄" },
    ],
    tip: "Gạo lứt no lâu hơn, đường huyết ổn định — ngủ ngon hơn.",
  },
  {
    slot: "dinner",
    name: "Mì xào hải sản",
    kcal: 510, protein: 28, prepTime: 20,
    ingredients: [
      { name: "Mì trứng", amount: "120g", icon: "🍜" },
      { name: "Tôm + mực", amount: "150g", icon: "🦑" },
      { name: "Rau cải, hành tây", amount: "150g", icon: "🥬" },
      { name: "Tỏi, dầu hào", amount: "vừa đủ", icon: "🧄" },
    ],
    tip: "Lửa to + đảo nhanh — bí kíp của tất cả món xào.",
  },
  {
    slot: "dinner",
    name: "Cháo gà nấm",
    kcal: 360, protein: 24, prepTime: 50,
    ingredients: [
      { name: "Gạo nếp + gạo tẻ", amount: "80g", icon: "🍚" },
      { name: "Ức gà xé", amount: "120g", icon: "🍗" },
      { name: "Nấm hương", amount: "50g", icon: "🍄" },
      { name: "Gừng, hành lá", amount: "vừa đủ", icon: "🫚" },
    ],
    tip: "Cháo ấm đêm khuya — phù hợp khi cơ thể cần phục hồi.",
  },
];

export function mealsForSlot(slot: "breakfast" | "lunch" | "snack" | "dinner"): MealOption[] {
  return MEALS.filter((m) => m.slot === slot);
}

export const MEAL_SLOT_TIMES = {
  breakfast: { start: "08:00", duration: 30 },
  lunch: { start: "12:00", duration: 45 },
  snack: { start: "15:30", duration: 20 },
  dinner: { start: "19:00", duration: 45 },
} as const;
