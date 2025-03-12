import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Calendar, Award } from "lucide-react"

interface User {
  id: string
  rank: number
  name: string
  points: number
  category: "S" | "A" | "B" | "C"
  completedChallenges: number
  successRate: number
  badges: string[]
  joinedDate: string
  avatar?: string
}

interface UserDialogProps {
  user: User | null
  onClose: () => void
}

export function UserDialog({ user, onClose }: UserDialogProps) {
  if (!user) return null

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0A1B] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Profil du Hacker</DialogTitle>
        </DialogHeader>
        <div className="space-y-8">
          {/* En-tête du profil */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className={`
                    ${
                      user.category === "S"
                        ? "text-yellow-400 border-yellow-400/20"
                        : user.category === "A"
                          ? "text-purple-400 border-purple-400/20"
                          : user.category === "B"
                            ? "text-blue-400 border-blue-400/20"
                            : "text-gray-400 border-gray-400/20"
                    }
                  `}
                >
                  Rang {user.category}
                </Badge>
                <span className="text-gray-400">#{user.rank} Global</span>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-400">Points Totaux</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">{user.points.toLocaleString()}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-gray-400">Taux de Réussite</span>
              </div>
              <div className="text-2xl font-bold text-green-400">{user.successRate}%</div>
            </div>
          </div>

          {/* Badges */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-purple-400" />
              <h3 className="font-semibold">Badges Obtenus</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge, index) => (
                <Badge key={index} variant="outline" className="border-purple-500/20 text-purple-400">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          {/* Date d'inscription */}
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Membre depuis le {new Date(user.joinedDate).toLocaleDateString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

