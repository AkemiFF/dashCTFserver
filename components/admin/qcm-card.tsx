import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

interface QCM {
  id: string
  title: string
  theme: string
  difficulty: string
  points: number
  questionCount: number
}

interface QCMCardProps {
  qcm: QCM
  onDelete: (id: string) => void
}

export function QCMCard({ qcm, onDelete }: QCMCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{qcm.title}</span>
          <Badge>{qcm.theme}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <span>Difficulté: {qcm.difficulty}</span>
          <span>{qcm.points} points</span>
        </div>
        <p className="text-sm">{qcm.questionCount} questions</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/qcm-editor/${qcm.id}`}>
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </Link>
        <Button variant="destructive" size="sm" onClick={() => onDelete(qcm.id)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  )
}

