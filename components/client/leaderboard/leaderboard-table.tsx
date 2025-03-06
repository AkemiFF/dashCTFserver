"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { UserDialog } from "./user-dialog"

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

const mockUsers: User[] = [
  {
    id: "1",
    rank: 1,
    name: "CyberNinja",
    points: 12000,
    category: "S",
    completedChallenges: 145,
    successRate: 92,
    badges: ["Master Hacker", "CTF Champion", "Bug Hunter"],
    joinedDate: "2023-01-15",
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    rank: 2,
    name: "HackSorcerer",
    points: 11800,
    category: "S",
    completedChallenges: 138,
    successRate: 89,
    badges: ["Code Breaker", "CTF Champion"],
    joinedDate: "2023-03-12",
    avatar: "/placeholder.svg",
  },
  {
    id: "3",
    rank: 3,
    name: "ShadowPwner",
    points: 11500,
    category: "S",
    completedChallenges: 133,
    successRate: 88,
    badges: ["Master Exploiter", "Security Wizard"],
    joinedDate: "2023-05-20",
    avatar: "/placeholder.svg",
  },
  {
    id: "4",
    rank: 4,
    name: "RootOverlord",
    points: 11000,
    category: "S",
    completedChallenges: 120,
    successRate: 85,
    badges: ["King of Shells", "CTF Elite"],
    joinedDate: "2023-02-10",
    avatar: "/placeholder.svg",
  },
  {
    id: "5",
    rank: 5,
    name: "CryptoCrusher",
    points: 10200,
    category: "S",
    completedChallenges: 115,
    successRate: 80,
    badges: ["Cipher Specialist", "CTF Rising Star"],
    joinedDate: "2023-04-18",
    avatar: "/placeholder.svg",
  },
  {
    id: "6",
    rank: 6,
    name: "PacketHunter",
    points: 9500,
    category: "A",
    completedChallenges: 105,
    successRate: 78,
    badges: ["Network Analyst", "Challenge Seeker"],
    joinedDate: "2023-06-15",
    avatar: "/placeholder.svg",
  },
  {
    id: "7",
    rank: 7,
    name: "CodePhantom",
    points: 8500,
    category: "A",
    completedChallenges: 98,
    successRate: 75,
    badges: ["Script Master", "Bug Hunter"],
    joinedDate: "2023-07-01",
    avatar: "/placeholder.svg",
  },
  {
    id: "8",
    rank: 8,
    name: "NullPointer",
    points: 6500,
    category: "B",
    completedChallenges: 75,
    successRate: 68,
    badges: ["Debugger Pro", "CTF Rookie"],
    joinedDate: "2023-09-10",
    avatar: "/placeholder.svg",
  },
  {
    id: "9",
    rank: 9,
    name: "ExploitEagle",
    points: 5500,
    category: "B",
    completedChallenges: 70,
    successRate: 65,
    badges: ["Challenge Solver", "Security Learner"],
    joinedDate: "2023-08-20",
    avatar: "/placeholder.svg",
  },
  {
    id: "10",
    rank: 10,
    name: "BitStorm",
    points: 3800,
    category: "C",
    completedChallenges: 45,
    successRate: 50,
    badges: ["Beginner CTFer"],
    joinedDate: "2023-11-05",
    avatar: "/placeholder.svg",
  },
  {
    id: "11",
    rank: 11,
    name: "KeyBreaker",
    points: 2500,
    category: "C",
    completedChallenges: 30,
    successRate: 40,
    badges: ["CTF Explorer"],
    joinedDate: "2023-12-01",
    avatar: "/placeholder.svg",
  },
];

interface LeaderboardTableProps {
  rank: string
}

export function LeaderboardTable({ rank }: LeaderboardTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const filteredUsers = rank === "all" ? mockUsers : mockUsers.filter((user) => user.category === rank)

  return (
    <>
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-gray-400 text-sm">
          <div className="col-span-1">Rang</div>
          <div className="col-span-3">Utilisateur</div>
          <div className="col-span-2">Points</div>
          <div className="col-span-2">Défis Complétés</div>
          <div className="col-span-2">Taux de Réussite</div>
          <div className="col-span-2">Actions</div>
        </div>
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 items-center hover:bg-white/5 transition-colors"
          >
            <div className="col-span-1 font-mono text-gray-400">#{user.rank}</div>
            <div className="col-span-3 flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-white">{user.name}</div>
                <Badge
                  variant="outline"
                  className={`
                    ${user.category === "S"
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
              </div>
            </div>
            <div className="col-span-2 font-mono text-purple-400">{user.points.toLocaleString()} pts</div>
            <div className="col-span-2 text-gray-400">{user.completedChallenges}</div>
            <div className="col-span-2 text-gray-400">{user.successRate}%</div>
            <div className="col-span-2">
              <Button
                variant="ghost"
                className="hover:bg-purple-500/10 hover:text-purple-400"
                onClick={() => setSelectedUser(user)}
              >
                Voir le profil
              </Button>
            </div>
          </div>
        ))}
      </div>
      <UserDialog user={selectedUser} onClose={() => setSelectedUser(null)} />
    </>
  )
}

