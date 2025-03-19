"use client"

import Layout from "@/components/admin/layout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ADMIN_NAME } from "@/lib/host"
import { CourseApiService } from "@/services/course-api-service"
import { QuizQuestion } from "@/types/course"
import { AlertCircle, ArrowLeft, Edit, FileQuestion, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"


export default function ModuleQuizPage() {
    const router = useRouter()

    const [moduleTitle, setModuleTitle] = useState<string>("")
    const [courseName, setCourseName] = useState<string>("")
    const [questions, setQuestions] = useState<QuizQuestion[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<string>("all")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [questionToDelete, setQuestionToDelete] = useState<string | null>(null)
    const [isReady, setIsReady] = useState(false)
    const [moduleId, setModuleId] = useState("")



    useEffect(() => {
        const moduId = (router.query.moduleId as string)
        setModuleId(moduId)
        setIsReady(true)
        const fetchData = async () => {
            try {
                setLoading(true)

                // Récupérer les informations du module
                const moduleData = await CourseApiService.getModuleById("", moduId)
                setModuleTitle(moduleData.title)

                // Récupérer le cours associé
                if (moduleData.courseId) {
                    try {
                        const courseData = await CourseApiService.getCourseById(moduleData.courseId)
                        setCourseName(courseData.title)
                    } catch (err) {
                        console.error("Error fetching course:", err)
                    }
                }

                // Récupérer les questions du quiz
                const questionsData = await CourseApiService.getAllQuizQuestions(moduId)
                setQuestions(questionsData)
                console.log(questionsData);

            } catch (err) {
                console.error("Error fetching data:", err)
                setError("Une erreur est survenue lors du chargement des données.")
            } finally {
                setLoading(false)
            }
        }
        if (moduId) { fetchData() }


    }, [moduleId, router.isReady, router.query.moduleId, isReady])
    if (!isReady) {
        return (<></>)
    }
    const handleDeleteQuestion = async (questionId: string) => {
        try {
            await CourseApiService.deleteQuizQuestion(moduleId, questionId)
            setQuestions(questions.filter((q) => q.id !== questionId))
            setDeleteDialogOpen(false)
            setQuestionToDelete(null)
        } catch (err) {
            console.error("Error deleting question:", err)
            setError("Une erreur est survenue lors de la suppression de la question.")
        }
    }

    const confirmDelete = (questionId: string) => {
        setQuestionToDelete(questionId)
        setDeleteDialogOpen(true)
    }

    // Filtrer les questions selon l'onglet actif
    const filteredQuestions =
        activeTab === "all"
            ? questions
            : activeTab === "multiple-choice"
                ? questions.filter((q) => q.type === "multiple-choice")
                : questions.filter((q) => q.type === "open-ended")

    // Compter les questions dans chaque catégorie
    const multipleChoiceCount = questions.filter((q) => q.type === "multiple-choice").length
    const openEndedCount = questions.filter((q) => q.type === "open-ended").length

    return (
        <Layout>
            <div className="space-y-6 max-w-[1000px] mx-auto">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Questions du module</h1>
                        {moduleTitle && (
                            <p className="text-muted-foreground">
                                {moduleTitle}
                                {courseName && ` - ${courseName}`}
                            </p>
                        )}
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
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm">
                            {questions.length} question{questions.length !== 1 ? "s" : ""}
                        </Badge>
                    </div>

                    <Link href={`${ADMIN_NAME}/quiz/module/${moduleId}/add`}>
                        <Button className="flex items-center">
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter des questions
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center h-40">
                                <p className="text-muted-foreground">Chargement des questions...</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : questions.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="p-6 text-center">
                            <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground mb-4">Ce module ne contient pas encore de questions de quiz.</p>
                            <Link href={`${ADMIN_NAME}/quiz/module/${moduleId}/add`}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Ajouter des questions
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="all">Toutes ({questions.length})</TabsTrigger>
                            <TabsTrigger value="multiple-choice">QCM ({multipleChoiceCount})</TabsTrigger>
                            <TabsTrigger value="open-ended">Questions ouvertes ({openEndedCount})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-4">
                            <div className="space-y-4">
                                {filteredQuestions.map((question, index) => (
                                    <QuestionCard
                                        key={question.id}
                                        question={question}
                                        index={index}
                                        onDelete={() => confirmDelete(question.id)}
                                        moduleId={moduleId}
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
                                        onDelete={() => confirmDelete(question.id)}
                                        moduleId={moduleId}
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
                                        onDelete={() => confirmDelete(question.id)}
                                        moduleId={moduleId}
                                    />
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Supprimer la question</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Annuler
                        </Button>
                        <Button variant="destructive" onClick={() => questionToDelete && handleDeleteQuestion(questionToDelete)}>
                            Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    )
}

// Composant pour afficher une question
interface QuestionCardProps {
    question: QuizQuestion
    index: number
    onDelete: () => void
    moduleId: string
}

function QuestionCard({ question, index, onDelete, moduleId }: QuestionCardProps) {
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
                    <div className="flex gap-2">
                        <Link href={`${ADMIN_NAME}/quiz/module/${moduleId}/edit/${question.id}`}>
                            <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onDelete}
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="font-medium">{question.question}</p>

                {question.type === "multiple-choice" && question.options && question.options.length > 0 && (
                    <div className="space-y-2">
                        <Separator />
                        <p className="text-sm font-medium text-muted-foreground">Options:</p>
                        <ul className="space-y-1">
                            {question.options?.map((option) => (

                                <li key={option.id} className="flex items-start gap-2 text-sm">
                                    {option.is_correct}
                                    <Badge
                                        variant={option.is_correct ? "default" : "outline"}
                                        className={`mt-0.5 ${option.is_correct ? "bg-green-600" : ""}`}
                                    >
                                        {option.is_correct ? "Correcte" : "Incorrecte"}
                                    </Badge>
                                    <span>{option.text}</span>
                                </li>
                            ))}
                        </ul>
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

