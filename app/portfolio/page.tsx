import { redirect } from "next/navigation";
import { getActiveRole, getCurrentUser } from "@/lib/auth";
import { getStudentPortfolio } from "@/actions/achievements";
import { PrintButton } from "@/components/dashboard/print-button";

export default async function PortfolioPage() {
  const role = await getActiveRole();
  if (role !== "student") {
    redirect("/");
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <div className="p-8 text-zinc-400">User not found</div>;
  }

  const result = await getStudentPortfolio(currentUser.id);
  if (!result.success || !result.user) {
    return <div className="p-8 text-red-500">Failed to load portfolio.</div>;
  }

  const { user } = result;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <div>
          <h1 className="text-3xl font-serif font-bold text-zinc-100">My Portfolio</h1>
          <p className="text-zinc-400 mt-1">Track your achievements and export your resume.</p>
        </div>
        <PrintButton />
      </div>

      {/* Resume Document - Stylized for both screen and print */}
      <div className="bg-white text-black p-10 rounded-lg shadow-2xl print:shadow-none print:p-0 print:bg-transparent min-h-[800px]">
        <div className="border-b-2 border-zinc-200 pb-6 mb-6">
          <h1 className="text-4xl font-bold uppercase tracking-wider">{user.name}</h1>
          <p className="text-zinc-600 mt-2">Campus Involvement Portfolio • Points: {user.points}</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold uppercase tracking-widest text-zinc-800 border-b border-zinc-200 pb-2 mb-4">
              Verified Achievements
            </h2>
            {user.achievements.length > 0 ? (
              <ul className="space-y-4">
                {user.achievements.map(ach => (
                  <li key={ach.id} className="relative pl-4 border-l-2 border-amber-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{ach.title}</h3>
                        <p className="font-medium text-zinc-700">{ach.event.title} • {ach.event.club.name}</p>
                        {ach.description && <p className="text-sm text-zinc-600 mt-1 italic">"{ach.description}"</p>}
                      </div>
                      <span className="text-xs text-zinc-500 font-mono bg-zinc-100 px-2 py-1 rounded">
                        Verified: {ach.verifiedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 italic">No verified achievements yet. Participate in events to earn accolades!</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold uppercase tracking-widest text-zinc-800 border-b border-zinc-200 pb-2 mb-4">
              Event Participation
            </h2>
            {user.rsvps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.rsvps.map(rsvp => (
                  <div key={rsvp.id} className="bg-zinc-50 p-4 rounded-md border border-zinc-100 print:border-zinc-300">
                    <h3 className="font-semibold text-zinc-900">{rsvp.event.title}</h3>
                    <p className="text-sm text-zinc-600">{rsvp.event.club.name}</p>
                    <p className="text-xs text-zinc-500 mt-2">
                      {rsvp.event.date.toLocaleDateString()} • {rsvp.event.location}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 italic">You haven't participated in any events yet.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
