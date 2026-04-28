import { NextRequest } from "next/server";
import { verifyMagicLinkToken, setSessionCookie } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const base = req.nextUrl.origin;

  if (!token) {
    return Response.redirect(`${base}/sign-in?error=missing`, 302);
  }

  const payload = await verifyMagicLinkToken(token);
  if (!payload) {
    return Response.redirect(`${base}/sign-in?error=invalid`, 302);
  }

  await setSessionCookie(payload.email);
  return Response.redirect(`${base}/tools/rank-buddy?signed_in=1`, 302);
}
