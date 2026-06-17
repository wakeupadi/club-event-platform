"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEventAction(formData: FormData) {
  const title = formData.get("title") as string;
  const dateStr = formData.get("date") as string;
  const timeStr = formData.get("time") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  const clubId = formData.get("clubId") as string; 

  // Parse using India timezone (+05:30)
  const combinedDateTime = new Date(`${dateStr}T${timeStr}:00+05:30`);

  try {
    // Check for 2-hour minimum gap between events campus-wide
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    const proposedTime = combinedDateTime.getTime();

    const conflictingEvent = await prisma.event.findFirst({
      where: {
        date: {
          gte: new Date(proposedTime - twoHoursInMs),
          lte: new Date(proposedTime + twoHoursInMs),
        },
      },
      include: {
        club: true,
      },
    });

    if (conflictingEvent) {
      const conflictTimeStr = conflictingEvent.date.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
      });
      const conflictDateStr = conflictingEvent.date.toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata",
        month: "short",
        day: "numeric",
      });
      return {
        success: false,
        error: `Conflict: There must be at least a 2-hour gap between events on campus. "${conflictingEvent.title}" (by ${conflictingEvent.club.name}) is scheduled on ${conflictDateStr} at ${conflictTimeStr}.`,
      };
    }

    await prisma.event.create({
      data: {
        title,
        date: combinedDateTime,
        location,
        description,
        clubId: clubId,
      },
    });

    try {
      revalidatePath("/");
    } catch (e) {
      // Ignore static generation store missing in CLI/test runner contexts
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { success: false, error: "Database insertion failed" };
  }
}