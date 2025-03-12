"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Code, UserPlus, Filter, Users } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Types for suggestion data
interface Skill {
  name: string
  level: "beginner" | "intermediate" | "advanced" | "expert"
}

interface SuggestedUser {
  id: string
  name: string
  username: string
  avatar: string
  title: string
  mutualFriends: number
  skills: Skill[]
  matchScore: number
  reason: string
}

// Sample suggestions data
const suggestionsData: SuggestedUser[] = [
  {
    id: "1",
    name: "Julien Blanc",
    username: "j_blanc",
    avatar: "/placeholder.svg?height=50&width=50",
    title: "Pentester & Bug Hunter",
    mutualFriends: 15,
    skills: [
      { name: "Penetration Testing", level: "expert" },
      { name: "Web Security", level: "expert" },
      { name: "Bug Bounty", level: "advanced" },
    ],
    matchScore: 95,
    reason: "Compétences similaires en cybersécurité",
  },
  {
    id: "2",
    name: "Charlotte Dupont",
    username: "c_dupont",
    avatar: "/placeholder.svg?height=50&width=50",
    title: "Blockchain Developer",
    mutualFriends: 7,
    skills: [
      { name: "Solidity", level: "expert" },
      { name: "Ethereum", level: "advanced" },
      { name: "Smart Contracts", level: "advanced" },
    ],
    matchScore: 88,
    reason: "Participé aux mêmes hackathons",
  },
  {
    id: "3",
    name: "Antoine Renard",
    username: "a_renard",
    avatar: "/placeholder.svg?height=50&width=50",
    title: "ML Engineer",
    mutualFriends: 4,
    skills: [
      { name: "TensorFlow", level: "expert" },
      { name: "Python", level: "expert" },
      { name: "Data Science", level: "advanced" },
    ],
    matchScore: 82,
    reason: "Intérêts communs en IA et machine learning",
  },
  {
    id: "4",
    name: "Lisa Moreau",
    username: "lisa_m",
    avatar: "/placeholder.svg?height=50&width=50",
    title: "DevOps Engineer",
    mutualFriends: 9,
    skills: [
      { name: "Kubernetes", level: "expert" },
      { name: "Docker", level: "expert" },
      { name: "CI/CD", level: "advanced" },
    ],
    matchScore: 79,
    reason: "A travaillé dans les mêmes entreprises",
  },
  {
    id: "5",
    name: "Olivier Girard",
    username: "olive_dev",
    avatar: "/placeholder.svg?height=50&width=50",
    title: "Game Developer",
    mutualFriends: 3,
    skills: [
      { name: "Unity", level: "advanced" },
      { name: "C#", level: "expert" },
      { name: "3D Modeling", level: "intermediate" },
    ],
    matchScore: 75,
    reason: "Membre du même groupe de développeurs",
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

// Function to get color for match score
const getMatchScoreColor = (score: number) => {
  if (score >= 90) return "text-green-400"
  if (score >= 80) return "text-yellow-400"
  if (score >= 70) return "text-orange-400"
  return "text-gray-400"
}

export function FriendSuggestions({ searchQuery = "" }: { searchQuery: string }) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [minMatchScore, setMinMatchScore] = useState(0)

  // All unique skills from the suggestions
  const allSkills = Array.from(
    new Set(suggestionsData.flatMap((user) => user.skills.map((skill) => skill.name))),
  ).sort()

  // Toggle skill selection
  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  // Filter suggestions based on search query and filters
  const filteredSuggestions = suggestionsData.filter((user) => {
    // Text search filter
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.skills.some((skill) => skill.name.toLowerCase().includes(searchQuery.toLowerCase()))

    // Skills filter - if no skills selected, don't filter by skills
    const matchesSkills =
      selectedSkills.length === 0 || user.skills.some((skill) => selectedSkills.includes(skill.name))

    // Match score filter
    const matchesScore = user.matchScore >= minMatchScore

    return matchesSearch && matchesSkills && matchesScore
  })

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl font-semibold">Suggestions ({filteredSuggestions.length})</h2>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                <Code className="h-4 w-4 mr-2" />
                {selectedSkills.length > 0 ? `${selectedSkills.length} compétences` : "Compétences"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto">
              <div className="p-2">
                <div className="grid grid-cols-1 gap-2">
                  {allSkills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={`skill-${skill}`}
                        checked={selectedSkills.includes(skill)}
                        onCheckedChange={() => toggleSkill(skill)}
                      />
                      <label
                        htmlFor={`skill-${skill}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSelectedSkills([])}>Réinitialiser</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                <Filter className="h-4 w-4 mr-2" /> Filtrer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setMinMatchScore(0)}>Tous</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMinMatchScore(80)}>Match &gt; 80%</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMinMatchScore(90)}>Match &gt; 90%</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Suggestions list */}
      {filteredSuggestions.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredSuggestions.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border-2 border-white/20">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/profile/${user.username}`} className="hover:underline">
                            <h3 className="font-medium text-white">{user.name}</h3>
                          </Link>
                          <p className="text-sm text-white/60">@{user.username}</p>
                          <p className="text-sm text-white/80 mt-1">{user.title}</p>

                          <div className="mt-1 text-xs">
                            <span className={`font-medium ${getMatchScoreColor(user.matchScore)}`}>
                              {user.matchScore}% de compatibilité
                            </span>
                            <span className="text-white/50 ml-2">• {user.reason}</span>
                          </div>
                        </div>

                        <div>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                          >
                            <UserPlus className="h-4 w-4 mr-1" /> Ajouter
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {user.skills.map((skill) => (
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
                        <Users className="h-3 w-3 mr-1" />
                        {user.mutualFriends} amis en commun
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
          <p className="text-white/70">Aucune suggestion trouvée pour ces critères</p>
        </div>
      )}
    </div>
  )
}

