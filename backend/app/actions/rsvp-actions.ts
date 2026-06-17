"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function rsvpToEvent(eventId: string) {
  try {
    let activeUser = await getCurrentUser();
    if (!activeUser) {
      activeUser = await prisma.user.upsert({
        where: { id: "test-user-1" },
        update: {},
        create: {
          id: "test-user-1",
          name: "Hackathon Hero",
          points: 0,
        },
      });
    }

    // 2. Create the RSVP connection between the user and the event
    await prisma.rSVP.create({
      data: {
        userId: activeUser.id,
        eventId: eventId,
      },
    });

    // 3. Award the user 10 points for joining!
    await prisma.user.update({
      where: { id: activeUser.id },
      data: {
        points: { increment: 10 },
      },
    });

    // Refresh the timeline to show the updated state
    try {
      revalidatePath("/");
    } catch {
      // Ignore in non-request contexts
    }
    
    return { success: true, message: "Successfully joined! +10 Points awarded." };
  } catch (error: any) {
    // Prisma throws code P2002 if a unique constraint fails (meaning they already RSVP'd)
    if (error.code === "P2002") {
      return { success: false, message: "You are already registered for this event." };
    }
    console.error("RSVP Error:", error);
    return { success: false, message: "Failed to RSVP to event." };
  }
}