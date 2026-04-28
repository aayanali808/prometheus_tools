import { Resend } from "resend";

let cached: Resend | null = null;
function getClient(): Resend {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY not set in .env.local");
  }
  cached = new Resend(key);
  return cached;
}

export async function sendMagicLink(email: string, url: string): Promise<void> {
  const from =
    process.env.RESEND_FROM ?? "Prometheus Tools <onboarding@resend.dev>";

  const { error } = await getClient().emails.send({
    from,
    to: [email],
    subject: "Your Prometheus Tools sign-in link",
    html: renderMagicLinkHtml(url),
    text: `Sign in to Prometheus Tools.

Click this link to sign in (expires in 15 minutes):
${url}

If you didn't request this, you can ignore this email.`,
  });

  if (error) {
    throw new Error(error.message ?? "Resend send failed");
  }
}

function renderMagicLinkHtml(url: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign in to Prometheus Tools</title>
</head>
<body style="margin:0;padding:0;background:#151515;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#F0EAE0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#151515;padding:48px 24px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#0E0E0E;border:1px solid #2A2A2A;">
          <tr>
            <td style="padding:32px 36px 0;">
              <div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:0.7rem;letter-spacing:0.18em;text-transform:uppercase;color:#FF5B23;font-weight:600;">
                Prometheus &middot; Tools
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 36px 8px;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:2rem;font-weight:400;line-height:1.1;color:#F0EAE0;">
                Sign in to <em style="color:#FF5B23;font-style:italic;">your account.</em>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 36px 24px;">
              <p style="margin:0;color:rgba(240,234,224,0.75);font-size:0.95rem;line-height:1.6;">
                Click the button below to sign in. This link expires in 15 minutes and can only be used once.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 36px 32px;">
              <a href="${url}" style="display:inline-block;background:#FF5B23;color:#151515;padding:14px 24px;font-family:'JetBrains Mono',Menlo,monospace;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;text-decoration:none;">
                Sign in &rarr;
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 36px 28px;">
              <div style="height:1px;background:#2A2A2A;margin-bottom:20px;"></div>
              <p style="margin:0 0 6px;color:#A8A29E;font-size:0.78rem;line-height:1.5;">
                If the button doesn&rsquo;t work, paste this URL into your browser:
              </p>
              <p style="margin:0;color:#A8A29E;font-size:0.72rem;font-family:'JetBrains Mono',Menlo,monospace;word-break:break-all;line-height:1.5;">
                ${url}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 36px 28px;border-top:1px solid #2A2A2A;">
              <p style="margin:0;color:#A8A29E;font-family:'JetBrains Mono',Menlo,monospace;font-size:0.62rem;letter-spacing:0.08em;line-height:1.5;">
                If you didn&rsquo;t request this email, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
