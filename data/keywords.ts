export interface DailyKeyword {
  word: string;
  wordEn: string;
  tagline: string;
}

// 30 keywords: thúc đẩy · năng lượng · tiến hoá · trí tuệ con người
export const KEYWORDS: DailyKeyword[] = [
  { word: "An yên", wordEn: "Serenity", tagline: "Tĩnh tại bên trong, vững vàng bên ngoài." },
  { word: "Yêu thương", wordEn: "Love", tagline: "Bắt đầu một ngày bằng lòng biết ơn." },
  { word: "Tỉnh thức", wordEn: "Awakening", tagline: "Nhận ra mà không phán xét — tự do bắt đầu từ đó." },
  { word: "Khiêm hạ", wordEn: "Humility", tagline: "Lùi lại một bước để nhìn rõ hơn." },
  { word: "Kiến tạo", wordEn: "Create", tagline: "Hôm nay làm ra một thứ chưa từng có." },
  { word: "Tiến hoá", wordEn: "Evolve", tagline: "Em hôm nay chỉ cần giỏi hơn em hôm qua một chút." },
  { word: "Bứt phá", wordEn: "Breakthrough", tagline: "Vùng an toàn là nơi mơ ước đi ngủ." },
  { word: "Khai mở", wordEn: "Unfold", tagline: "Cho điều mới một cơ hội bước vào." },
  { word: "Vượt qua", wordEn: "Overcome", tagline: "Chướng ngại là con đường — đi xuyên qua." },
  { word: "Tự do", wordEn: "Freedom", tagline: "Buông những gì không còn phục vụ mình nữa." },
  { word: "Khát khao", wordEn: "Aspire", tagline: "Mơ lớn — rồi làm việc lớn cho ước mơ đó." },
  { word: "Nuôi dưỡng", wordEn: "Nurture", tagline: "Hạt giống nào được tưới sẽ lớn." },
  { word: "Kiên định", wordEn: "Steadfast", tagline: "Đi chậm. Đi đều. Đi tới." },
  { word: "Toả sáng", wordEn: "Shine", tagline: "Là chính mình — đó là ánh sáng đẹp nhất." },
  { word: "Vươn lên", wordEn: "Rise", tagline: "Mỗi sáng là một lần được sinh ra lần nữa." },
  { word: "Tận tâm", wordEn: "Devotion", tagline: "Làm một việc — làm cho ra việc." },
  { word: "Tự tin", wordEn: "Confidence", tagline: "Mình đã làm khó hơn thế. Mình làm được." },
  { word: "Thăng hoa", wordEn: "Transcend", tagline: "Vượt khỏi giới hạn cũ — phiên bản mới đang đợi." },
  { word: "Cảm hứng", wordEn: "Inspire", tagline: "Một điều nhỏ hôm nay đủ để tạo cảm hứng." },
  { word: "Mạnh mẽ", wordEn: "Strength", tagline: "Sức mạnh sinh ra từ chỗ ta tưởng đã hết." },
  { word: "Khám phá", wordEn: "Discover", tagline: "Hôm nay thử một thứ mình chưa từng làm." },
  { word: "Bền bỉ", wordEn: "Persistence", tagline: "Nước mềm thắng đá cứng — nhờ kiên nhẫn." },
  { word: "Sáng tạo", wordEn: "Creativity", tagline: "Một ý tưởng nhỏ có thể thay đổi cả ngày." },
  { word: "Thấu hiểu", wordEn: "Empathy", tagline: "Trước khi đáp, hãy nghe cho hết." },
  { word: "Lan toả", wordEn: "Radiate", tagline: "Năng lượng của em sẽ chạm đến người khác." },
  { word: "Bừng cháy", wordEn: "Ignite", tagline: "Khoảnh khắc bắt lửa — hãy đốt cho đáng." },
  { word: "Tự chủ", wordEn: "Mastery", tagline: "Làm chủ chính mình trước, mọi thứ khác theo sau." },
  { word: "Hành động", wordEn: "Action", tagline: "Suy nghĩ tốt nhất là một việc đã làm." },
  { word: "Thức tỉnh", wordEn: "Awaken", tagline: "Mỗi hơi thở là một lần trở về hiện tại." },
  { word: "Trỗi dậy", wordEn: "Rise Up", tagline: "Người chiến thắng là người ngã 7, đứng dậy 8." },
];

export function getKeywordForDate(date: Date): DailyKeyword {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (date.getTime() - start.getTime()) / 86_400_000,
  );
  return KEYWORDS[Math.abs(dayOfYear) % KEYWORDS.length]!;
}
