"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Code, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"

// Types for request data
interface Skill {
  name: string
  level: "beginner" | "intermediate" | "advanced" | "expert"
}

interface FriendRequest {
  id: string
  name: string
  username: string
  avatar: string
  title: string
  mutualFriends: number
  skills: Skill[]
  requestTime: string
  type: "incoming" | "outgoing"
}

// Sample friend requests data
const requestsData: FriendRequest[] = [
  {
    id: "1",
    name: "Sophie Laurent",
    username: "sophie_l",
    avatar: "/placeholder.svg?height=50&width=50",
    title: "Frontend Developer",
    mutualFriends: 8,
    skills: [
      { name: "React", level: "advanced" },
      { name: "CSS", level: "expert" },
      { name: "UI/UX", level: "advanced" },
    ],
    requestTime: "il y a 2h",
    type: "incoming",
  },
  {
    id: "2",
    name: "Gabriel Rousseau",
    username: "g_rousseau",
    avatar: "/placeholder.svg?height=50&width=50",
    title: "Cyber Security Specialist",
    mutualFriends: 3,
    skills: [
      { name: "Network Security", level: "expert" },
      { name: "Ethical Hacking", level: "advanced" },
      { name: "OSINT", level: "intermediate" },
    ],
    requestTime: "il y a 1j",
    type: "incoming",
  },
  {
    id: "3",
    name: "Léa Mercier",
    username: "lea_m",
    avatar: "/placeholder.svg?height=50&width=50",
    title: "Backend Developer",
    mutualFriends: 5,
    skills: [
      { name: "Node.js", level: "advanced" },
      { name: "MongoDB", level: "expert" },
      { name: "API Design", level: "advanced" },
    ],
    requestTime: "il y a 3j",
    type: "outgoing",
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

export function FriendRequests() {
  const incomingRequests = requestsData.filter((request) => request.type === "incoming")
  const outgoingRequests = requestsData.filter((request) => request.type === "outgoing")

  return (
    <div>
      {/* Incoming Requests */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Demandes reçues ({incomingRequests.length})</h2>

        {incomingRequests.length > 0 ? (
          <div className="space-y-4">
            {incomingRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 border-2 border-white/20">
                        <AvatarImage src={request.avatar} alt={request.name} />
                        <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href={`/profile/${request.username}`} className="hover:underline">
                              <h3 className="font-medium text-white">{request.name}</h3>
                            </Link>
                            <p className="text-sm text-white/60">@{request.username}</p>
                            <p className="text-sm text-white/80 mt-1">{request.title}</p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" /> Accepter
                            </Button>
                            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/10">
                              <XCircle className="h-4 w-4 mr-1" /> Refuser
                            </Button>
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {request.skills.map((skill) => (
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
                          {request.mutualFriends} amis en commun • Demande envoyée {request.requestTime}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white/5 rounded-lg backdrop-blur-sm">
            <p className="text-white/70">Vous n'avez pas de nouvelles demandes d'amitié</p>
          </div>
        )}
      </div>

      {/* Outgoing Requests */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Demandes envoyées ({outgoingRequests.length})</h2>

        {outgoingRequests.length > 0 ? (
          <div className="space-y-4">
            {outgoingRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 border-2 border-white/20">
                        <AvatarImage src={request.avatar} alt={request.name} />
                        <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href={`/profile/${request.username}`} className="hover:underline">
                              <h3 className="font-medium text-white">{request.name}</h3>
                            </Link>
                            <p className="text-sm text-white/60">@{request.username}</p>
                            <p className="text-sm text-white/80 mt-1">{request.title}</p>
                          </div>

                          <div>
                            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/10">
                              <XCircle className="h-4 w-4 mr-1" /> Annuler
                            </Button>
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {request.skills.map((skill) => (
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

                        <div className="mt-2 flex items-center text-xs text-white/50">
                          <Clock className="h-3 w-3 mr-1" />
                          En attente depuis {request.requestTime}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white/5 rounded-lg backdrop-blur-sm">
            <p className="text-white/70">Vous n'avez pas de demandes d'amitié en attente</p>
          </div>
        )}
      </div>
    </div>
  )
}

