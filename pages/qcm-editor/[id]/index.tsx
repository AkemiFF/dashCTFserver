"use client"

import Layout from "@/components/layout"
import { QuestionForm } from "@/components/question-form"
import { QuestionSummary } from "@/components/question-summary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type Difficulty = "Facile" | "Intermédiaire" | "Difficile"
type Theme = "Réseaux" | "Sécurité Web" | "OSINT" | "Cryptographie"

interface Question {
  text: string
  options: string[]
  correctAnswer: number
  timeLimit: number
}

interface QCM {
  id: string
  title: string
  theme: Theme
  difficulty: Difficulty
  points: number
  questions: Question[]
}

// This would typically come from your API
const mockFetchQCM = async (id: string): Promise<QCM> => {
  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    id,
    title: "QCM de test",
    theme: "Réseaux",
    difficulty: "Intermédiaire",
    points: 100,
    questions: [
      {
        text: "Quelle est la couche du modèle OSI responsable du routage ?",
        options: ["Couche physique", "Couche réseau", "Couche transport", "Couche application"],
        correctAnswer: 1,
        timeLimit: 45,
      },
      {
        text: "Quel protocole est utilisé pour la résolution d'adresses IP en adresses MAC ?",
        options: ["DNS", "DHCP", "ARP", "HTTP"],
        correctAnswer: 2,
        timeLimit: 30,
      },
    ],
  }
}

export default function QCMEditorPage() {
  const params = useParams()
  const id = params?.id as string ?? "1"


  const [qcm, setQcm] = useState<QCM | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQuestionForm, setShowQuestionForm] = useState(false)

  useEffect(() => {
    const fetchQCM = async () => {
      try {
        const fetchedQCM = await mockFetchQCM(id)
        setQcm(fetchedQCM)
      } catch (error) {
        console.error("Error fetching QCM:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQCM()
  }, [id])

  const handleQCMChange = (field: keyof QCM, value: string | number) => {
    setQcm((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const addQuestion = (question: Question) => {
    setQcm((prev) => (prev ? { ...prev, questions: [...prev.questions, question] } : null))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("QCM updated:", qcm)
    // Here you would typically send this data to your backend
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">Chargement...</div>
      </Layout>
    )
  }

  if (!qcm) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">QCM non trouvé</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Éditeur de QCM</h1>
        <Card className="bg-card/50 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Modifier le QCM</CardTitle>
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
                  Sauvegarder les modifications
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

