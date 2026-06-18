"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAttendance(userId: string, eventId: string) {
  try {
    const rsvp = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId
        }
      }
    });

    if (!rsvp) {
      return { success: false, error: `User (${userId}) is not registered for event (${eventId}).` };
    }

    if (rsvp.attended) {
      return { success: true, message: "User already marked as attended." };
    }

    await prisma.rSVP.update({
      where: {
        userId_eventId: {
          userId,
          eventId
        }
      },
      data: {
        attended: true
      }
    });

    revalidatePath("/club-dashboard");
    revalidatePath("/my-events");
    return { success: true, message: "Attendance verified successfully!" };
  } catch (error) {
    console.error("Attendance marking failed:", error);
    return { success: false, error: "Failed to mark attendance." };
  }
}
