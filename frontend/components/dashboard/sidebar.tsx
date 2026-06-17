"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, LayoutDashboard, Trophy, Users, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"

type DashboardSidebarProps = {
  role?: "student" | "club";
};

export function DashboardSidebar({ role = "student" }: DashboardSidebarProps) {
  const pathname = usePathname()

  const navItems = role === "club"
    ? [
        { label: "Timeline", href: "/", icon: LayoutDashboard },
        { label: "Create Event", href: "/create", icon: PlusCircle },
        { label: "Campus Clubs", href: "/clubs", icon: Users },
      ]
    : [
        { label: "Timeline", href: "/", icon: LayoutDashboard },
        { label: "My Schedule", href: "/my-events", icon: CalendarDays },
        { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
      ];

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
        {navItems.map(({ label, href, icon: Icon }) => {
          // 3. Dynamically check if this button matches the current URL
          const isActive = pathname === href

          return (
            // 4. Using Next.js <Link> instead of <button> for instant, no-reload navigation
            <Link
              key={label}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}