# Admin Setup — Hành Trình

Hướng dẫn cấu hình view admin lần đầu trên Vercel. Sau khi xong, vào `https://<your-app>/admin/login`, nhập email admin → nhận link qua mail → bấm vào → vào dashboard.

---

## 1. Cài Vercel KV (storage)

Vercel KV = Upstash Redis được Vercel tích hợp, dùng để lưu các override + magic token. Free tier 500K command/tháng, đủ rộng.

1. Mở Vercel dashboard → chọn project (vd `sss`)
2. Tab **Storage** → bấm **Create Database** → chọn **KV (Upstash)** → **Continue**
3. Đặt tên database (vd `hanh-trinh-kv`) → chọn region gần (`Singapore` cho VN) → bấm **Create**
4. Tab **Connect Project** → chọn project + tick **Development**, **Preview**, **Production** → **Connect**

Vercel sẽ **tự inject** 6 env vars: `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_URL`, `KV_REST_API_READ_ONLY_TOKEN`, `REDIS_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. Code chỉ dùng 2 cái đầu — đủ.

---

## 2. Sign up Resend (email)

Resend = service gửi email API. Free tier 100 mail/day, 3000/month.

1. Mở https://resend.com/signup → sign up bằng GitHub hoặc email
2. Trang **API Keys** → bấm **Create API Key** → tên (vd `hanh-trinh-prod`) → **Full access** → bấm **Add**
3. Copy chuỗi `re_xxxxxxxxxx` — đây là `RESEND_API_KEY`

**Domain sender:**
- **Quick start (dev/test)**: Resend cho dùng sẵn địa chỉ `onboarding@resend.dev`. Email gửi từ địa chỉ này, nhận cũng được. **Không cần verify domain.**
- **Production**: Verify domain riêng (vd `mail.hanhtrinh.com`) qua Resend dashboard → Domains. Mất 5-10 phút setup DNS. Sau đó dùng env `RESEND_FROM=Tên <hello@your-domain.com>`.

Cho v1 mình recommend dùng `onboarding@resend.dev` — đủ dùng cho 1-2 admin.

---

## 3. Thêm env vars vào Vercel

Vercel dashboard → project → **Settings → Environment Variables**. Thêm 4 biến mới (KV đã tự thêm ở bước 1):

| Name | Value | Environments |
|---|---|---|
| `RESEND_API_KEY` | `re_xxxxxxxxxx` (copy ở bước 2) | All |
| `ADMIN_EMAILS` | `nguyennhunguyen112@gmail.com` (có thể nhiều email, phân cách dấu phẩy) | All |
| `AUTH_SECRET` | chuỗi random ≥32 ký tự (xem cách tạo bên dưới) | All |
| `APP_URL` | `https://<your-vercel-domain>` (vd `https://sss.vercel.app` — không có `/` cuối) | Production |
| `RESEND_FROM` | `onboarding@resend.dev` | All (tùy chọn, để trống cũng được) |

**Tạo AUTH_SECRET**: chạy lệnh sau ở terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy chuỗi hex 64 ký tự → paste vào ô Value.

**Lưu ý**: Sau khi thêm env vars, Vercel KHÔNG tự rebuild. Cần trigger:
- Tab **Deployments** → bấm `...` ở deployment mới nhất → **Redeploy** → tick **Use existing Build Cache** → **Redeploy**
- HOẶC push thêm 1 commit (vd commit empty `git commit --allow-empty -m "chore: trigger redeploy"`)

---

## 4. Đăng nhập lần đầu

1. Mở `https://<your-app>/admin/login`
2. Nhập email admin (vd `nguyennhunguyen112@gmail.com`) → bấm **Gửi link đăng nhập**
3. Mở hộp mail (check cả Spam/Promotions) → tìm mail từ `onboarding@resend.dev` tiêu đề **"Đăng nhập Hành Trình — Admin"**
4. Bấm nút **Đăng nhập Hành Trình** trong mail
5. Link redirect về `/admin` → thấy dashboard

Link hết hạn sau **10 phút**, dùng **1 lần**. Session JWT cookie giữ login 30 ngày.

---

## 5. Sử dụng

3 trang admin sẵn ở stage 1:

### `/admin/keyword` — Từ khoá hôm nay
- Bật override → nhập từ khoá VN + EN + tagline → Lưu
- Bạn trai mở Home sẽ thấy từ khoá em đặt thay vì rotation mặc định
- Tắt → quay lại 30 từ mặc định auto rotate

### `/admin/greetings` — Lời chúc theo giờ
- 4 slot: sáng (5-11h), trưa (11-17h), chiều (17-22h), đêm (22-5h)
- Mỗi slot 1 câu, có thể dùng `{name}` để chèn tên — vd `Chào sáng {name}, hôm nay nhớ thở sâu nhé!`
- Bỏ trống slot → slot đó dùng mặc định

### `/admin/popups` — Popup gửi anh
- Tạo lời nhắn / message bất ngờ
- Tùy chọn: emoji, ngày bắt đầu, ngày kết thúc, "chỉ hiện 1 lần"
- Bạn trai mở app → popup hiện sau 800ms (mọi trang trừ /admin)
- Xoá bằng nút thùng rác

---

## Troubleshooting

**"KV chưa cấu hình" trên /admin**
→ Env vars `KV_REST_API_URL` / `KV_REST_API_TOKEN` chưa có. Bước 1 chưa làm xong hoặc chưa redeploy.

**Email không đến**
→ Check Resend dashboard → **Logs** xem mail có được gửi đi không. Nếu có nhưng không đến → check Spam, Promotions. Nếu chưa có log → env `RESEND_API_KEY` sai.

**"Email không có quyền admin"**
→ `ADMIN_EMAILS` env không khớp email vừa nhập. Case-insensitive nhưng phải đúng email.

**Link redirect tới production nhưng đang dev local**
→ Env `APP_URL` set theo Vercel production URL. Cho local dev, tạo file `.env.local` ở root project với `APP_URL=http://localhost:3000` (nhưng .env.local KHÔNG commit lên GitHub).

---

## Stage 2 (chưa làm)

- `/admin/background` — đổi background image
- `/admin/meals` — chỉnh menu bữa ăn cuối tuần
- `/admin/preview` — xem app như user thấy

Khi cần, mở session mới nhờ Claude tiếp tục.
