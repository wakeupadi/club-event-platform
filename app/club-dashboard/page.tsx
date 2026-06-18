import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getActiveRole, getCurrentClub } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/header";
import { BarChart3, Users, Calendar as CalendarIcon } from "lucide-react";
import { QrScannerKiosk } from "@/components/dashboard/qr-scanner";

export default async function ClubDashboardPage() {
  const role = await getActiveRole();
  const currentClubId = await getCurrentClub();

  if (role !== "club") {
    return (
      <div className="flex flex-col min-h-screen bg-background text-zinc-100">
        <DashboardHeader />
        <main className="flex-1 p-6 md:p-12 max-w-6xl mx-auto w-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium text-zinc-300">Access Denied</h2>
            <p className="text-zinc-500 mt-2">Only clubs can access the analytics dashboard.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!currentClubId) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-zinc-100">
        <DashboardHeader />
        <main className="flex-1 p-6 md:p-12 max-w-6xl mx-auto w-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium text-zinc-300">No Club Selected</h2>
            <p className="text-zinc-500 mt-2">Please select a club from the dropdown to view analytics.</p>
          </div>
        </main>
      </div>
    );
  }

  // Fetch events hosted by this club and their RSVPs
  const events = await prisma.event.findMany({
    where: { clubId: currentClubId.id },
    include: {
      RSVP: {
        include: {
          user: true
        }
      },
    },
    orderBy: { date: 'desc' }
  });

  const club = await prisma.club.findUnique({ where: { id: currentClubId.id }});

  const totalEvents = events.length;
  const totalRSVPs = events.reduce((acc, ev) => acc + ev.RSVP.length, 0);
  const avgParticipation = totalEvents > 0 ? Math.round(totalRSVPs / totalEvents) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background text-zinc-100">
      <DashboardHeader />
      
      <main className="flex-1 p-6 md:p-12 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-serif font-medium text-white mb-2">{club?.name} Analytics</h1>
            <p className="text-zinc-400">Track your event performance and scan student attendance.</p>
          </div>
          <QrScannerKiosk />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card/80 backdrop-blur-xl shadow-2xl border border-zinc-800 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-zinc-800/50 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-zinc-300" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium uppercase tracking-wider">Events Held</p>
              <p className="text-3xl font-bold text-zinc-100">{totalEvents}</p>
            </div>
          </div>
          
          <div className="bg-card/80 backdrop-blur-xl shadow-2xl border border-zinc-800 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium uppercase tracking-wider">Total Registrations</p>
              <p className="text-3xl font-bold text-zinc-100">{totalRSVPs}</p>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-xl shadow-2xl border border-zinc-800 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium uppercase tracking-wider">Avg Participants</p>
              <p className="text-3xl font-bold text-zinc-100">{avgParticipation} <span className="text-sm font-normal text-zinc-500">/ event</span></p>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-card/80 backdrop-blur-xl shadow-2xl border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
            <h2 className="text-lg font-semibold text-zinc-100">Event Breakdown</h2>
          </div>
          
          {events.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              No events hosted yet. Go to the timeline to create one!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-400">
                    <th className="px-6 py-4 font-medium">Event Title</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium text-right">Registrations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {events.map(event => {
                    const verifiedAttendees = event.RSVP.filter(r => r.attended).map(r => r.user);
                    return (
                      <tr key={event.id} className="hover:bg-zinc-800/30 transition-colors group">
                        <td className="px-6 py-4" colSpan={3}>
                          <details className="w-full">
                            <summary className="list-none flex justify-between items-center cursor-pointer w-full outline-none">
                              <div className="text-sm font-medium text-zinc-200">
                                {event.title}
                              </div>
                              <div className="flex items-center gap-12 text-sm">
                                <div className="text-zinc-400 w-24">
                                  {event.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </div>
                                <div className="text-zinc-300 font-semibold w-24 text-right flex flex-col items-end">
                                  <span>{event.RSVP.length} Registered</span>
                                  <span className="text-xs text-emerald-400 font-normal">{verifiedAttendees.length} Verified</span>
                                </div>
                              </div>
                            </summary>
                            
                            <div className="mt-4 pt-4 border-t border-zinc-800/50">
                              <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-3">Verified Physical Attendees</h4>
                              {verifiedAttendees.length === 0 ? (
                                <p className="text-sm text-zinc-600 italic">No students have been verified via QR scan yet.</p>
                              ) : (
                                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {verifiedAttendees.map(user => (
                                    <li key={user.id} className="text-sm text-emerald-300 flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-md border border-emerald-500/20 w-max">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                      {user.name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </details>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
