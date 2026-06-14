import { Badge } from "@/components/ui/badge"

type DashboardHeaderProps = {
  points?: number
}

export function DashboardHeader({ points = 0 }: DashboardHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-sm">
      <div>
        <h2 className="font-heading text-base font-semibold">Event Timeline</h2>
        <p className="text-xs text-muted-foreground">
          Upcoming campus events from student clubs
        </p>
      </div>

      <Badge variant="secondary" className="h-7 px-3 text-sm">
        Points: {points}
      </Badge>
    </header>
  )
}
