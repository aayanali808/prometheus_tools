import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "prom_session";
const ALG = "HS256";
const MAGIC_TTL = "15m";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set a 32+ char random string in .env.local."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signMagicLinkToken(email: string): Promise<string> {
  return new SignJWT({ email, kind: "magic" })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(MAGIC_TTL)
    .sign(getSecret());
}

export async function verifyMagicLinkToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.kind !== "magic" || typeof payload.email !== "string") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export async function signSessionToken(email: string): Promise<string> {
  return new SignJWT({ email, kind: "session" })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.kind !== "session" || typeof payload.email !== "string") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<{ email: string } | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(email: string): Promise<void> {
  const token = await signSessionToken(email);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
