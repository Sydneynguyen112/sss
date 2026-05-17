import { Resend } from "resend";

let cached: Resend | null = null;

function getResend(): Resend {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY missing.");
  cached = new Resend(key);
  return cached;
}

export async function sendMagicLink(to: string, link: string): Promise<void> {
  const from = process.env.RESEND_FROM || "onboarding@resend.dev";
  await getResend().emails.send({
    from,
    to,
    subject: "Đăng nhập Hành Trình — Admin",
    html: buildMagicLinkHtml(link),
    text: `Click vào link sau để đăng nhập (hết hạn sau 10 phút):\n\n${link}\n\nNếu bạn không yêu cầu, có thể bỏ qua email này.`,
  });
}

function buildMagicLinkHtml(link: string): string {
  return `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#F8FAFC;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;padding:32px;box-shadow:0 4px 24px rgba(0,119,194,0.08);">
        <tr><td>
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.16em;color:#64748B;margin:0 0 12px;">Hành Trình</p>
          <h1 style="font-size:24px;color:#1A2332;margin:0 0 12px;font-weight:600;">Đăng nhập Admin</h1>
          <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 24px;">
            Bấm vào nút bên dưới để đăng nhập trong vòng 10 phút.
            Link sử dụng một lần.
          </p>
          <a href="${link}" style="display:inline-block;background:#0077C2;color:#fff;text-decoration:none;padding:12px 24px;border-radius:12px;font-weight:600;font-size:14px;">
            Đăng nhập Hành Trình
          </a>
          <p style="font-size:12px;color:#94A3B8;line-height:1.6;margin:24px 0 0;">
            Nếu nút không hoạt động, copy link sau:<br>
            <span style="color:#0077C2;word-break:break-all;">${link}</span>
          </p>
          <p style="font-size:11px;color:#94A3B8;margin:24px 0 0;">
            Không yêu cầu? Có thể bỏ qua email này — link sẽ hết hạn.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
