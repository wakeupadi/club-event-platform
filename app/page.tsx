import { DashboardHeader } from "@/components/dashboard/header"
import { EventFeed } from "@/components/dashboard/event-feed"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export const dynamic = "force-dynamic"

export default function HomePage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader points={0} />

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <EventFeed />
        </main>
      </div>
    </div>
  )
}
