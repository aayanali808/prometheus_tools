import "server-only";
import { Resend } from "resend";

let cached: Resend | null = null;
function getClient(): Resend {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not set.");
  }
  cached = new Resend(key);
  return cached;
}

export interface SendAuditReportInput {
  to: string;
  hostname: string;
  pdf: Buffer;
}

export async function sendAuditReport(input: SendAuditReportInput): Promise<void> {
  const from =
    process.env.RESEND_FROM ??
    "Prometheus Tools <onboarding@resend.dev>";

  const filename = `rank-buddy-${input.hostname}.pdf`;

  const { error } = await getClient().emails.send({
    from,
    to: [input.to],
    subject: `Your Rank Buddy audit for ${input.hostname}`,
    html: renderEmailHtml(input.hostname),
    text: renderEmailText(input.hostname),
    attachments: [
      {
        filename,
        content: input.pdf,
      },
    ],
  });

  if (error) {
    throw new Error(error.message ?? "Resend send failed");
  }
}

function renderEmailText(hostname: string): string {
  return `Your Rank Buddy audit for ${hostname} is attached as a PDF.

It includes both the SEO and AIO scores, category breakdowns, and the top fixes ranked by impact.

— Prometheus Tools`;
}

function renderEmailHtml(hostname: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Rank Buddy audit</title>
</head>
<body style="margin:0;padding:0;background:#EFEBE8;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1C1C1C;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFEBE8;padding:48px 24px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#F5F2EE;border:1px solid #DCD8D4;">
          <tr>
            <td style="padding:32px 36px 0;">
              <div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:0.7rem;letter-spacing:0.18em;text-transform:uppercase;color:#FF5B23;font-weight:600;">
                Rank Buddy &middot; Prometheus Tools
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 36px 8px;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:2rem;font-weight:400;line-height:1.2;color:#1C1C1C;">
                Your audit for <em style="color:#FF5B23;font-style:italic;">${escapeForHtml(hostname)}</em> is ready.
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 36px 24px;">
              <p style="margin:0;color:#525252;font-size:0.95rem;line-height:1.6;">
                The PDF attached to this email contains your full SEO and AIO scores, category breakdowns, and the top fixes ranked by impact. Evidence-only — no assumptions about traffic, backlinks, or rankings.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 36px 28px;border-top:1px solid #DCD8D4;">
              <p style="margin:0;color:#A8A29E;font-family:'JetBrains Mono',Menlo,monospace;font-size:0.62rem;letter-spacing:0.08em;line-height:1.5;">
                If you didn&rsquo;t request this audit, you can safely ignore this email.
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

function escapeForHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
