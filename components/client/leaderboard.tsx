import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy } from "lucide-react"

export function Leaderboard() {
  const topUsers = [
    { name: "CyberNinja", points: 15000, rank: 1 },
    { name: "HackMaster", points: 14500, rank: 2 },
    { name: "SecurityPro", points: 14000, rank: 3 },
    { name: "EthicalHacker", points: 13500, rank: 4 },
    { name: "ByteWarrior", points: 13000, rank: 5 },
  ]

  return (
    <section className="py-20 px-4 bg-black/20">
      <div className="container mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h2 className="text-3xl font-bold text-white">Top Hackers</h2>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          {topUsers.map((user, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 ${
                index !== topUsers.length - 1 ? "border-b border-white/10" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-gray-400 w-8">{user.rank}</div>
                <Avatar>
                  <AvatarImage src={`/placeholder.svg?text=${user.name[0]}`} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="font-semibold text-white">{user.name}</div>
              </div>
              <div className="text-purple-400 font-mono">{user.points.toLocaleString()} pts</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

