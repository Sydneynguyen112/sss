# Admin Setup — Hành Trình

Admin login = **email + password thuần**. Cấu hình env vars + Vercel KV là xong.

---

## 1. Cài Vercel KV (storage chia sẻ admin ↔ user)

KV cần thiết để **admin sửa nội dung ở máy mình → bạn trai mở app trên máy ảnh thấy được**. Không có KV thì mỗi máy lưu riêng, đồng bộ không xảy ra.

1. Vercel dashboard → project `sss` → tab **Storage**
2. **Create Database** → chọn **Upstash · Serverless DB - Redis** → **Continue**
3. Đặt tên `hanh-trinh-kv` · Region **Singapore (ap-southeast-1)** · Plan **Free** → **Create**
4. Sau khi tạo, Vercel mở trang database → tab **Projects** → **Connect Project** → chọn `sss` → tick cả 3 environments (Production, Preview, Development) → **Connect**

Vercel sẽ tự inject các env: `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

---

## 2. Thêm 3 env vars thủ công

Vercel dashboard → project → **Settings → Environment Variables** → **Add New**:

| Name | Value | Environments |
|---|---|---|
| `ADMIN_EMAILS` | `nguyennhunguyen112@gmail.com` (có thể nhiều, phẩy phân cách) | All |
| `ADMIN_PASSWORD` | mật khẩu tự đặt (≥8 ký tự, không cần ký tự đặc biệt) | All |
| `AUTH_SECRET` | chuỗi random ≥32 ký tự — xem cách tạo bên dưới | All |

**Tạo `AUTH_SECRET`** — chạy ở terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy chuỗi hex 64 ký tự → paste vào Value.

**Sensitive**: bật ON cho `ADMIN_PASSWORD` và `AUTH_SECRET`.

---

## 3. Redeploy

Vercel KHÔNG tự rebuild khi đổi env. Cần trigger:

- **Deployments** tab → bấm `...` ở deployment mới nhất → **Redeploy** → tick **Use existing Build Cache** → **Redeploy**.

Đợi ~1 phút.

---

## 4. Đăng nhập lần đầu

1. Mở `https://<your-app>/admin/login`
2. Nhập email (`nguyennhunguyen112@gmail.com`) + mật khẩu (giá trị `ADMIN_PASSWORD`)
3. Bấm **Đăng nhập**
4. Redirect tới `/admin` → thấy dashboard

Cookie JWT giữ login 30 ngày. Đăng xuất bằng nút trong sidebar admin.

---

## 5. Sử dụng (3 trang ở Stage 1)

### `/admin/keyword` — Từ khoá hôm nay
Bật override → nhập word (VN) + wordEn + tagline → Lưu. Bạn trai mở Home sẽ thấy từ khoá em đặt thay vì rotation mặc định.

### `/admin/greetings` — Lời chúc theo 4 khung giờ
- Sáng 5h-11h, Trưa 11h-17h, Chiều 17h-22h, Đêm 22h-5h
- Dùng `{name}` để chèn tên — vd `Chào sáng {name}, hôm nay rạng rỡ nhé.`
- Bỏ trống slot → slot đó dùng mặc định

### `/admin/popups` — Popup gửi anh
- Tạo lời nhắn / thông điệp bất ngờ
- Tuỳ chọn: emoji, ngày bắt đầu, ngày kết thúc, "chỉ hiện 1 lần"
- Bạn trai mở app → popup hiện sau 800ms (không hiện ở /admin)
- Xoá bằng nút thùng rác

---

## Troubleshooting

**Lỗi đỏ "KV chưa cấu hình" trên /admin** → Bước 1 chưa xong, hoặc connect KV chưa tick Production/Preview/Development đầy đủ. Cần redeploy lại.

**"Email hoặc mật khẩu không đúng"** → check 2 thứ:
1. Email gõ vào (case-insensitive, trim) có khớp với `ADMIN_EMAILS` env không
2. Mật khẩu gõ vào có khớp đúng `ADMIN_PASSWORD` không (case-sensitive)

**"Server chưa cấu hình ADMIN_PASSWORD"** → Bước 2 chưa làm, hoặc đã thêm nhưng chưa redeploy.

**Đăng nhập thành công nhưng vào /admin lại bounce về login** → `AUTH_SECRET` thay đổi giữa các deployment, cookie cũ không verify được. Đăng nhập lại sau khi đổi `AUTH_SECRET` là OK.

---

## Đổi mật khẩu

→ Vercel Settings → Environment Variables → tìm `ADMIN_PASSWORD` → Edit → đổi value → Save → Redeploy. Tất cả admin sessions cũ vẫn login được cho tới khi cookie hết hạn 30 ngày (vì JWT không check pass mỗi lần, chỉ check khi login).

Muốn invalidate hết session cũ → đổi `AUTH_SECRET` cùng lúc.

---

## Stage 2 (chưa làm)

- `/admin/background` — đổi background image
- `/admin/meals` — chỉnh menu bữa ăn cuối tuần
- `/admin/preview` — xem app như user thấy

Khi cần mở session mới nhờ Claude làm tiếp.
