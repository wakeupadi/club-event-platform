import { prisma } from "@/lib/prisma";
import { Trophy, Medal, Award } from "lucide-react";

export default async function LeaderboardPage() {
  // Fetch the top 50 users, ranked by points descending
  const leaderboard = await prisma.user.findMany({
    orderBy: {
      points: "desc",
    },
    take: 50,
  });

  return (
    <div className="max-w-4xl mx-auto w-full p-8 space-y-8 h-full overflow-y-auto">
      <div className="flex items-center gap-4 border-b border-sidebar-border pb-6">
        <div className="p-3 bg-sidebar-accent/30 rounded-xl">
          <Trophy className="size-8 text-sidebar-accent-foreground" />
        </div>
        <div>
          <h2 className="text-3xl font-serif text-sidebar-foreground mb-1">Campus Leaderboard</h2>
          <p className="text-muted-foreground text-sm">
            The most active students attending workshops, club sessions, and hackathons.
          </p>
        </div>
      </div>

      <div className="bg-sidebar border border-sidebar-border rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 border-b border-sidebar-border bg-sidebar-accent/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <div className="w-12 text-center">Rank</div>
          <div>Student</div>
          <div className="text-right pr-4">Total Points</div>
        </div>

        <div className="divide-y divide-sidebar-border/50">
          {leaderboard.map((user, index) => {
            const rank = index + 1;
            
            // Logic to assign visual weight to the Top 3
            const isFirst = rank === 1;
            const isSecond = rank === 2;
            const isThird = rank === 3;
            
            return (
              <div 
                key={user.id} 
                className={`grid grid-cols-[auto_1fr_auto] gap-4 p-4 items-center transition-colors hover:bg-sidebar-accent/5 ${
                  isFirst ? "bg-sidebar-accent/10" : ""
                }`}
              >
                {/* Rank Icon or Number */}
                <div className="w-12 flex justify-center">
                  {isFirst ? <Trophy className="size-5 text-yellow-500" /> :
                   isSecond ? <Medal className="size-5 text-zinc-400" /> :
                   isThird ? <Medal className="size-5 text-amber-700" /> :
                   <span className="text-muted-foreground font-medium">{rank}</span>}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-background border border-sidebar-border flex items-center justify-center text-sidebar-foreground font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`font-medium ${isFirst ? "text-sidebar-foreground" : "text-sidebar-foreground/80"}`}>
                    {user.name}
                    {user.id === "test-user-1" && " (You)"}
                  </span>
                </div>

                {/* Points */}
                <div className="text-right pr-4">
                  <span className={`font-bold ${isFirst ? "text-yellow-500" : "text-sidebar-foreground"}`}>
                    {user.points}
                  </span>
                  <span className="text-muted-foreground text-xs ml-1">pts</span>
                </div>
              </div>
            );
          })}

          {leaderboard.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No users on the board yet. Be the first to earn points!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}