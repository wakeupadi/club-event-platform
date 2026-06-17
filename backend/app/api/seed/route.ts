import { NextResponse } from "next/server";
import { seedAcademicCalendar } from "@/app/actions/seed-actions";

export async function POST() {
  const result = await seedAcademicCalendar();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
