"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

type DockerChallenge = {
  id: number
  name: string
  description: string
  level: "beginner" | "intermediate" | "advanced"
  status: "active" | "inactive"
  dockerStatus: "running" | "stopped"
  flag: string
  port: number
  ipAddress: string
}

const initialChallenges: DockerChallenge[] = [
  {
    id: 1,
    name: "Web Exploitation 101",
    description: "A basic web exploitation challenge",
    level: "beginner",
    status: "active",
    dockerStatus: "running",
    flag: "CTF{web_101}",
    port: 8080,
    ipAddress: "172.17.0.2",
  },
  {
    id: 2,
    name: "Advanced Cryptography",
    description: "An advanced cryptography challenge",
    level: "advanced",
    status: "inactive",
    dockerStatus: "stopped",
    flag: "CTF{crypto_master}",
    port: 8081,
    ipAddress: "172.17.0.3",
  },
]

export default function DockerChallengeManager() {
  const [challenges, setChallenges] = useState<DockerChallenge[]>(initialChallenges)

  const updateChallenge = (id: number, updates: Partial<DockerChallenge>) => {
    setChallenges(challenges.map((challenge) => (challenge.id === id ? { ...challenge, ...updates } : challenge)))
  }

  const handleDockerAction = (id: number, action: "start" | "stop" | "restart") => {
    // Here you would typically call an API to perform the Docker action
    console.log(`${action} container for challenge ${id}`)
    if (action === "stop") {
      updateChallenge(id, { dockerStatus: "stopped" })
    } else {
      updateChallenge(id, { dockerStatus: "running" })
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-6 animate-glitch">Gestion des Défis Docker</h2>
      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          className="p-6 border-2 border-hack-green rounded-lg space-y-4 bg-hack-gray pixelated-border"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{challenge.name}</h3>
            <Switch
              checked={challenge.status === "active"}
              onCheckedChange={(checked) => updateChallenge(challenge.id, { status: checked ? "active" : "inactive" })}
              className="data-[state=checked]:bg-hack-green data-[state=unchecked]:bg-hack-darkGreen"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`level-${challenge.id}`} className="text-hack-green">
                Niveau
              </Label>
              <Select
                value={challenge.level}
                onValueChange={(value: "beginner" | "intermediate" | "advanced") =>
                  updateChallenge(challenge.id, { level: value })
                }
              >
                <SelectTrigger id={`level-${challenge.id}`} className="bg-hack-black border-hack-green text-hack-green">
                  <SelectValue placeholder="Sélectionner le niveau" />
                </SelectTrigger>
                <SelectContent className="bg-hack-black border-hack-green">
                  <SelectItem value="beginner" className="text-hack-green">
                    Débutant
                  </SelectItem>
                  <SelectItem value="intermediate" className="text-hack-green">
                    Intermédiaire
                  </SelectItem>
                  <SelectItem value="advanced" className="text-hack-green">
                    Avancé
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor={`docker-status-${challenge.id}`} className="text-hack-green">
                Statut Docker
              </Label>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${challenge.dockerStatus === "running" ? "bg-green-500" : "bg-red-500"}`}
                ></span>
                <span>{challenge.dockerStatus === "running" ? "En cours" : "Arrêté"}</span>
              </div>
            </div>
            <div>
              <Label htmlFor={`flag-${challenge.id}`} className="text-hack-green">
                Flag
              </Label>
              <Input
                id={`flag-${challenge.id}`}
                value={challenge.flag}
                onChange={(e) => updateChallenge(challenge.id, { flag: e.target.value })}
                className="bg-hack-black border-hack-green text-hack-green"
              />
            </div>
            <div>
              <Label htmlFor={`port-${challenge.id}`} className="text-hack-green">
                Port
              </Label>
              <Input
                id={`port-${challenge.id}`}
                type="number"
                value={challenge.port}
                onChange={(e) => updateChallenge(challenge.id, { port: Number.parseInt(e.target.value) })}
                className="bg-hack-black border-hack-green text-hack-green"
              />
            </div>
          </div>
          <div>
            <Label htmlFor={`description-${challenge.id}`} className="text-hack-green">
              Description
            </Label>
            <Textarea
              id={`description-${challenge.id}`}
              value={challenge.description}
              onChange={(e) => updateChallenge(challenge.id, { description: e.target.value })}
              className="bg-hack-black border-hack-green text-hack-green"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => handleDockerAction(challenge.id, "start")}
              className="bg-hack-black text-hack-green border-hack-green hover:bg-hack-darkGreen"
              disabled={challenge.dockerStatus === "running"}
            >
              Démarrer
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDockerAction(challenge.id, "stop")}
              className="bg-hack-black text-hack-green border-hack-green hover:bg-hack-darkGreen"
              disabled={challenge.dockerStatus === "stopped"}
            >
              Arrêter
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDockerAction(challenge.id, "restart")}
              className="bg-hack-black text-hack-green border-hack-green hover:bg-hack-darkGreen"
            >
              Redémarrer
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

