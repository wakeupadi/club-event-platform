"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Fetch all clubs for the UI Directory and the Event Dropdown
export async function getClubs() {
  try {
    const clubs = await prisma.club.findMany({
      orderBy: {
        name: "asc", // Alphabetical order is best for dropdowns!
      },
      include: {
        // Count how many events each club has hosted
        _count: {
          select: { events: true }
        }
      }
    });
    return clubs;
  } catch (error) {
    console.error("Failed to fetch clubs:", error);
    return [];
  }
}

// 2. Create a brand new club from the frontend form
export async function createClubAction(formData: FormData) {
  const name = formData.get("name") as string;
  // We will pass a description too, even if it's not strictly in the schema yet, 
  // it's good practice for when we expand the model later!
  
  try {
    await prisma.club.create({
      data: {
        name: name,
      },
    });

    // Refresh both the Clubs page and the Create Event page so the new club appears everywhere instantly
    revalidatePath("/clubs");
    revalidatePath("/create");
    
    return { success: true, message: `${name} has been officially registered!` };
  } catch (error) {
    console.error("Failed to create club:", error);
    return { success: false, error: "Failed to register club." };
  }
}