import { prisma } from "@/lib/prisma";
import { RsvpButton } from "@/components/dashboard/rsvp-button";
import { getActiveRole, getCurrentUser, getCurrentClub } from "@/lib/auth";

export async function EventFeed() {
  const events = await prisma.event.findMany({
    include: {
      club: true,
      RSVP: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  const role = await getActiveRole();
  const currentUser = await getCurrentUser();
  const activeClub = await getCurrentClub();

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

      <div className="grid gap-4">
        {events.map((event) => {
          const isRegistered = currentUser ? event.RSVP.some(r => r.userId === currentUser.id) : false;

          return (
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
                    {event.date.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {event.date.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}
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

              {role === "student" ? (
                <RsvpButton eventId={event.id} initialRegistered={isRegistered} />
              ) : (
                <div className="mt-4 pt-4 border-t border-zinc-900/60 flex flex-col gap-2">
                  <div className="flex items-center text-sm font-medium text-zinc-300 gap-1.5">
                    <span>👥</span>
                    <span>{event.RSVP.length} student{event.RSVP.length === 1 ? '' : 's'} registered</span>
                  </div>
                  
                  {activeClub && event.clubId === activeClub.id && (
                    <div className="mt-1 bg-[#111111] p-3 rounded-lg border border-zinc-900 text-xs">
                      <p className="text-zinc-500 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Attendee Roster</p>
                      {event.RSVP.length > 0 ? (
                        <p className="text-zinc-300 font-medium">
                          {event.RSVP.map(r => r.user.name).join(" • ")}
                        </p>
                      ) : (
                        <p className="text-zinc-600 italic">No students registered yet.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}