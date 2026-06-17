import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clubs = await prisma.club.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json({ success: true, clubs });
  } catch (error) {
    console.error("Failed to fetch clubs API:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch clubs" }, { status: 500 });
  }
}
