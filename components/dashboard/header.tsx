import { Badge } from "@/components/ui/badge"
import { ClubSelector } from "@/components/dashboard/club-selector"
import { UserSelector } from "@/components/dashboard/user-selector"
import { RoleSwitcher } from "@/components/dashboard/role-switcher"
import { getActiveRole } from "@/lib/auth"

type DashboardHeaderProps = {
  points?: number
}

export async function DashboardHeader({ points = 0 }: DashboardHeaderProps) {
  const role = await getActiveRole();

  return (
    <header className="print:hidden flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 bg-[#09090b]/80 px-6 backdrop-blur-sm">
      <div>
        <h2 className="font-heading text-base font-semibold text-zinc-100">
          {role === "club" ? "Club Portal" : "Event Timeline"}
        </h2>
        <p className="text-xs text-zinc-400">
          {role === "club" 
            ? "Manage your hosting events, registrations, and collaborations" 
            : "Upcoming campus events from student clubs"}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <RoleSwitcher initialRole={role} />
        {role === "club" ? <ClubSelector /> : <UserSelector />}
        {role === "student" && (
          <Badge variant="secondary" className="h-9 px-4 text-sm font-semibold rounded-lg bg-zinc-900 text-zinc-100 border border-zinc-800 hover:bg-zinc-800 transition-colors">
            Points: {points}
          </Badge>
        )}
      </div>
    </header>
  )
}
