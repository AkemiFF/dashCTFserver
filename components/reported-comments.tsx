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

interface ReportedComment {
  id: string
  author: string
  content: string
  postTitle: string
  reportCount: number
  timestamp: string
}

const initialReportedComments: ReportedComment[] = [
  {
    id: "1",
    author: "user1",
    content: "Commentaire inapproprié 1",
    postTitle: "Post 1",
    reportCount: 2,
    timestamp: "2023-05-22T09:15:00Z",
  },
  {
    id: "2",
    author: "user2",
    content: "Commentaire inapproprié 2",
    postTitle: "Post 2",
    reportCount: 4,
    timestamp: "2023-05-23T16:30:00Z",
  },
]

export function ReportedComments() {
  const [reportedComments, setReportedComments] = useState<ReportedComment[]>(initialReportedComments)

  const handleDelete = (id: string) => {
    setReportedComments(reportedComments.filter((comment) => comment.id !== id))
  }

  const handleIgnore = (id: string) => {
    setReportedComments(reportedComments.filter((comment) => comment.id !== id))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Auteur</TableHead>
          <TableHead>Contenu</TableHead>
          <TableHead>Publication</TableHead>
          <TableHead>Nombre de signalements</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reportedComments.map((comment) => (
          <TableRow key={comment.id}>
            <TableCell>{comment.author}</TableCell>
            <TableCell>{comment.content}</TableCell>
            <TableCell>{comment.postTitle}</TableCell>
            <TableCell>{comment.reportCount}</TableCell>
            <TableCell>{new Date(comment.timestamp).toLocaleString()}</TableCell>
            <TableCell>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="mr-2">
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce commentaire ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action ne peut pas être annulée. Le commentaire sera définitivement supprimé.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(comment.id)}>Supprimer</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" size="sm" onClick={() => handleIgnore(comment.id)}>
                Ignorer
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

