"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BannedKeyword {
  id: string
  keyword: string
  addedBy: string
  timestamp: string
}

const initialBannedKeywords: BannedKeyword[] = [
  { id: "1", keyword: "spam", addedBy: "admin1", timestamp: "2023-05-24T11:00:00Z" },
  { id: "2", keyword: "offensive", addedBy: "admin2", timestamp: "2023-05-25T13:30:00Z" },
]

export function BannedKeywords() {
  const [bannedKeywords, setBannedKeywords] = useState<BannedKeyword[]>(initialBannedKeywords)
  const [newKeyword, setNewKeyword] = useState("")

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      const newBannedKeyword: BannedKeyword = {
        id: Date.now().toString(),
        keyword: newKeyword.trim(),
        addedBy: "currentAdmin", // Remplacez par l'identifiant de l'administrateur actuel
        timestamp: new Date().toISOString(),
      }
      setBannedKeywords([...bannedKeywords, newBannedKeyword])
      setNewKeyword("")
    }
  }

  const handleDelete = (id: string) => {
    setBannedKeywords(bannedKeywords.filter((keyword) => keyword.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Nouveau mot-clé interdit"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
        />
        <Button onClick={handleAddKeyword}>Ajouter</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mot-clé</TableHead>
            <TableHead>Ajouté par</TableHead>
            <TableHead>Date d'ajout</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bannedKeywords.map((keyword) => (
            <TableRow key={keyword.id}>
              <TableCell>{keyword.keyword}</TableCell>
              <TableCell>{keyword.addedBy}</TableCell>
              <TableCell>{new Date(keyword.timestamp).toLocaleString()}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce mot-clé interdit ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action ne peut pas être annulée. Le mot-clé sera retiré de la liste des mots interdits.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(keyword.id)}>Supprimer</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

