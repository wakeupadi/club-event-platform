import { DashboardHeader } from "@/components/dashboard/header"
import { EventFeed } from "@/components/dashboard/event-feed"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { prisma } from "@/lib/prisma" // 1. Import Prisma

export const dynamic = "force-dynamic"

export default async function HomePage() {
  // 2. Fetch the current user's live points
  const currentUser = await prisma.user.findUnique({
    where: { id: "test-user-1" },
    select: { points: true }
  });
  
  // Default to 0 if the user hasn't been created yet
  const livePoints = currentUser?.points || 0;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* 3. Pass the dynamic points into the Header */}
        <DashboardHeader points={livePoints} />

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <EventFeed />
        </main>
      </div>
    </div>
  )
}