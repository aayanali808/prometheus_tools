import { NextRequest } from "next/server";
import { generateAuditPdf, type ScoreInput } from "@/lib/pdf";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let payload: { url?: string; scores?: ScoreInput[] } = {};
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!payload.url) {
    return new Response("Missing url", { status: 400 });
  }

  const { pdf, hostname } = await generateAuditPdf({
    url: payload.url,
    scores: payload.scores ?? [],
  });

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="rank-buddy-${hostname}.pdf"`,
    },
  });
}
