import { Badge } from "@/components/ui/badge"

interface Question {
  text: string
  options: string[]
  correctAnswer: number
}

interface QuestionSummaryProps {
  question: Question
  index: number
}

export function QuestionSummary({ question, index }: QuestionSummaryProps) {
  return (
    <div className="bg-card/30 p-4 rounded-lg backdrop-blur-sm">
      <h4 className="font-semibold mb-2">Question {index + 1}</h4>
      <p className="mb-2">{question.text}</p>
      <div className="space-y-1">
        {question.options.map((option, optionIndex) => (
          <div key={optionIndex} className="flex items-center space-x-2">
            <Badge variant={optionIndex === question.correctAnswer ? "default" : "secondary"}>
              {String.fromCharCode(65 + optionIndex)}
            </Badge>
            <span>{option}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

