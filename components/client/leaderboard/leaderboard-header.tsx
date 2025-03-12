import { Trophy } from "lucide-react"

export function LeaderboardHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-full bg-white/5 border border-white/10">
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold text-white">Global Leaderboard</h1>
      </div>
      <p className="text-gray-400 max-w-2xl">
        Les hackers éthiques sont classés en fonction de leurs points accumulés à travers les défis, CTF et parcours
        d'apprentissage. Atteignez le rang S pour rejoindre l'élite !
      </p>
    </div>
  )
}

