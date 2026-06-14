import { CalendarDays } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { UpcomingEvent } from "@/lib/mock-events"

type EventCardProps = {
  event: UpcomingEvent
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card>
      <CardHeader>
        <Badge variant="outline" className="w-fit">
          {event.clubName}
        </Badge>
        <CardTitle className="mt-2">{event.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="size-4 shrink-0" />
          <span>{event.date}</span>
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <Button>Register</Button>
      </CardFooter>
    </Card>
  )
}
