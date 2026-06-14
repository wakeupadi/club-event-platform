import { prisma } from "@/lib/prisma";
import { RsvpButton } from "@/components/dashboard/rsvp-button";

export async function EventFeed() {
  // Fetch real events from Supabase, including the Club name!
  const events = await prisma.event.findMany({
    include: {
      club: true,
    },
    orderBy: {
      date: 'asc', // Show the earliest events first
    },
  });

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h3 className="text-zinc-400 text-sm mb-1">Upcoming Events</h3>
        <h2 className="text-2xl font-serif text-zinc-100">
          {events.length} {events.length === 1 ? 'upcoming event' : 'upcoming events'}
        </h2>
        {events.length === 0 && (
          <p className="text-zinc-500 mt-4 text-sm">No upcoming events yet. Check back soon.</p>
        )}
      </div>

      {/* Map through the database rows and render them */}
      <div className="grid gap-4">
        {events.map((event) => (
          <div 
            key={event.id} 
            className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-1">{event.title}</h3>
                <p className="text-sm text-zinc-400">{event.club.name}</p>
              </div>
              <div className="text-right">
                <p className="text-zinc-300 font-medium">
                  {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {event.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed line-clamp-2">
              {event.description}
            </p>
            
            <div className="flex items-center text-xs text-zinc-500 bg-[#111111] inline-flex px-3 py-1.5 rounded-md border border-zinc-800/50">
              <span className="mr-2">📍</span>
              {event.location}
            </div>

            <RsvpButton eventId={event.id} />

          </div>
        ))}
      </div>
    </div>
  );
}