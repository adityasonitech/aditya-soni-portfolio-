import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be set (at least 32 characters)");
  }
  return secret;
}

function sign(payload) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

// Token format: <base64url(JSON payload)>.<HMAC signature>
export function createSessionToken(email) {
  const payload = Buffer.from(
    JSON.stringify({ email, exp: Date.now() + SESSION_TTL_MS })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;

  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = sign(payload);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.exp || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export function getSessionFromRequest(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}
