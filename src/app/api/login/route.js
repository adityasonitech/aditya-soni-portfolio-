import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { adminDb } from "../../../lib/firebaseAdmin";
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE } from "../../../lib/adminSession";

export const runtime = "nodejs";

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a ?? ""));
  const bufB = Buffer.from(String(b ?? ""));
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Admin SDK read: the admin-credential collection is unreadable from any client
    const snap = await adminDb().collection("admin-credential").doc("Admin-credential").get();

    if (snap.exists) {
      const data = snap.data();
      if (safeEqual(data.Email, email) && safeEqual(data.Password, password)) {
        const response = NextResponse.json({ success: true, message: "Login successful" });
        response.cookies.set(SESSION_COOKIE, createSessionToken(email), sessionCookieOptions());
        return response;
      }
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
