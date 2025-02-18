"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Challenge = {
  id: number
  name: string
  status: "active" | "inactive"
  dockerStatus: "running" | "stopped"
  category: string
  difficulty: string
  points: number
  port?: number
  flag?: string
}

interface ChallengeInfoModalProps {
  challenge: Challenge
  onClose: () => void
  onSave: (updatedChallenge: Challenge) => void
}

export function ChallengeInfoModal({ challenge, onClose, onSave }: ChallengeInfoModalProps) {
  const [editedChallenge, setEditedChallenge] = useState<Challenge>(challenge)

  const handleChange = (field: keyof Challenge, value: string | number) => {
    setEditedChallenge((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(editedChallenge)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Informations du défi</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Titre
            </Label>
            <Input
              id="name"
              value={editedChallenge.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Catégorie
            </Label>
            <Select value={editedChallenge.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Web">Web</SelectItem>
                <SelectItem value="Crypto">Crypto</SelectItem>
                <SelectItem value="Pwn">Pwn</SelectItem>
                <SelectItem value="Reverse">Reverse</SelectItem>
                <SelectItem value="Forensics">Forensics</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="difficulty" className="text-right">
              Difficulté
            </Label>
            <Select value={editedChallenge.difficulty} onValueChange={(value) => handleChange("difficulty", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner une difficulté" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Facile">Facile</SelectItem>
                <SelectItem value="Moyen">Moyen</SelectItem>
                <SelectItem value="Difficile">Difficile</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="points" className="text-right">
              Points
            </Label>
            <Input
              id="points"
              type="number"
              value={editedChallenge.points}
              onChange={(e) => handleChange("points", Number.parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="port" className="text-right">
              Port
            </Label>
            <Input
              id="port"
              type="number"
              value={editedChallenge.port || ""}
              onChange={(e) => handleChange("port", Number.parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="flag" className="text-right">
              Flag
            </Label>
            <Input
              id="flag"
              value={editedChallenge.flag || ""}
              onChange={(e) => handleChange("flag", e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

