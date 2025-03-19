"use client"

import Layout from "@/components/admin/layout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { CourseApiService } from "@/services/course-api-service"
import { AlertCircle, ArrowLeft, Plus, Save, Trash2 } from "lucide-react"
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

export default function AddQuizQuestionsPage() {
    const router = useRouter()

    const [moduleTitle, setModuleTitle] = useState<string>("")
    const [questions, setQuestions] = useState<QuizQuestion[]>([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<string>("all")
    const [isReady, setIsReady] = useState(false)
    const [moduleId, setModuleId] = useState("")



    useEffect(() => {
        const moduId = (router.query.moduleId as string)
        setModuleId(moduId)
        setIsReady(true)
        const fetchModuleInfo = async () => {
            try {
                setLoading(true)
                const moduleData = await CourseApiService.getModuleById("", moduId)
                console.log(moduleData.title);

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
        return (<></>)
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
            router.push(`/admin/quiz/module/${moduleId}`)
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
                        <h1 className="text-3xl font-bold tracking-tight">Ajouter des questions</h1>
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

                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <Button onClick={() => addQuestion("multiple-choice")} className="flex items-center">
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter QCM
                        </Button>
                        <Button onClick={() => addQuestion("open-ended")} variant="outline" className="flex items-center">
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter question ouverte
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm">
                            {questions.length} question{questions.length !== 1 ? "s" : ""}
                        </Badge>
                        <Button onClick={saveQuestions} disabled={saving || questions.length === 0} className="flex items-center">
                            <Save className="mr-2 h-4 w-4" />
                            {saving ? "Enregistrement..." : "Enregistrer tout"}
                        </Button>
                    </div>
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
                                Aucune question ajoutée. Utilisez les boutons ci-dessus pour ajouter des questions.
                            </p>
                            <div className="flex justify-center gap-2">
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
        <Card>
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
                        className="min-h-[80px]"
                    />
                </div>

                {question.type === "multiple-choice" && (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label>Options de réponse</Label>
                            <Button type="button" variant="outline" size="sm" onClick={() => addOption(question.id)}>
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
                    <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">
                            Cette question est ouverte. Les étudiants pourront saisir une réponse libre.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

