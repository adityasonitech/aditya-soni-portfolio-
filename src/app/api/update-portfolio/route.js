import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { NextResponse } from "next/server";
import { getSessionFromRequest } from "../../../lib/adminSession";

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

    // Server-side write to Firestore
    const docRef = doc(db, "portfolio", "main");
    await setDoc(docRef, data, { merge: true });

    return NextResponse.json({ success: true, message: "Portfolio updated successfully" });
  } catch (error) {
    console.error("Update Portfolio API Error:", error);
    return NextResponse.json({ error: "Failed to update portfolio" }, { status: 500 });
  }
}
