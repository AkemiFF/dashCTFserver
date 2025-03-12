"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, UserMinus, Code, User, Filter } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Types for friends data
interface Skill {
  name: string
  level: "beginner" | "intermediate" | "advanced" | "expert"
}

interface Friend {
  id: string
  name: string
  username: string
  avatar: string
  title: string
  mutualFriends: number
  skills: Skill[]
  online: boolean
  lastActive?: string
}

// Sample friends data
const friendsData: Friend[] = [
  {
    id: "1",
    name: "Marie Dubois",
    username: "m_dubois",
    avatar: "/placeholder.svg?height=50&width=50",
    title: "Full Stack Developer",
    mutualFriends: 12,
    skills: [
      { name: "React", level: "expert" },
      { name: "Node.js", level: "advanced" },
      { name: "TypeScript", level: "advanced" },
    ],
    online: true,
  },
  {
    id: "2",
    name: "Thomas Lefèvre",
    username: "tlefevre",
    avatar: "/placeholder.svg?height=50&width=50",
    title: "Security Researcher",
    mutualFriends: 4,
    skills: [
      { name: "Penetration Testing", level: "expert" },
      { name: "Python", level: "advanced" },
      { name: "Cryptography", level: "intermediate" },
    ],
    online: false,
    lastActive: "il y a 2h",
  },
  {
    id: "3",
    name: "Emma Martin",
    username: "emma_dev",
    avatar: "/placeholder.svg?height=50&width=50",
    title: "DevOps Engineer",
    mutualFriends: 8,
    skills: [
      { name: "Docker", level: "expert" },
      { name: "Kubernetes", level: "advanced" },
      { name: "Terraform", level: "advanced" },
    ],
    online: true,
  },
  {
    id: "4",
    name: "Lucas Moreau",
    username: "lmoreau",
    avatar: "/placeholder.svg?height=50&width=50",
    title: "Mobile Developer",
    mutualFriends: 3,
    skills: [
      { name: "React Native", level: "expert" },
      { name: "Swift", level: "intermediate" },
      { name: "Kotlin", level: "intermediate" },
    ],
    online: false,
    lastActive: "il y a 1j",
  },
  {
    id: "5",
    name: "Chloé Petit",
    username: "chloepetit",
    avatar: "/placeholder.svg?height=50&width=50",
    title: "Data Scientist",
    mutualFriends: 6,
    skills: [
      { name: "Python", level: "expert" },
      { name: "TensorFlow", level: "advanced" },
      { name: "SQL", level: "intermediate" },
    ],
    online: true,
  },
]

// Function to get color for skill level
const getSkillLevelColor = (level: string) => {
  switch (level) {
    case "beginner":
      return "bg-blue-500"
    case "intermediate":
      return "bg-green-500"
    case "advanced":
      return "bg-yellow-500"
    case "expert":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export function FriendsList({ searchQuery = "" }: { searchQuery: string }) {
  const [filter, setFilter] = useState<string>("all")

  // Filter friends based on search query and filter
  const filteredFriends = friendsData.filter((friend) => {
    const matchesSearch =
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.skills.some((skill) => skill.name.toLowerCase().includes(searchQuery.toLowerCase()))

    if (filter === "online") {
      return matchesSearch && friend.online
    }

    return matchesSearch
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Mes amis ({filteredFriends.length})</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Filter className="h-4 w-4 mr-2" /> Filtrer
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilter("all")}>Tous</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("online")}>En ligne uniquement</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredFriends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFriends.map((friend, index) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border-2 border-white/20">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {friend.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-navy-950" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/profile/${friend.username}`} className="hover:underline">
                            <h3 className="font-medium text-white">{friend.name}</h3>
                          </Link>
                          <p className="text-sm text-white/60">@{friend.username}</p>
                          <p className="text-sm text-white/80 mt-1">{friend.title}</p>
                        </div>

                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/5">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/5">
                                <User className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Link href={`/profile/${friend.username}`} className="flex w-full">
                                  Voir le profil
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">
                                <UserMinus className="h-4 w-4 mr-2" /> Retirer des amis
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {friend.skills.map((skill) => (
                          <Badge
                            key={skill.name}
                            variant="outline"
                            className={`${getSkillLevelColor(skill.level)} bg-opacity-20 border-none text-xs font-normal`}
                          >
                            <Code className="h-3 w-3 mr-1" />
                            {skill.name}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-2 text-xs text-white/50">
                        {friend.mutualFriends} amis en commun •{" "}
                        {friend.online ? "En ligne" : `Actif ${friend.lastActive}`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/5 rounded-lg backdrop-blur-sm">
          <p className="text-white/70">Aucun ami trouvé pour cette recherche</p>
        </div>
      )}
    </div>
  )
}

