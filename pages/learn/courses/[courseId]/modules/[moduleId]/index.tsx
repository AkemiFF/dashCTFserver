"use client"

// Remplacer les imports existants par ceux-ci pour ajouter les nouveaux composants nécessaires
import { AIExplanation } from "@/components/ai-explanation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { CourseService } from "@/services/course-service"
import type { ContentItem, Module, QuizQuestion } from "@/types/course"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, CheckCircle, ChevronLeft, ChevronRight, Clock, Sparkles, Timer } from "lucide-react"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"

// Ajouter cette fonction pour formater le temps
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}

// Remplacer la fonction ModulePage par celle-ci
export default function ModulePage({ params }: { params?: { courseId?: string; moduleId?: string } }) {
  const router = useRouter()
  const [module, setModule] = useState<Module | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState<"content" | "quiz">("content")
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizResults, setQuizResults] = useState<{
    score: number
    total: number
    feedback: Record<string, { correct: boolean; feedback?: string }>
  } | null>(null)
  const [openEndedAnswers, setOpenEndedAnswers] = useState<Record<string, string>>({})
  const [id, setId] = useState("0")
  const [idModule, setIdModule] = useState("0")

  // Ajouter ces états pour le timer et la pagination des QCM
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [quizSets, setQuizSets] = useState<QuizQuestion[][]>([])
  const [activeQuizTab, setActiveQuizTab] = useState("mcq")

  // Modifier la fonction renderContentItem pour ajouter un conteneur avec ref
  const contentRef = useRef<HTMLDivElement>(null)
  const [selectedText, setselectedText] = useState<string | null>(null)
  const [selectionPosition, setselectionPosition] = useState<{ x: number; y: number } | null>(null)
  const [showAIExplanation, setShowAIExplanation] = useState(false)

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()
      if (!selection) {
        setselectedText(null)
        setselectionPosition(null)
        return
      }

      const text = selection.toString().trim()
      if (!text || !contentRef.current) {
        setselectedText(null)
        setselectionPosition(null)
        return
      }

      const range = selection.getRangeAt(0).getBoundingClientRect()
      setselectedText(text)
      setselectionPosition({
        x: range.left + range.width / 2,
        y: range.top,
      })
    }

    document.addEventListener("mouseup", handleSelection)
    document.addEventListener("touchend", handleSelection)

    return () => {
      document.removeEventListener("mouseup", handleSelection)
      document.removeEventListener("touchend", handleSelection)
    }
  }, [])

  const clearSelection = () => {
    window.getSelection()?.removeAllRanges()
    setselectedText(null)
    setselectionPosition(null)
    setShowAIExplanation(false)
  }

  useEffect(() => {
    // On attend que le router soit prêt
    if (!router.isReady) return

    // Récupération de courseId et moduleId soit depuis params, soit depuis router.query
    const courseId = params?.courseId || (router.query.courseId as string)
    const moduleId = params?.moduleId || (router.query.moduleId as string)

    if (!courseId || !moduleId) {
      console.error("Course ID or Module ID is undefined")
      return
    }
    setId(courseId)
    setIdModule(moduleId)
    const fetchModule = async () => {
      try {
        const moduleData = await CourseService.getModuleById(courseId, moduleId)
        if (moduleData) {
          setModule(moduleData)

          // Diviser les questions en groupes de 5 pour la pagination
          if (moduleData.quiz) {
            const mcqQuestions = moduleData.quiz.filter((q) => q.type === "multiple-choice")
            const quizGroups = []
            for (let i = 0; i < mcqQuestions.length; i += 5) {
              quizGroups.push(mcqQuestions.slice(i, i + 5))
            }
            setQuizSets(quizGroups.length > 0 ? quizGroups : [mcqQuestions])
          }
        } else {
          // Rediriger si le module n'existe pas
          router.push(`/learn/courses/${courseId}`)
        }
      } catch (error) {
        console.error("Error fetching module:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchModule()
  }, [router.isReady, router.query.courseId, router.query.moduleId, params])

  // Ajouter cet effet pour gérer le timer
  useEffect(() => {
    if (currentStep === "quiz" && !isTimerRunning) {
      setIsTimerRunning(true)
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentStep, isTimerRunning])

  // Arrêter le timer quand le quiz est soumis
  useEffect(() => {
    if (quizResults && isTimerRunning) {
      setIsTimerRunning(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [quizResults, isTimerRunning])

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  const handleQuizSubmit = () => {
    try {
      const results = CourseService.submitQuizAnswers(id, idModule, quizAnswers)
      setQuizResults(results)
      setIsTimerRunning(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    } catch (error) {
      console.error("Error submitting quiz:", error)
    }
  }

  const handleCompleteModule = () => {
    CourseService.completeModule(id, idModule)
    router.push(`/learn/courses/${id}`)
  }

  const handleAIExplain = () => {
    setShowAIExplanation(true)
  }

  const renderContentItem = (item: ContentItem) => {
    switch (item.type) {
      case "text":
        return (
          <div className="relative">
            <div
              ref={contentRef}
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />

            {selectedText && selectionPosition && !showAIExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-40"
                style={{
                  left: `${selectionPosition.x}px`,
                  top: `${selectionPosition.y - window.scrollY + 10}px`,
                  transform: "translateX(-50%)",
                }}
              >
                <Button
                  size="sm"
                  onClick={handleAIExplain}
                  className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/20 flex items-center gap-1.5 px-3 py-1 h-auto text-xs"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Expliquer avec l'IA
                </Button>
              </motion.div>
            )}

            <AnimatePresence>
              {showAIExplanation && selectedText && selectionPosition && (
                <AIExplanation
                  selectedText={selectedText}
                  position={selectionPosition}
                  onClose={() => {
                    setShowAIExplanation(false)
                    clearSelection()
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        )
      // Le reste du code reste inchangé
      case "image":
        return (
          <div className={`my-4 flex justify-${item.position}`}>
            <img src={item.url || "/placeholder.svg"} alt="Module content" className="rounded-lg max-h-[400px]" />
          </div>
        )
      case "video":
        if (item.platform === "youtube") {
          return (
            <div className="my-4 aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${item.url}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          )
        } else {
          return (
            <div className="my-4">
              <video controls className="w-full rounded-lg">
                <source src={item.url} type="video/mp4" />
                Votre navigateur ne prend pas en charge la lecture de vidéos.
              </video>
            </div>
          )
        }
      case "file":
        return (
          <div className="my-4 p-4 border border-white/10 rounded-lg bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13 2v7h7M16 13H8M16 17H8M10 9H8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">{item.filename}</p>
                <p className="text-sm text-white/60">{item.description}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/10">
              Télécharger
            </Button>
          </div>
        )
      case "link":
        return (
          <div className="my-4">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline flex items-center gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item.description || item.url}
            </a>
          </div>
        )
      default:
        return null
    }
  }

  // Remplacer la fonction renderQuiz par celle-ci
  const renderQuiz = () => {
    if (!module) return null

    const multipleChoiceQuestions = module.quiz.filter((q) => q.type === "multiple-choice")
    const openEndedQuestions = module.quiz.filter((q) => q.type === "open-ended")

    const currentQuizSet = quizSets[currentQuizIndex] || []
    const totalSets = quizSets.length

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Quiz de validation</h2>
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full">
            <Timer className="h-5 w-5 text-pink-400" />
            <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
          </div>
        </div>

        <div className="bg-white/5 p-1 rounded-lg">
          <Tabs defaultValue="mcq" value={activeQuizTab} onValueChange={setActiveQuizTab}>
            <TabsList className="grid grid-cols-2 bg-transparent">
              <TabsTrigger value="mcq" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
                QCM
                {multipleChoiceQuestions.length > 0 && (
                  <span className="ml-2 bg-white/10 px-2 py-0.5 rounded-full text-xs">
                    {multipleChoiceQuestions.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="open" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
                Questions ouvertes
                {openEndedQuestions.length > 0 && (
                  <span className="ml-2 bg-white/10 px-2 py-0.5 rounded-full text-xs">{openEndedQuestions.length}</span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mcq" className="mt-6">
              {multipleChoiceQuestions.length > 0 ? (
                <div className="space-y-6">
                  {totalSets > 1 && (
                    <div className="flex justify-between items-center mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentQuizIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentQuizIndex === 0}
                        className="border-white/10 hover:bg-white/10"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Précédent
                      </Button>

                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalSets }).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentQuizIndex(idx)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${idx === currentQuizIndex ? "bg-pink-500 text-white" : "bg-white/10 hover:bg-white/20"
                              }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentQuizIndex((prev) => Math.min(totalSets - 1, prev + 1))}
                        disabled={currentQuizIndex === totalSets - 1}
                        className="border-white/10 hover:bg-white/10"
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuizIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {currentQuizSet.map((question, idx) => (
                        <Card key={question.id} className="border border-white/10 bg-white/5 overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600"
                            style={{ width: `${((idx + 1) / currentQuizSet.length) * 100}%` }}
                          />
                          <CardHeader className="pb-2">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
                                {currentQuizIndex * 5 + idx + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-lg">{question.question}</h4>
                                {quizResults && (
                                  <div
                                    className={`mt-2 p-2 rounded ${quizResults.feedback[question.id]?.correct
                                      ? "bg-green-500/10 text-green-400"
                                      : "bg-red-500/10 text-red-400"
                                      }`}
                                  >
                                    {quizResults.feedback[question.id]?.feedback}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <RadioGroup
                              value={quizAnswers[question.id] || ""}
                              onValueChange={(value) => setQuizAnswers({ ...quizAnswers, [question.id]: value })}
                              disabled={quizResults !== null}
                              className="space-y-3"
                            >
                              {question.options?.map((option) => (
                                <div
                                  key={option}
                                  className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${quizAnswers[question.id] === option ? "bg-white/10" : "hover:bg-white/5"
                                    } ${quizResults &&
                                      quizResults.feedback[question.id]?.correct &&
                                      quizAnswers[question.id] === option
                                      ? "bg-green-500/10 border border-green-500/20"
                                      : quizResults &&
                                        !quizResults.feedback[question.id]?.correct &&
                                        quizAnswers[question.id] === option
                                        ? "bg-red-500/10 border border-red-500/20"
                                        : ""
                                    }`}
                                >
                                  <RadioGroupItem
                                    value={option}
                                    id={`${question.id}-${option}`}
                                    className="border-white/20"
                                  />
                                  <Label
                                    htmlFor={`${question.id}-${option}`}
                                    className={`flex-1 ${quizResults &&
                                      quizResults.feedback[question.id]?.correct &&
                                      quizAnswers[question.id] === option
                                      ? "text-green-400"
                                      : quizResults &&
                                        !quizResults.feedback[question.id]?.correct &&
                                        quizAnswers[question.id] === option
                                        ? "text-red-400"
                                        : ""
                                      }`}
                                  >
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </CardContent>
                        </Card>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/70">Aucune question à choix multiples pour ce module.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="open" className="mt-6">
              {openEndedQuestions.length > 0 ? (
                <div className="space-y-6">
                  {openEndedQuestions.map((question, idx) => (
                    <Card key={question.id} className="border border-white/10 bg-white/5 overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600"
                        style={{ width: `${((idx + 1) / openEndedQuestions.length) * 100}%` }}
                      />
                      <CardHeader className="pb-2">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
                            {idx + 1}
                          </div>
                          <h4 className="font-medium text-lg">{question.question}</h4>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Votre réponse..."
                          className="min-h-[150px] bg-white/5 border-white/10 focus:ring-pink-500 focus:border-pink-500"
                          value={openEndedAnswers[question.id] || ""}
                          onChange={(e) => setOpenEndedAnswers({ ...openEndedAnswers, [question.id]: e.target.value })}
                          disabled={quizResults !== null}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/70">Aucune question ouverte pour ce module.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {quizResults ? (
          <div className="mt-8 p-6 bg-white/5 rounded-lg border border-white/10">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">Résultats</h3>
                <div className="flex items-center gap-2 text-white/70">
                  <Clock className="h-4 w-4" />
                  <span>Temps: {formatTime(elapsedTime)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-bold">
                  {quizResults.score}/{quizResults.total}
                </div>
                <div className="flex-1">
                  <Progress
                    value={(quizResults.score / quizResults.total) * 100}
                    className={
                      quizResults.score / quizResults.total >= 0.7
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 h-3"
                        : "bg-gradient-to-r from-red-500 to-pink-500 h-3"
                    }
                  />
                  <div className="flex justify-between mt-1 text-sm text-white/70">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>

            {quizResults.score / quizResults.total >= 0.7 ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 flex items-center gap-3">
                  <div className="bg-green-500/20 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium">Félicitations !</h4>
                    <p className="text-sm text-green-400/80">Vous avez réussi le quiz avec succès.</p>
                  </div>
                </div>
                <Button
                  className="w-full py-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  onClick={handleCompleteModule}
                >
                  Terminer le module et continuer
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                  <h4 className="font-medium">Score insuffisant</h4>
                  <p className="text-sm text-red-400/80">
                    Vous n'avez pas obtenu le score minimum requis. Révisez le contenu et réessayez.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-white/10 hover:bg-white/10"
                  onClick={() => {
                    setQuizResults(null)
                    setQuizAnswers({})
                    setElapsedTime(0)
                    setIsTimerRunning(true)
                    timerRef.current = setInterval(() => {
                      setElapsedTime((prev) => prev + 1)
                    }, 1000)
                  }}
                >
                  Réessayer le quiz
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center mt-8">
            <Button
              className="px-8 py-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg"
              onClick={handleQuizSubmit}
            >
              Soumettre toutes les réponses
            </Button>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Module non trouvé</h2>
          <p className="text-white/70 mb-4">Le module que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button onClick={() => router.push(`/learn/courses/${id}`)}>Retour au cours</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => router.push(`/learn/courses/${id}`)} className="hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au cours
          </Button>
          <div className="flex items-center gap-2 text-white/70">
            <Clock className="h-4 w-4" />
            <span>{module.duration}</span>
          </div>
        </div>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <h1 className="text-2xl font-bold">{module.title}</h1>
          </CardHeader>
          <CardContent>
            {currentStep === "content" ? (
              <div className="space-y-6">
                {module.content.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderContentItem(item)}
                  </motion.div>
                ))}
              </div>
            ) : (
              renderQuiz()
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {currentStep === "content" ? (
              <div className="w-full flex justify-end">
                <Button
                  onClick={() => setCurrentStep("quiz")}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  Passer au quiz
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="w-full flex justify-start">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("content")}
                  className="border-white/10 hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au contenu
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

