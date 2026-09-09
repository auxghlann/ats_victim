import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";

const FIVE_DAYS_MS = 60 * 60 * 24 * 5 * 1000;

/**
 * POST /api/auth/session
 * Exchanges a client Firebase ID token for an HTTP-only __session cookie.
 * Per official Firebase documentation, createSessionCookie automatically
 * validates the ID token during cookie creation.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idToken = body?.idToken;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid idToken" },
        { status: 400 }
      );
    }

    const adminAuth = getFirebaseAdminAuth();
    if (!adminAuth) {
      return NextResponse.json(
        { success: false, error: "Firebase Admin is not configured on the server" },
        { status: 503 }
      );
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: FIVE_DAYS_MS,
    });

    const response = NextResponse.json({
      success: true,
      message: "Session established successfully",
    });

    response.cookies.set("__session", sessionCookie, {
      maxAge: FIVE_DAYS_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error creating Firebase session cookie:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create session cookie" },
      { status: 401 }
    );
  }
}

/**
 * DELETE /api/auth/session
 * Clears the active __session cookie to sign out the user on the server.
 */
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Session terminated successfully",
  });

  response.cookies.set("__session", "", {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  return response;
}
