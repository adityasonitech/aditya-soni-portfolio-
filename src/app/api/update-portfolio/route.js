import { NextResponse } from "next/server";
import { adminDb } from "../../../lib/firebaseAdmin";
import { getSessionFromRequest } from "../../../lib/adminSession";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    // Only an authenticated admin (signed httpOnly cookie from /api/login) may write
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Admin SDK write: bypasses the client-side deny-all write rule
    await adminDb().collection("portfolio").doc("main").set(data, { merge: true });

    return NextResponse.json({ success: true, message: "Portfolio updated successfully" });
  } catch (error) {
    console.error("Update Portfolio API Error:", error);
    return NextResponse.json({ error: "Failed to update portfolio" }, { status: 500 });
  }
}
