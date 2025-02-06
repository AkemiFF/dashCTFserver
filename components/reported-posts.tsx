"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
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

interface ReportedPost {
  id: string
  author: string
  content: string
  reportCount: number
  timestamp: string
}

const initialReportedPosts: ReportedPost[] = [
  { id: "1", author: "user1", content: "Contenu inapproprié 1", reportCount: 3, timestamp: "2023-05-20T10:30:00Z" },
  { id: "2", author: "user2", content: "Contenu inapproprié 2", reportCount: 5, timestamp: "2023-05-21T14:45:00Z" },
]

export function ReportedPosts() {
  const [reportedPosts, setReportedPosts] = useState<ReportedPost[]>(initialReportedPosts)

  const handleDelete = (id: string) => {
    setReportedPosts(reportedPosts.filter((post) => post.id !== id))
  }

  const handleIgnore = (id: string) => {
    setReportedPosts(reportedPosts.filter((post) => post.id !== id))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Auteur</TableHead>
          <TableHead>Contenu</TableHead>
          <TableHead>Nombre de signalements</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reportedPosts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.author}</TableCell>
            <TableCell>{post.content}</TableCell>
            <TableCell>{post.reportCount}</TableCell>
            <TableCell>{new Date(post.timestamp).toLocaleString()}</TableCell>
            <TableCell>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="mr-2">
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette publication ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action ne peut pas être annulée. La publication sera définitivement supprimée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(post.id)}>Supprimer</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" size="sm" onClick={() => handleIgnore(post.id)}>
                Ignorer
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

