import { NextResponse } from "next/server";
import { suggestCollaborators } from "@/app/actions/collab-actions";

export async function POST(request: Request) {
  const body = await request.json();
  const clubId = typeof body.clubId === "string" ? body.clubId : null;

  if (!clubId) {
    return NextResponse.json({ success: false, error: "clubId is required" }, { status: 400 });
  }

  try {
    const suggestions = await suggestCollaborators(clubId);
    return NextResponse.json({ success: true, suggestions });
  } catch (error) {
    console.error("Collaborator suggestion failed", error);
    return NextResponse.json({ success: false, error: "Unable to compute suggestions" }, { status: 500 });
  }
}
