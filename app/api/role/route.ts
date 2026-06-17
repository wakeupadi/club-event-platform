import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const role = request.cookies.get("active-role")?.value || "student";
  return NextResponse.json({ role });
}

export async function POST(request: NextRequest) {
  try {
    const { role } = await request.json();
    const activeRole = role === "club" ? "club" : "student";
    const response = NextResponse.json({ success: true, role: activeRole });
    response.cookies.set("active-role", activeRole, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (err) {
    console.error("Failed to set active-role cookie:", err);
    return NextResponse.json({ success: false, error: "Unable to set role cookie" }, { status: 500 });
  }
}
