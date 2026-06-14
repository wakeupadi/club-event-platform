"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEventAction(formData: FormData) {
  const title = formData.get("title") as string;
  const dateStr = formData.get("date") as string;
  const timeStr = formData.get("time") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  
  // NEW: Grab the club ID from the dropdown menu!
  const clubId = formData.get("clubId") as string; 

  const combinedDateTime = new Date(`${dateStr}T${timeStr}`);

  try {
    // We deleted the fake 'upsert' club hack!
    // Now we just create the event and link it directly to the chosen club.
    await prisma.event.create({
      data: {
        title,
        date: combinedDateTime,
        location,
        description,
        clubId: clubId, // The true relational link
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { success: false, error: "Database insertion failed" };
  }
}