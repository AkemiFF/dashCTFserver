"use client"

import Layout from "@/components/admin/layout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ADMIN_NAME } from "@/lib/host"
import { CourseApiService } from "@/services/course-api-service"
import { AlertCircle, ArrowLeft, Plus, Save, Sparkles, Trash2, Wand2 } from "lucide-react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

// Types pour les questions et réponses
interface QuizOption {
  id: string
  text: string
  is_correct: boolean
}

interface QuizQuestion {
  id: string
  question: string
  type: "multiple-choice" | "open-ended"
  order: number
  options: QuizOption[]
}

export default function GenerateQuizQuestionsPage() {
  const router = useRouter()

  const [moduleTitle, setModuleTitle] = useState<string>("")
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [isReady, setIsReady] = useState(false)
  const [moduleId, setModuleId] = useState("")

  // États pour la génération IA
  const [aiPrompt, setAiPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAiDialog, setShowAiDialog] = useState(false)
  const [numQuestions, setNumQuestions] = useState(3)
  const [questionType, setQuestionType] = useState<"both" | "multiple-choice" | "open-ended">("both")

  useEffect(() => {
    const moduId = router.query.moduleId as string
    setModuleId(moduId)
    setIsReady(true)
    const fetchModuleInfo = async () => {
      try {
        setLoading(true)
        const moduleData = await CourseApiService.getModuleById("", moduId)
        setModuleTitle(moduleData.title)
      } catch (err) {
        console.error("Error fetching module info:", err)
        setError("Impossible de récupérer les informations du module.")
      } finally {
        setLoading(false)
      }
    }
    if (moduId) {
      fetchModuleInfo()
    }
  }, [moduleId, router.isReady, router.query.moduleId, isReady])

  if (!isReady) {
    return <></>
  }

  // Générer un ID unique pour les nouvelles questions
  const generateId = () => {
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString()
  }

  // Ajouter une nouvelle question
  const addQuestion = (type: "multiple-choice" | "open-ended") => {
    const newQuestion: QuizQuestion = {
      id: generateId(),
      question: "",
      type,
      order: questions.length,
      options:
        type === "multiple-choice"
          ? [
            { id: generateId(), text: "", is_correct: true },
            { id: generateId(), text: "", is_correct: false },
            { id: generateId(), text: "", is_correct: false },
          ]
          : [],
    }

    setQuestions([...questions, newQuestion])
  }

  // Mettre à jour une question
  const updateQuestion = (id: string, field: keyof QuizQuestion, value: any) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  // Supprimer une question
  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  // Ajouter une option à une question
  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
            ...q,
            options: [...q.options, { id: generateId(), text: "", is_correct: false }],
          }
          : q,
      ),
    )
  }

  // Mettre à jour une option
  const updateOption = (questionId: string, optionId: string, field: keyof QuizOption, value: any) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
            ...q,
            options: q.options.map((o) => (o.id === optionId ? { ...o, [field]: value } : o)),
          }
          : q,
      ),
    )
  }

  // Supprimer une option
  const deleteOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
            ...q,
            options: q.options.filter((o) => o.id !== optionId),
          }
          : q,
      ),
    )
  }

  // Définir une option comme correcte (et les autres comme incorrectes pour les QCM)
  const setCorrectOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
            ...q,
            options: q.options.map((o) => ({ ...o, is_correct: o.id === optionId })),
          }
          : q,
      ),
    )
  }

  // Permettre plusieurs réponses correctes
  const toggleCorrectOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
            ...q,
            options: q.options.map((o) => (o.id === optionId ? { ...o, is_correct: !o.is_correct } : o)),
          }
          : q,
      ),
    )
  }

  // Générer des questions avec l'IA
  const generateQuestionsWithAI = async () => {
    if (!aiPrompt.trim()) {
      setError("Veuillez fournir une description pour la génération des questions.")
      return
    }

    try {
      setIsGenerating(true)
      setError(null)

      // Simuler un appel API à un service d'IA
      // Dans une implémentation réelle, vous feriez un appel à votre API d'IA
      const response = await fetch("http://localhost:8000/api/chat/generate-quiz/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          module_id: moduleId,
          module_title: moduleTitle,
          prompt: aiPrompt,
          num_questions: numQuestions,
          question_type: questionType,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la génération des questions")
      }

      const data = await response.json()

      // Transformer les données reçues en questions
      const generatedQuestions: QuizQuestion[] = data.questions.map((q: any) => ({
        id: generateId(),
        question: q.question,
        type: q.type,
        order: questions.length + data.questions.indexOf(q),
        options:
          q.type === "multiple-choice"
            ? q.options.map((opt: any) => ({
              id: generateId(),
              text: opt.text,
              is_correct: opt.is_correct,
            }))
            : [],
      }))

      // Ajouter les questions générées à la liste existante
      setQuestions([...questions, ...generatedQuestions])
      setShowAiDialog(false)
    } catch (error) {
      console.error("Error generating questions:", error)
      setError(`Erreur lors de la génération des questions: ${(error as Error).message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  // Enregistrer toutes les questions
  const saveQuestions = async () => {
    // Validation
    if (questions.length === 0) {
      setError("Veuillez ajouter au moins une question.")
      return
    }

    for (const question of questions) {
      if (!question.question.trim()) {
        setError("Toutes les questions doivent avoir un contenu.")
        return
      }

      if (question.type === "multiple-choice") {
        if (question.options.length < 2) {
          setError("Les questions à choix multiples doivent avoir au moins 2 options.")
          return
        }

        if (!question.options.some((o) => o.is_correct)) {
          setError("Chaque question à choix multiples doit avoir au moins une réponse correcte.")
          return
        }

        if (question.options.some((o) => !o.text.trim())) {
          setError("Toutes les options doivent avoir un contenu.")
          return
        }
      }
    }

    try {
      setSaving(true)
      setError(null)

      // Enregistrer chaque question
      for (const question of questions) {
        const questionData = {
          question: question.question,
          type: question.type,
          order: question.order,
          options:
            question.type === "multiple-choice"
              ? question.options.map((o) => ({
                text: o.text,
                is_correct: o.is_correct,
              }))
              : [],
        }

        await CourseApiService.createQuizQuestion(moduleId, questionData)
      }

      // Rediriger vers la page du module
      router.push(`${ADMIN_NAME}/quiz/module/${moduleId}`)
    } catch (err) {
      console.error("Error saving questions:", err)
      setError("Une erreur est survenue lors de l'enregistrement des questions.")
    } finally {
      setSaving(false)
    }
  }

  // Filtrer les questions selon l'onglet actif
  const filteredQuestions =
    activeTab === "all"
      ? questions
      : activeTab === "multiple-choice"
        ? questions.filter((q) => q.type === "multiple-choice")
        : questions.filter((q) => q.type === "open-ended")

  return (
    <Layout>
      <div className="space-y-6 max-w-[1000px] mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Générer des questions</h1>
            {moduleTitle && <p className="text-muted-foreground">Module: {moduleTitle}</p>}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Génération assistée par IA</CardTitle>
            <CardDescription className="text-white/70">
              Utilisez l'IA pour générer automatiquement des questions de quiz basées sur le contenu du module.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowAiDialog(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Générer avec l'IA
              </Button>
              <Button onClick={() => addQuestion("multiple-choice")} className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter QCM
              </Button>
              <Button onClick={() => addQuestion("open-ended")} variant="outline" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter question ouverte
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Badge variant="outline" className="text-sm">
            {questions.length} question{questions.length !== 1 ? "s" : ""}
          </Badge>
          <Button
            onClick={saveQuestions}
            disabled={saving || questions.length === 0}
            className="flex items-center bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Enregistrement..." : "Enregistrer tout"}
          </Button>
        </div>

        {questions.length > 0 && (
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Toutes ({questions.length})</TabsTrigger>
              <TabsTrigger value="multiple-choice">
                QCM ({questions.filter((q) => q.type === "multiple-choice").length})
              </TabsTrigger>
              <TabsTrigger value="open-ended">
                Questions ouvertes ({questions.filter((q) => q.type === "open-ended").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="space-y-4">
                {filteredQuestions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    updateQuestion={updateQuestion}
                    deleteQuestion={deleteQuestion}
                    addOption={addOption}
                    updateOption={updateOption}
                    deleteOption={deleteOption}
                    setCorrectOption={setCorrectOption}
                    toggleCorrectOption={toggleCorrectOption}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="multiple-choice" className="mt-4">
              <div className="space-y-4">
                {filteredQuestions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    updateQuestion={updateQuestion}
                    deleteQuestion={deleteQuestion}
                    addOption={addOption}
                    updateOption={updateOption}
                    deleteOption={deleteOption}
                    setCorrectOption={setCorrectOption}
                    toggleCorrectOption={toggleCorrectOption}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="open-ended" className="mt-4">
              <div className="space-y-4">
                {filteredQuestions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    updateQuestion={updateQuestion}
                    deleteQuestion={deleteQuestion}
                    addOption={addOption}
                    updateOption={updateOption}
                    deleteOption={deleteOption}
                    setCorrectOption={setCorrectOption}
                    toggleCorrectOption={toggleCorrectOption}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {questions.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                Aucune question ajoutée. Utilisez les boutons ci-dessus pour ajouter des questions ou générer avec l'IA.
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  onClick={() => setShowAiDialog(true)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  size="sm"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Générer avec l'IA
                </Button>
                <Button onClick={() => addQuestion("multiple-choice")} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter QCM
                </Button>
                <Button onClick={() => addQuestion("open-ended")} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter question ouverte
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialogue pour la génération IA */}
        <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
          <DialogContent className="bg-navy-900 border border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Générer des questions avec l'IA</DialogTitle>
              <DialogDescription className="text-white/70">
                Décrivez le contenu pour lequel vous souhaitez générer des questions.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-prompt">Description du contenu</Label>
                <Textarea
                  id="ai-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ex: Générer des questions sur les principes de base de la programmation orientée objet, incluant l'héritage, le polymorphisme et l'encapsulation."
                  className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="num-questions">Nombre de questions</Label>
                  <Input
                    id="num-questions"
                    type="number"
                    min={1}
                    max={10}
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number.parseInt(e.target.value))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question-type">Type de questions</Label>
                  <select
                    id="question-type"
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as any)}
                    className="w-full h-10 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white"
                  >
                    <option value="both">Les deux types</option>
                    <option value="multiple-choice">QCM uniquement</option>
                    <option value="open-ended">Questions ouvertes uniquement</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAiDialog(false)}
                className="border-white/10 text-white hover:bg-white/10"
              >
                Annuler
              </Button>
              <Button
                onClick={generateQuestionsWithAI}
                disabled={isGenerating || !aiPrompt.trim()}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Générer
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}

// Composant pour afficher une question
interface QuestionCardProps {
  question: QuizQuestion
  index: number
  updateQuestion: (id: string, field: keyof QuizQuestion, value: any) => void
  deleteQuestion: (id: string) => void
  addOption: (questionId: string) => void
  updateOption: (questionId: string, optionId: string, field: keyof QuizOption, value: any) => void
  deleteOption: (questionId: string, optionId: string) => void
  setCorrectOption: (questionId: string, optionId: string) => void
  toggleCorrectOption: (questionId: string, optionId: string) => void
}

function QuestionCard({
  question,
  index,
  updateQuestion,
  deleteQuestion,
  addOption,
  updateOption,
  deleteOption,
  setCorrectOption,
  toggleCorrectOption,
}: QuestionCardProps) {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Question {index + 1}</CardTitle>
            <Badge variant={question.type === "multiple-choice" ? "default" : "secondary"}>
              {question.type === "multiple-choice" ? "QCM" : "Question ouverte"}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteQuestion(question.id)}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`question-${question.id}`}>Énoncé de la question</Label>
          <Textarea
            id={`question-${question.id}`}
            value={question.question}
            onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
            placeholder="Saisissez votre question ici..."
            className="min-h-[80px] bg-white/5 border-white/10 text-white placeholder:text-white/50"
          />
        </div>

        {question.type === "multiple-choice" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Options de réponse</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addOption(question.id)}
                className="border-white/10 text-white hover:bg-white/10"
              >
                <Plus className="mr-1 h-3 w-3" />
                Ajouter une option
              </Button>
            </div>

            {question.options.map((option, optIndex) => (
              <div key={option.id} className="flex items-center gap-2">
                <RadioGroup
                  value={option.is_correct ? option.id : ""}
                  onValueChange={() => setCorrectOption(question.id, option.id)}
                  className="flex items-center"
                >
                  <RadioGroupItem value={option.id} id={`option-${question.id}-${option.id}`} />
                </RadioGroup>
                <div className="flex-1">
                  <Input
                    value={option.text}
                    onChange={(e) => updateOption(question.id, option.id, "text", e.target.value)}
                    placeholder={`Option ${optIndex + 1}`}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteOption(question.id, option.id)}
                  disabled={question.options.length <= 2}
                  className="text-muted-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <p className="text-xs text-muted-foreground">
              Sélectionnez l'option correcte en utilisant le bouton radio à gauche.
            </p>
          </div>
        )}

        {question.type === "open-ended" && (
          <div className="bg-white/5 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              Cette question est ouverte. Les étudiants pourront saisir une réponse libre.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

