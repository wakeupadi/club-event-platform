import { getClubs } from "@/app/actions/club-actions";
import { CreateClubForm } from "@/components/dashboard/create-club-form";

export default async function ClubsPage() {
  // Fetch all clubs directly from the database before the page renders
  const clubs = await getClubs();

  return (
    <div className="max-w-4xl mx-auto w-full p-8 space-y-8 h-full overflow-y-auto">
      <div>
        <h2 className="text-3xl font-serif text-sidebar-foreground mb-2">Campus Clubs</h2>
        <p className="text-muted-foreground text-sm">
          Discover and join student organizations, or start your own community.
        </p>
      </div>

      {/* The form we just built */}
      <CreateClubForm />

      {/* The Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {clubs.map((club) => (
          <div 
            key={club.id} 
            className="bg-sidebar border border-sidebar-border rounded-xl p-6 hover:border-sidebar-border/80 transition-colors flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-semibold text-sidebar-foreground">{club.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Hosted {club._count.events} {club._count.events === 1 ? 'event' : 'events'}
              </p>
            </div>
            {/* A cool little avatar badge using the first letter of the club name */}
            <div className="h-10 w-10 rounded-full bg-sidebar-foreground/10 flex items-center justify-center text-sidebar-foreground font-bold border border-sidebar-border/50">
              {club.name.charAt(0).toUpperCase()}
            </div>
          </div>
        ))}

        {clubs.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-sidebar-border rounded-xl">
            <p className="text-muted-foreground">No clubs registered yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  );
}