"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Play, Pause, RefreshCw } from "lucide-react"
import { ChallengeInfoModal } from "@/components/challenge-info-modal"

type Challenge = {
  id: number
  name: string
  status: "active" | "inactive"
  dockerStatus: "running" | "stopped"
  category: string
  difficulty: string
  points: number
}

const initialChallenges: Challenge[] = [
  {
    id: 1,
    name: "Web Exploitation 101",
    status: "active",
    dockerStatus: "running",
    category: "Web",
    difficulty: "Facile",
    points: 100,
  },
  {
    id: 2,
    name: "Cryptography Challenge",
    status: "inactive",
    dockerStatus: "stopped",
    category: "Crypto",
    difficulty: "Moyen",
    points: 200,
  },
  {
    id: 3,
    name: "Binary Exploitation",
    status: "active",
    dockerStatus: "running",
    category: "Pwn",
    difficulty: "Difficile",
    points: 300,
  },
]

export default function ChallengeManager() {
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)

  const updateChallenge = (id: number, updates: Partial<Challenge>) => {
    setChallenges(challenges.map((challenge) => (challenge.id === id ? { ...challenge, ...updates } : challenge)))
  }

  const toggleDockerStatus = (id: number) => {
    updateChallenge(id, {
      dockerStatus: challenges.find((c) => c.id === id)?.dockerStatus === "running" ? "stopped" : "running",
    })
  }

  return (
    <div className="grid gap-6">
      {challenges.map((challenge) => (
        <Card key={challenge.id} className="bg-card/50 backdrop-blur-xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">{challenge.name}</CardTitle>
            <Badge variant={challenge.status === "active" ? "default" : "secondary"}>
              {challenge.status === "active" ? "Actif" : "Inactif"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{challenge.category}</Badge>
                  <Badge variant="outline">{challenge.difficulty}</Badge>
                  <Badge variant="outline">{challenge.points} pts</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`status-${challenge.id}`}>Statut</Label>
                  <Switch
                    id={`status-${challenge.id}`}
                    checked={challenge.status === "active"}
                    onCheckedChange={(checked) =>
                      updateChallenge(challenge.id, { status: checked ? "active" : "inactive" })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="icon" onClick={() => toggleDockerStatus(challenge.id)}>
                  {challenge.dockerStatus === "running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={() => toggleDockerStatus(challenge.id)}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setSelectedChallenge(challenge)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {selectedChallenge && (
        <ChallengeInfoModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onSave={(updatedChallenge) => {
            updateChallenge(updatedChallenge.id, updatedChallenge)
            setSelectedChallenge(null)
          }}
        />
      )}
    </div>
  )
}

