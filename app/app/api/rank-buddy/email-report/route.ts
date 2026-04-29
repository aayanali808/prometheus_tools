import { NextRequest } from "next/server";
import { generateAuditPdf, type ScoreInput } from "@/lib/pdf";
import { sendAuditReport } from "@/lib/email";

export const runtime = "nodejs";
export const maxDuration = 60;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let payload: { url?: string; scores?: ScoreInput[]; email?: string } = {};
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!payload.url) {
    return Response.json({ error: "Missing url" }, { status: 400 });
  }
  if (!payload.email || !EMAIL_RE.test(payload.email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    const { pdf, hostname } = await generateAuditPdf({
      url: payload.url,
      scores: payload.scores ?? [],
    });
    await sendAuditReport({
      to: payload.email,
      hostname,
      pdf,
    });
    return Response.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send report";
    return Response.json({ error: message }, { status: 500 });
  }
}
