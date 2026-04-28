import { NextRequest } from "next/server";
import { signMagicLinkToken } from "@/lib/auth";
import { sendMagicLink } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const raw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(raw)) {
    return Response.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  const token = await signMagicLinkToken(raw);
  const base = process.env.AUTH_URL ?? new URL(req.url).origin;
  const link = `${base}/api/auth/verify?token=${encodeURIComponent(token)}`;

  try {
    await sendMagicLink(raw, link);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email send failed";
    console.error("[auth/request-link]", message);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
