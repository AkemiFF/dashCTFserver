"use client"

import type React from "react"

import Layout from "@/components/admin/layout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { CourseApiService } from "@/services/course-api-service"
import { AlertCircle, ArrowLeft, Plus, X } from "lucide-react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"


export default function EditQuestionPage() {
    const router = useRouter()

    const [questionType, setQuestionType] = useState<"multiple-choice" | "open-ended">("multiple-choice")
    const [question, setQuestion] = useState("")
    const [options, setOptions] = useState<{ id: string; text: string; isCorrect: boolean }[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isReady, setIsReady] = useState(false)
    const [moduleId, setModuleId] = useState("")
    const [questionId, setQuestionId] = useState("")



    useEffect(() => {

    }, [moduleId, router.isReady, router.query.moduleId, isReady])
    useEffect(() => {

        const moduId = (router.query.moduleId as string)
        const questId = (router.query.questionId as string)
        setModuleId(moduId)
        setIsReady(true)

        const fetchQuestion = async () => {
            try {
                setLoading(true)

                // Fetch all questions and find the one we need
                const questions = await CourseApiService.getAllQuizQuestions(moduId)
                const questionData = questions.find((q) => q.id === questId)

                if (!questionData) {
                    setError("Question non trouvée")
                    return
                }

                // Set question data
                setQuestion(questionData.question)
                setQuestionType(questionData.type)

                // Set options with correct answers marked
                if (questionData.type === "multiple-choice") {
                    setOptions(
                        questionData.options?.map((option) => ({
                            id: option.id,
                            text: option.text,
                            isCorrect: questionData.correctAnswer?.includes(option.id) || false,
                        })) || [],
                    )
                }
            } catch (err) {
                console.error("Error fetching question:", err)
                setError("Une erreur est survenue lors du chargement de la question.")
            } finally {
                setLoading(false)
            }
        }

        if (moduId) { fetchQuestion() }
    }, [moduleId, router.isReady, router.query.moduleId, isReady, questionId])
    if (!isReady) {
        return (<></>)
    }
    const addOption = () => {
        setOptions([...options, { id: `new-${options.length + 1}`, text: "", isCorrect: false }])
    }

    const removeOption = (id: string) => {
        if (options.length <= 2) {
            setError("Une question à choix multiples doit avoir au moins 2 options.")
            return
        }
        setOptions(options.filter((option) => option.id !== id))
    }

    const updateOption = (id: string, text: string) => {
        setOptions(options.map((option) => (option.id === id ? { ...option, text } : option)))
    }

    const toggleCorrect = (id: string) => {
        setOptions(options.map((option) => (option.id === id ? { ...option, isCorrect: !option.isCorrect } : option)))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validation
        if (!question.trim()) {
            setError("Veuillez saisir une question.")
            return
        }

        if (questionType === "multiple-choice") {
            // Check if all options have text
            if (options.some((option) => !option.text.trim())) {
                setError("Toutes les options doivent avoir un texte.")
                return
            }

            // Check if at least one option is marked as correct
            if (!options.some((option) => option.isCorrect)) {
                setError("Au moins une option doit être marquée comme correcte.")
                return
            }
        }

        try {
            setSaving(true)

            // Format the data for the API
            const questionData = {
                question,
                type: questionType,
                order: 0, // Maintain existing order
                options:
                    questionType === "multiple-choice"
                        ? options.map((option) => ({
                            text: option.text,
                            is_correct: option.isCorrect,
                        }))
                        : [],
            }

            // Send to API
            await CourseApiService.updateQuizQuestion(moduleId, questionId, questionData)

            // Redirect back to module questions page
            router.push(`/admin/quiz/module/${moduleId}`)
        } catch (err) {
            console.error("Error updating question:", err)
            setError("Une erreur est survenue lors de la mise à jour de la question.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <Layout>
                <div className="space-y-6 max-w-[800px] mx-auto">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <Skeleton className="h-10 w-64 rounded-md" />
                    </div>
                    <Skeleton className="h-[500px] w-full rounded-lg" />
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="space-y-6 max-w-[800px] mx-auto">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Modifier la question</h1>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Modifier la question</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="question-type">Type de question</Label>
                                <RadioGroup
                                    id="question-type"
                                    value={questionType}
                                    onValueChange={(value) => setQuestionType(value as "multiple-choice" | "open-ended")}
                                    className="flex flex-col space-y-1"
                                    disabled={true} // Cannot change question type when editing
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="multiple-choice" id="multiple-choice" />
                                        <Label htmlFor="multiple-choice">Choix multiple</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="open-ended" id="open-ended" />
                                        <Label htmlFor="open-ended">Question ouverte</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="question">Question</Label>
                                <Textarea
                                    id="question"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Saisissez votre question ici..."
                                    className="min-h-[100px]"
                                    required
                                />
                            </div>

                            {questionType === "multiple-choice" && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label>Options</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={addOption}>
                                            <Plus className="h-4 w-4 mr-1" /> Ajouter une option
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {options.map((option) => (
                                            <div key={option.id} className="flex items-start gap-2">
                                                <Checkbox
                                                    id={`correct-${option.id}`}
                                                    checked={option.isCorrect}
                                                    onCheckedChange={() => toggleCorrect(option.id)}
                                                    className="mt-2"
                                                />
                                                <div className="flex-1">
                                                    <Input
                                                        value={option.text}
                                                        onChange={(e) => updateOption(option.id, e.target.value)}
                                                        placeholder={`Option ${option.id}`}
                                                        required
                                                    />
                                                </div>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(option.id)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="text-sm text-muted-foreground">Cochez les options qui sont correctes.</div>
                                </div>
                            )}

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => router.back()}>
                                    Annuler
                                </Button>
                                <Button type="submit" disabled={saving}>
                                    {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    )
}

