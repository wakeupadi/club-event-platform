import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const currentUserId = request.cookies.get("current-user-id")?.value ?? null;
  return NextResponse.json({ currentUserId });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = typeof body.userId === "string" && body.userId.trim() ? body.userId.trim() : null;

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, currentUserId: userId });
    response.cookies.set("current-user-id", userId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch {
    return NextResponse.json({ success: false, error: "Unable to set session cookie" }, { status: 500 });
  }
}
