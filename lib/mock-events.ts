import { prisma } from "@/lib/prisma"

export type UpcomingEvent = {
  id: string
  clubName: string
  title: string
  date: string
}

export type UpcomingEventsResult =
  | { ok: true; events: UpcomingEvent[] }
  | { ok: false; message: string }

export async function getUpcomingEvents(): Promise<UpcomingEventsResult> {
  try {
    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      include: {
        club: true,
      },
      orderBy: {
        date: "asc",
      },
    })

    return {
      ok: true,
      events: events.map((event) => ({
        id: event.id,
        clubName: event.club.name,
        title: event.title,
        date: event.date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      })),
    }
  } catch (error) {
    console.error("Failed to load upcoming events:", error)

    return {
      ok: false,
      message:
        "Unable to connect to the database. Use the Supabase pooler connection string in `.env.local`, confirm the project is active, and run `npx prisma migrate dev`.",
    }
  }
}
