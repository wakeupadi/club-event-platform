import { getUpcomingEvents } from "@/lib/mock-events"

import { EventCard } from "./event-card"

export async function EventFeed() {
  const result = await getUpcomingEvents()

  if (!result.ok) {
    return (
      <section className="mx-auto w-full max-w-2xl space-y-4">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
          <h3 className="font-heading text-sm font-medium text-destructive">
            Database connection failed
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{result.message}</p>
        </div>
      </section>
    )
  }

  const upcomingEvents = result.events

  return (
    <section className="mx-auto w-full max-w-2xl space-y-4">
      <div>
        <h3 className="font-heading text-sm font-medium text-muted-foreground">
          Upcoming Events
        </h3>
        <p className="text-2xl font-semibold tracking-tight">
          {upcomingEvents.length} upcoming events
        </p>
      </div>

      <div className="space-y-4 pb-6">
        {upcomingEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No upcoming events yet. Check back soon.
          </p>
        ) : (
          upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        )}
      </div>
    </section>
  )
}
