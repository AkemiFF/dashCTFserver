import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ADMIN_NAME } from "@/lib/host"
import { Clock, FileText, Plus } from "lucide-react"
import Link from "next/link"

interface ModuleCardProps {
  module: {
    id: string
    title: string
    courseName?: string
    questionCount: number
    duration?: string
  }
}

export function ModuleCard({ module }: ModuleCardProps) {
  const hasQuiz = module.questionCount > 0

  return (
    <Card
      className={`overflow-hidden border transition-all duration-200 hover:shadow-md ${hasQuiz ? "border-border/50" : "border-dashed border-muted-foreground/30"
        }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{module.title}</CardTitle>
        </div>
        <CardDescription>
          <div className="flex flex-wrap gap-2 mt-1">
            {module.courseName && <Badge variant="outline">{module.courseName}</Badge>}

            {hasQuiz ? (
              <Badge variant="secondary">
                <FileText className="h-3 w-3 mr-1" />
                {module.questionCount} question{module.questionCount !== 1 ? "s" : ""}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                Pas de quiz
              </Badge>
            )}

            {module.duration && (
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {module.duration}
              </Badge>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {hasQuiz
            ? "Cliquez pour voir et gérer les questions de ce module"
            : "Ce module n'a pas encore de questions de quiz"}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex justify-end w-full">
          {hasQuiz ? (
            <Link href={`${ADMIN_NAME}/quiz/module/${module.id}`} passHref>
              <Button variant="default" size="sm">
                Voir les questions
              </Button>
            </Link>
          ) : (
            <Link href={`${ADMIN_NAME}/quiz/module/${module.id}/add`} passHref>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter des quiz
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

