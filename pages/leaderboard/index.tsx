import { LeaderboardHeader } from "@/components/client/leaderboard/leaderboard-header"
import { LeaderboardTabs } from "@/components/client/leaderboard/leaderboard-tabs"

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A1B] via-[#0F1C3F] to-[#0A0A1B]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />

        <div className="container mx-auto px-4 py-20">
          <LeaderboardHeader />

          <div className="grid grid-cols-1 gap-8">
            <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 p-6">
              <LeaderboardTabs />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

