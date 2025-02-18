"use client"

import Layout from "@/components/admin/layout"
import { QuestionForm } from "@/components/admin/question-form"
import { QuestionSummary } from "@/components/admin/question-summary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import { useState } from "react"

type Difficulty = "Facile" | "Intermédiaire" | "Difficile"
type Theme = "Réseaux" | "Sécurité Web" | "OSINT" | "Cryptographie"

interface Question {
  text: string
  options: string[]
  correctAnswer: number
  timeLimit: number
}

interface QCM {
  title: string
  theme: Theme
  difficulty: Difficulty
  points: number
  questions: Question[]
}

export default function QCMCreatorPage() {
  const [qcm, setQcm] = useState<QCM>({
    title: "",
    theme: "Réseaux",
    difficulty: "Facile",
    points: 0,
    questions: [],
  })
  const [showQuestionForm, setShowQuestionForm] = useState(false)

  const handleQCMChange = (field: keyof QCM, value: string | number) => {
    setQcm((prev) => ({ ...prev, [field]: value }))
  }

  const addQuestion = (question: Question) => {
    setQcm((prev) => ({ ...prev, questions: [...prev.questions, question] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("QCM submitted:", qcm)
    // Here you would typically send this data to your backend
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Créateur de QCM</h1>
        <Card className="bg-card/50 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Nouveau QCM</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du QCM</Label>
                  <Input
                    id="title"
                    value={qcm.title}
                    onChange={(e) => handleQCMChange("title", e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme">Thème</Label>
                  <Select value={qcm.theme} onValueChange={(value: Theme) => handleQCMChange("theme", value)}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Sélectionnez un thème" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Réseaux">Réseaux</SelectItem>
                      <SelectItem value="Sécurité Web">Sécurité Web</SelectItem>
                      <SelectItem value="OSINT">OSINT</SelectItem>
                      <SelectItem value="Cryptographie">Cryptographie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulté</Label>
                  <Select
                    value={qcm.difficulty}
                    onValueChange={(value: Difficulty) => handleQCMChange("difficulty", value)}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Sélectionnez la difficulté" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Facile">Facile</SelectItem>
                      <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                      <SelectItem value="Difficile">Difficile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    value={qcm.points}
                    onChange={(e) => handleQCMChange("points", Number.parseInt(e.target.value))}
                    required
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Questions</h3>
                {qcm.questions.map((question, index) => (
                  <QuestionSummary key={index} question={question} index={index} />
                ))}
                {showQuestionForm && (
                  <QuestionForm
                    onAddQuestion={(question) => {
                      addQuestion(question)
                      setShowQuestionForm(false)
                    }}
                    isStandalone={false}
                  />
                )}
                <Button type="button" onClick={() => setShowQuestionForm(true)} className="w-full mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une nouvelle question
                </Button>
              </div>

              <div className="flex justify-end">
                <Button type="submit" size="lg" className="w-full md:w-auto">
                  Valider et enregistrer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

