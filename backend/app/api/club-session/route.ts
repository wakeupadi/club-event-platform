import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CookiePayload = {
  clubId?: string;
};

function parseCookie(name: string, cookieHeader: string | null): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=");
}

export async function GET(request: Request) {
  const currentClubId = parseCookie("current-club-id", request.headers.get("cookie"));
  if (!currentClubId) {
    return NextResponse.json({ currentClubId: null });
  }

  return NextResponse.json({ currentClubId });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CookiePayload;
    const clubId = typeof body.clubId === "string" && body.clubId.trim() ? body.clubId.trim() : null;

    if (!clubId) {
      return NextResponse.json({ success: false, error: "Missing clubId" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, currentClubId: clubId });
    response.cookies.set("current-club-id", clubId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Unable to set club session cookie" }, { status: 500 });
  }
}
