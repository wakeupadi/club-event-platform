import { getClubs } from "@/app/actions/club-actions";
import { CreateClubForm } from "@/components/dashboard/create-club-form";
import { CollabSuggester } from "@/components/dashboard/collab-suggester";
import { getActiveRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ClubsPage() {
  const role = await getActiveRole();
  if (role !== "club") {
    redirect("/");
  }
  // Fetch all clubs directly from the database before the page renders
  const clubs = await getClubs();

  return (
    <div className="max-w-4xl mx-auto w-full p-8 space-y-8 h-full overflow-y-auto">
      <div>
        <h2 className="text-3xl font-serif text-zinc-100 mb-2">Campus Clubs</h2>
        <p className="text-zinc-400 text-sm">
          Discover and join student organizations, or start your own community.
        </p>
      </div>

      {/* The form we just built */}
      <CreateClubForm />

      {/* The Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {clubs.map((club) => (
          <div 
            key={club.id} 
            className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-zinc-100">{club.name}</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  Hosted {club._count.events} {club._count.events === 1 ? 'event' : 'events'}
                </p>
              </div>
              <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-100 font-bold border border-zinc-700">
                {club.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="border-t border-zinc-850 pt-4 mt-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-3 font-semibold">Collaboration Insights</p>
              <CollabSuggester clubId={club.id} />
            </div>
          </div>
        ))}

        {clubs.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-zinc-800 rounded-xl bg-[#0a0a0a]">
            <p className="text-zinc-400">No clubs registered yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  );
}