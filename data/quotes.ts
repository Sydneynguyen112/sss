import type { Quote } from "@/types";

export const QUOTES: Quote[] = [
  { text: "Mỗi sáng chúng ta lại được sinh ra một lần nữa. Những gì chúng ta làm hôm nay là điều quan trọng nhất.", author: "Phật Thích Ca" },
  { text: "Bình minh không vội, nhưng nó luôn đến đúng giờ.", author: "Lão Tử" },
  { text: "Hành trình ngàn dặm bắt đầu từ một bước chân.", author: "Lão Tử" },
  { text: "Sức mạnh không đến từ thắng cuộc. Đấu tranh là nơi sinh ra sức mạnh.", author: "Arnold Schwarzenegger" },
  { text: "Cách tốt nhất để dự đoán tương lai là tạo ra nó.", author: "Peter Drucker" },
  { text: "Đừng đếm số ngày, hãy làm cho từng ngày có giá trị.", author: "Muhammad Ali" },
  { text: "Người chiến thắng là người ngã 7 lần và đứng lên 8 lần.", author: "Tục ngữ Nhật" },
  { text: "Hôm nay là món quà. Đó là lý do nó được gọi là 'present'.", author: "Eleanor Roosevelt" },
  { text: "Đừng so sánh mình với ai khác. Em hôm nay chỉ cần giỏi hơn em hôm qua một chút.", author: "Hành trình" },
  { text: "Nước mềm thắng đá cứng, nhờ kiên nhẫn không ngừng.", author: "Lão Tử" },
  { text: "Cây đại thụ bắt đầu từ một hạt mầm nhỏ.", author: "Lão Tử" },
  { text: "Đừng đợi cơ hội — hãy tạo ra nó.", author: "George Bernard Shaw" },
  { text: "Đau khổ là chất liệu, nghệ thuật là cách bạn nhào nặn nó.", author: "Vô danh" },
  { text: "Sự bình an không phải là vắng bóng giông bão — mà là tâm tĩnh giữa giông bão.", author: "Vô danh" },
  { text: "Đường tới mơ ước được lát bằng những thói quen nhỏ mỗi ngày.", author: "James Clear" },
  { text: "Không có thất bại, chỉ có phản hồi.", author: "NLP" },
  { text: "Yêu thương bản thân là khởi đầu của một cuộc tình lãng mạn cả đời.", author: "Oscar Wilde" },
  { text: "Hơi thở vào, tôi biết tôi đang sống. Hơi thở ra, tôi mỉm cười.", author: "Thích Nhất Hạnh" },
  { text: "Tâm an, vạn sự an.", author: "Tục ngữ" },
  { text: "Một ngày mới — một cơ hội mới để trở thành phiên bản tốt hơn của chính mình.", author: "Hành trình" },
  { text: "Nỗi nhớ là cách trái tim nhắc rằng mình đang yêu.", author: "Vô danh" },
  { text: "Khoảng cách không xa khi hai trái tim cùng hướng về một nơi.", author: "Vô danh" },
  { text: "Chăm sóc cơ thể — đó là nơi duy nhất bạn phải sống.", author: "Jim Rohn" },
  { text: "Đọc một cuốn sách hay là trò chuyện với người thông minh đã viết nó.", author: "Descartes" },
  { text: "Không gì làm thay đổi thế giới bằng những con người kiên định.", author: "Margaret Mead" },
  { text: "Bạn không cần phải nhìn thấy cả cầu thang — chỉ cần bước bước đầu tiên.", author: "Martin Luther King Jr." },
  { text: "Hãy là người dịu dàng với chính mình. Bạn đang làm tốt hơn bạn nghĩ.", author: "Hành trình" },
  { text: "Im lặng cũng là một dạng âm nhạc — của tâm hồn.", author: "Vô danh" },
  { text: "Cảm ơn buổi sáng vì cơ hội thêm một ngày để yêu thương.", author: "Hành trình" },
  { text: "Đi chậm. Đi đều. Đi tới.", author: "Hành trình" },
];

export function getQuoteForDate(date: Date): Quote {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (date.getTime() - start.getTime()) / 86_400_000,
  );
  return QUOTES[Math.abs(dayOfYear) % QUOTES.length]!;
}

export const SUBTITLES = [
  "Hôm nay là một trang giấy trắng — viết gì cũng được.",
  "Hơi thở chậm lại, mọi thứ rõ ràng hơn.",
  "Mỗi việc nhỏ làm tốt là một bước tiến.",
  "Yêu chính mình trước, mọi thứ khác sẽ theo sau.",
  "Đừng vội — em đang đúng nơi mình cần đến.",
];

export function getSubtitleForDate(date: Date): string {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (date.getTime() - start.getTime()) / 86_400_000,
  );
  return SUBTITLES[Math.abs(dayOfYear) % SUBTITLES.length]!;
}
