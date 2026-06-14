import { prisma } from "@/lib/prisma";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

export default async function MyEventsPage() {
  // Fetch only events that our specific user has RSVP'd to
  const myEvents = await prisma.event.findMany({
    where: {
      RSVP: { // <--- Changed from 'rsvps' to 'RSVP'
        some: {
          userId: "test-user-1", 
        },
      },
    },
    include: {
      club: true, 
    },
    orderBy: {
      date: "asc", 
    },
  });

  return (
    <div className="max-w-4xl mx-auto w-full p-8 space-y-8 h-full overflow-y-auto">
      <div>
        <h2 className="text-3xl font-serif text-sidebar-foreground mb-2 flex items-center gap-3">
          <CalendarDays className="size-8 text-sidebar-accent-foreground" />
          My Schedule
        </h2>
        <p className="text-muted-foreground text-sm">
          You are registered for {myEvents.length} upcoming {myEvents.length === 1 ? 'event' : 'events'}.
        </p>
      </div>

      {/* The Roster Grid */}
      <div className="grid grid-cols-1 gap-4 pt-4">
        {myEvents.map((event) => (
          <div 
            key={event.id} 
            className="bg-sidebar border border-sidebar-border rounded-xl p-6 hover:border-sidebar-border/80 transition-colors flex flex-col md:flex-row md:justify-between md:items-center gap-4"
          >
            <div>
              <h3 className="text-xl font-semibold text-sidebar-foreground mb-1">{event.title}</h3>
              <p className="text-sm text-sidebar-accent-foreground font-medium">Hosted by {event.club.name}</p>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="text-right">
                <p className="text-sidebar-foreground font-medium">
                  {event.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <p className="text-muted-foreground mt-1">
                  {event.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="bg-background border border-sidebar-border px-4 py-2 rounded-lg flex items-center text-muted-foreground">
                <span className="mr-2">📍</span>
                {event.location}
              </div>
            </div>
          </div>
        ))}

        {/* Empty State: If they haven't joined anything yet */}
        {myEvents.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border border-dashed border-sidebar-border rounded-xl bg-sidebar/50">
            <CalendarDays className="size-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-sidebar-foreground mb-1">Your schedule is empty</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              You haven't RSVP'd to any campus events yet. Head over to the timeline to see what's happening!
            </p>
            <Link 
              href="/"
              className="bg-sidebar-foreground text-background font-semibold rounded-lg px-6 py-2.5 hover:opacity-90 transition-opacity"
            >
              Explore Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}