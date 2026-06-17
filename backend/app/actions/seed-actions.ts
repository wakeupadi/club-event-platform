import { prisma } from "@/lib/prisma";

export async function seedAcademicCalendar() {
    const blackoutDates = [
      {
        title: "Orientation of Fresh BTech Students",
        startDate: new Date("2026-08-03T00:00:00Z"),
        endDate: new Date("2026-08-07T23:59:59Z"),
        type: "EVENT"
      },
      {
        title: "First In-Semester Examination",
        startDate: new Date("2026-08-31T00:00:00Z"),
        endDate: new Date("2026-09-05T23:59:59Z"),
        type: "EXAM"
      },
      {
        title: "Second In-Semester Examination",
        startDate: new Date("2026-10-06T00:00:00Z"),
        endDate: new Date("2026-10-10T23:59:59Z"),
        type: "EXAM"
      },
      {
        title: "In-Semester Break",
        startDate: new Date("2026-11-09T00:00:00Z"),
        endDate: new Date("2026-11-13T23:59:59Z"),
        type: "HOLIDAY"
      },
      {
        title: "End-Semester Examination",
        startDate: new Date("2026-11-23T00:00:00Z"),
        endDate: new Date("2026-12-05T23:59:59Z"),
        type: "EXAM"
      }
    ];
  
    try {
      for (const event of blackoutDates) {
        await prisma.academicCalendar.create({
          data: event
        });
      }
      console.log("Real DA-IICT Academic calendar seeded!");
      return { success: true };
    } catch (error) {
      console.error("Failed to seed calendar:", error);
      return { success: false };
    }
  }