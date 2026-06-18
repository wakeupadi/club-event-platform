"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function awardAchievement(
  studentId: string,
  eventId: string,
  title: string,
  description?: string
) {
  try {
    // Check if achievement already exists
    const existing = await prisma.achievement.findFirst({
      where: {
        userId: studentId,
        eventId: eventId,
        title: title,
      },
    });

    if (existing) {
      return { success: false, error: "Achievement already awarded for this event." };
    }

    const achievement = await prisma.achievement.create({
      data: {
        title,
        description: description || null,
        userId: studentId,
        eventId: eventId,
      },
    });

    revalidatePath("/portfolio");
    revalidatePath("/");
    
    return { success: true, achievement };
  } catch (error: any) {
    console.error("Failed to award achievement:", error);
    return { success: false, error: "Failed to award achievement." };
  }
}

export async function getStudentPortfolio(studentId: string) {
  try {
    // Fetch all RSVPs and Achievements for this student
    const user = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        rsvps: {
          include: {
            event: {
              include: {
                club: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        achievements: {
          include: {
            event: {
              include: {
                club: true,
              },
            },
          },
          orderBy: {
            verifiedAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, user };
  } catch (error: any) {
    console.error("Failed to fetch portfolio:", error);
    return { success: false, error: "Failed to fetch portfolio." };
  }
}
