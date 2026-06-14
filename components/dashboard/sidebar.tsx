import { CalendarDays, LayoutDashboard, Trophy, Users } from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { label: "Timeline", icon: LayoutDashboard, active: true },
  { label: "My Events", icon: CalendarDays, active: false },
  { label: "Clubs", icon: Users, active: false },
  { label: "Leaderboard", icon: Trophy, active: false },
]

export function DashboardSidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="border-b border-sidebar-border px-5 py-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Campus Events
        </p>
        <h1 className="mt-1 font-heading text-lg font-semibold text-sidebar-foreground">
          EventHub
        </h1>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
