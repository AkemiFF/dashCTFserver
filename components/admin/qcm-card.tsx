"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreVertical, Trash } from "lucide-react"
import Link from "next/link"

interface QCMCardProps {
  qcm: {
    id: string
    title: string
    theme?: string
    difficulty?: string
    points?: number
    questionCount: number
  }
  onDelete: (id: string) => void
}

export function QCMCard({ qcm, onDelete }: QCMCardProps) {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Facile":
        return "bg-green-500"
      case "Intermédiaire":
        return "bg-yellow-500"
      case "Difficile":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <Card className="overflow-hidden border border-border/50 transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{qcm.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/admin/quiz/${qcm.id}/edit`} passHref>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => onDelete(qcm.id)} className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>
          <div className="flex flex-wrap gap-2 mt-1">
            {qcm.theme && <Badge variant="outline">{qcm.theme}</Badge>}
            {qcm.difficulty && (
              <Badge className={`${getDifficultyColor(qcm.difficulty)} text-white`}>{qcm.difficulty}</Badge>
            )}
            {qcm.points !== undefined && <Badge variant="secondary">{qcm.points} points</Badge>}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {qcm.questionCount} question{qcm.questionCount !== 1 ? "s" : ""}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex justify-end w-full">
          <Link href={`/admin/quiz/${qcm.id}`} passHref>
            <Button variant="outline" size="sm">
              Voir les questions
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

