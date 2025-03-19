"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Edit, Trash } from "lucide-react"

interface QuestionSummaryProps {
  question: {
    id?: string
    question: string
    type: "multiple-choice" | "open-ended"
    options?: { text: string; is_correct?: boolean }[]
  }
  index: number
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function QuestionSummary({ question, index, onEdit, onDelete }: QuestionSummaryProps) {
  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Question {index + 1}</CardTitle>
        {question.id && (
          <div className="flex space-x-2">
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={() => onEdit(question.id!)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={() => onDelete(question.id!)}>
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="mb-4">{question.question}</p>
        {question.type === "multiple-choice" && question.options && (
          <div className="space-y-2">
            {question.options.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                {option.is_correct && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
                <span className={option.is_correct ? "font-medium" : ""}>{option.text}</span>
              </div>
            ))}
          </div>
        )}
        {question.type === "open-ended" && (
          <div className="text-muted-foreground italic">Question à réponse ouverte</div>
        )}
      </CardContent>
    </Card>
  )
}

