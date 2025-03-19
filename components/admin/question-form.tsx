"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Trash2 } from "lucide-react"
import { useState } from "react"

interface QuestionFormProps {
  onAddQuestion: (question: {
    question: string
    type: "multiple-choice" | "open-ended"
    order: number
    options: { text: string; is_correct: boolean }[]
  }) => void
  isStandalone?: boolean
  initialData?: {
    question: string
    type: "multiple-choice" | "open-ended"
    order: number
    options: { text: string; is_correct: boolean }[]
  }
  moduleId?: string
}

export function QuestionForm({ onAddQuestion, isStandalone = true, initialData, moduleId }: QuestionFormProps) {
  const [questionData, setQuestionData] = useState(
    initialData || {
      question: "",
      type: "multiple-choice" as const,
      order: 0,
      options: [
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ],
    },
  )

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuestionData((prev) => ({ ...prev, question: e.target.value }))
  }

  const handleTypeChange = (value: "multiple-choice" | "open-ended") => {
    setQuestionData((prev) => ({ ...prev, type: value }))
  }

  const handleOptionChange = (index: number, value: string) => {
    setQuestionData((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? { ...opt, text: value } : opt)),
    }))
  }

  const handleCorrectChange = (index: number, checked: boolean) => {
    setQuestionData((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? { ...opt, is_correct: checked } : opt)),
    }))
  }

  const addOption = () => {
    setQuestionData((prev) => ({
      ...prev,
      options: [...prev.options, { text: "", is_correct: false }],
    }))
  }

  const removeOption = (index: number) => {
    if (questionData.options.length <= 2) return // Minimum 2 options
    setQuestionData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!questionData.question.trim()) {
      alert("Veuillez saisir une question")
      return
    }

    if (questionData.type === "multiple-choice") {
      // Check if at least one option is selected as correct
      if (!questionData.options.some((opt) => opt.is_correct)) {
        alert("Veuillez sélectionner au moins une réponse correcte")
        return
      }

      // Check if all options have text
      if (questionData.options.some((opt) => !opt.text.trim())) {
        alert("Veuillez remplir toutes les options")
        return
      }
    }

    onAddQuestion(questionData)

    // Reset form if standalone
    if (isStandalone) {
      setQuestionData({
        question: "",
        type: "multiple-choice",
        order: 0,
        options: [
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ],
      })
    }
  }

  return (
    <Card className={isStandalone ? "max-w-3xl mx-auto my-8" : ""}>
      <CardContent className={isStandalone ? "pt-6" : "p-0"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              value={questionData.question}
              onChange={handleQuestionChange}
              placeholder="Saisissez votre question ici..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Type de question</Label>
            <RadioGroup
              value={questionData.type}
              onValueChange={(value) => handleTypeChange(value as "multiple-choice" | "open-ended")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple-choice" id="multiple-choice" />
                <Label htmlFor="multiple-choice" className="cursor-pointer">
                  Choix multiple
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="open-ended" id="open-ended" />
                <Label htmlFor="open-ended" className="cursor-pointer">
                  Question ouverte
                </Label>
              </div>
            </RadioGroup>
          </div>

          {questionData.type === "multiple-choice" && (
            <div className="space-y-4">
              <Label>Options</Label>
              {questionData.options.map((option, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Checkbox
                    id={`correct-${index}`}
                    checked={option.is_correct}
                    onCheckedChange={(checked) => handleCorrectChange(index, checked as boolean)}
                    className="mt-2.5"
                  />
                  <div className="flex-1">
                    <Input
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                    disabled={questionData.options.length <= 2}
                    className="h-10 w-10 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addOption} className="w-full">
                Ajouter une option
              </Button>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit">{isStandalone ? "Ajouter la question" : "Enregistrer"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

