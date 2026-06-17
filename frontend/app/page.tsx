import { EventFeed } from "@/components/dashboard/event-feed"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  return (
    <div className="px-6 py-6 max-w-4xl mx-auto w-full">
      <EventFeed />
    </div>
  )
}