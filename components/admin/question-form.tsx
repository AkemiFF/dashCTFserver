"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Question {
  text: string
  options: string[]
  correctAnswer: number
  timeLimit: number
}

interface QuestionFormProps {
  onAddQuestion: (question: Question) => void
  isStandalone?: boolean
}

export function QuestionForm({ onAddQuestion, isStandalone }: QuestionFormProps) {
  const [question, setQuestion] = useState<Question>({
    text: "",
    options: ["", ""],
    correctAnswer: 0,
    timeLimit: 30,
  })

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion((prev) => ({ ...prev, text: e.target.value }))
  }

  const handleOptionChange = (index: number, value: string) => {
    setQuestion((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? value : opt)),
    }))
  }

  const handleCorrectAnswerChange = (value: string) => {
    setQuestion((prev) => ({ ...prev, correctAnswer: Number.parseInt(value) }))
  }

  const handleTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion((prev) => ({ ...prev, timeLimit: Number.parseInt(e.target.value) }))
  }

  const addOption = () => {
    if (question.options.length < 5) {
      setQuestion((prev) => ({ ...prev, options: [...prev.options, ""] }))
    }
  }

  const removeOption = (index: number) => {
    if (question.options.length > 2) {
      setQuestion((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
        correctAnswer: prev.correctAnswer >= index ? prev.correctAnswer - 1 : prev.correctAnswer,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()
    onAddQuestion(question)
    setQuestion({ text: "", options: ["", ""], correctAnswer: 0, timeLimit: 30 })
  }

  const formContent = (
    <>
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          value={question.text}
          onChange={handleQuestionChange}
          required
          className="bg-background/50"
        />
      </div>
      <div className="space-y-2">
        <Label>Options</Label>
        <RadioGroup
          value={question.correctAnswer.toString()}
          onValueChange={handleCorrectAnswerChange}
          className="space-y-2"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
                className="flex-grow bg-background/50"
              />
              {index > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index)}>
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </RadioGroup>
        {question.options.length < 5 && (
          <Button type="button" variant="outline" onClick={addOption} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une option
          </Button>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="timeLimit" className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Limite de temps (secondes)
        </Label>
        <Input
          id="timeLimit"
          type="number"
          value={question.timeLimit}
          onChange={handleTimeLimitChange}
          required
          min={1}
          className="bg-background/50"
        />
      </div>
    </>
  )

  return (
    <Card className="bg-card/30 backdrop-blur-sm border-dashed">
      <CardHeader>
        <CardTitle className="text-xl">Ajouter une nouvelle question</CardTitle>
      </CardHeader>
      <CardContent>
        {isStandalone ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {formContent}
          </form>
        ) : (
          <div className="space-y-4">
            {formContent}
            <Button onClick={handleSubmit} className="w-full">
              Ajouter la question
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

