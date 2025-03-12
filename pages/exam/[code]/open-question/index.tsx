"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { AnimatePresence, motion } from "framer-motion"
import { Bold, ChevronRight, Clock, ImageIcon, Italic, LinkIcon, List, Loader2, Timer } from "lucide-react"
import { useEffect, useRef, useState } from "react"

// Types pour les données
interface OpenQuestion {
  id: number
  text: string
  minWords?: number
  maxWords?: number
  hints?: string[]
}

interface QuestionAnalytics {
  questionId: number
  timeSpent: number
  wordCount: number
  characterCount: number
  editHistory: {
    timestamp: number
    wordCount: number
  }[]
  savedVersions: {
    timestamp: number
    content: string
  }[]
}

// Exemple de questions
const mockQuestions: OpenQuestion[] = [
  {
    id: 1,
    text: "Expliquez en détail comment l'intelligence artificielle peut être utilisée pour améliorer les systèmes éducatifs. Donnez des exemples concrets et discutez des avantages et des inconvénients potentiels.",
    minWords: 200,
    maxWords: 500,
    hints: [
      "Pensez aux différents aspects de l'éducation",
      "Incluez des exemples pratiques",
      "Discutez des implications éthiques",
    ],
  },
  // Ajoutez plus de questions ici
]

export default function OpenQuestionPage() {
  const [init, setInit] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answer, setAnswer] = useState("")
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutes en secondes
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [showHints, setShowHints] = useState(false)
  const lastSaveTime = useRef<number>(Date.now())
  const { toast } = useToast()

  // Calcul du nombre de mots
  useEffect(() => {
    const words = answer
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    setWordCount(words.length)
  }, [answer])

  // Sauvegarde automatique
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (answer && Date.now() - lastSaveTime.current > 10000) {
        // Sauvegarde toutes les 10 secondes si modifié
        handleAutoSave()
      }
    }, 10000)

    return () => clearInterval(saveInterval)
  }, [answer])

  // Initialisation des analytics
  useEffect(() => {
    const examId = "exam123" // À remplacer par l'ID réel
    const storedAnalytics = localStorage.getItem(`exam_open_${examId}`)
    if (!storedAnalytics) {
      const initialAnalytics = {
        examId,
        startTime: Date.now(),
        questions: [],
      }
      localStorage.setItem(`exam_open_${examId}`, JSON.stringify(initialAnalytics))
    }
  }, [])

  // Initialisation des particules
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  // Timer principal
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleExamEnd()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleAutoSave = async () => {
    setIsSaving(true)
    lastSaveTime.current = Date.now()

    // Simuler une sauvegarde
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Sauvegarder dans localStorage
    const examId = "exam123"
    const storedData = localStorage.getItem(`exam_open_${examId}_answers`)
    const answers = storedData ? JSON.parse(storedData) : {}
    answers[currentQuestion] = answer
    localStorage.setItem(`exam_open_${examId}_answers`, JSON.stringify(answers))

    setIsSaving(false)
    toast({
      title: "Réponse sauvegardée",
      description: "Votre réponse a été automatiquement sauvegardée",
    })
  }

  const handleSubmit = () => {
    const currentQuestionData = mockQuestions[currentQuestion]

    if (wordCount < (currentQuestionData.minWords || 0)) {
      toast({
        variant: "destructive",
        title: "Réponse trop courte",
        description: `Votre réponse doit contenir au moins ${currentQuestionData.minWords} mots.`,
      })
      return
    }

    if (currentQuestionData.maxWords && wordCount > currentQuestionData.maxWords) {
      toast({
        variant: "destructive",
        title: "Réponse trop longue",
        description: `Votre réponse ne doit pas dépasser ${currentQuestionData.maxWords} mots.`,
      })
      return
    }

    setShowConfirmation(true)
  }

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true)

    // Sauvegarder les analytics
    const examId = "exam123"
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)

    const questionAnalytics: QuestionAnalytics = {
      questionId: mockQuestions[currentQuestion].id,
      timeSpent,
      wordCount,
      characterCount: answer.length,
      editHistory: [], // À implémenter si nécessaire
      savedVersions: [
        {
          timestamp: Date.now(),
          content: answer,
        },
      ],
    }

    const storedAnalytics = localStorage.getItem(`exam_open_${examId}`)
    if (storedAnalytics) {
      const analytics = JSON.parse(storedAnalytics)
      analytics.questions.push(questionAnalytics)
      localStorage.setItem(`exam_open_${examId}`, JSON.stringify(analytics))
    }

    // Simuler un délai de soumission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setAnswer("")
      setQuestionStartTime(Date.now())
    } else {
      handleExamEnd()
    }

    setShowConfirmation(false)
    setIsSubmitting(false)
  }

  const handleExamEnd = () => {
    // Implémenter la logique de fin d'examen
    // router.push(`/exam/${examId}/results`)
  }

  const particlesOptions = {
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ffffff",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.5,
        random: true,
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
          sync: false,
        },
      },
      size: {
        value: 2,
        random: true,
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.3,
          sync: false,
        },
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none" as const,
        random: true,
        straight: false,
        outModes: {
          default: "out" as const,
        },
      },
    },
    background: {
      color: {
        value: "transparent",
      },
    },
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 relative overflow-hidden">
      {/* Stars animation */}
      {init && <Particles className="absolute inset-0" options={particlesOptions} />}

      {/* Timer fixed header */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Clock className="w-5 h-5 text-pink-500" />
              <div className="text-white/70">
                Temps restant: <span className="text-white font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-white/70 flex items-center gap-2">
                <Timer className="w-5 h-5 text-pink-500" />
                Question {currentQuestion + 1}/{mockQuestions.length}
              </div>
              {isSaving && (
                <div className="text-white/70 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sauvegarde...
                </div>
              )}
            </div>
          </div>
          <Progress
            value={(timeLeft / (45 * 60)) * 100}
            className="mt-2 bg-white/10 bg-gradient-to-r from-pink-500 to-purple-600"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="container relative z-10 min-h-screen pt-24 pb-8 px-4 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl mx-auto"
        >
          {/* Question card */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Question */}
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    {mockQuestions[currentQuestion].text}
                  </h2>

                  <div className="flex flex-wrap gap-4 text-sm text-white/60">
                    {mockQuestions[currentQuestion].minWords && (
                      <div className="flex items-center gap-2">
                        <span>Min: {mockQuestions[currentQuestion].minWords} mots</span>
                      </div>
                    )}
                    {mockQuestions[currentQuestion].maxWords && (
                      <div className="flex items-center gap-2">
                        <span>Max: {mockQuestions[currentQuestion].maxWords} mots</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span>Actuellement: {wordCount} mots</span>
                    </div>
                  </div>
                </div>

                {/* Text formatting toolbar */}
                <TooltipProvider>
                  <ToggleGroup type="multiple" className="bg-white/5 p-1 rounded-lg inline-flex">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ToggleGroupItem value="bold" aria-label="Toggle bold">
                          <Bold className="h-4 w-4" />
                        </ToggleGroupItem>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Gras</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ToggleGroupItem value="italic" aria-label="Toggle italic">
                          <Italic className="h-4 w-4" />
                        </ToggleGroupItem>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Italique</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ToggleGroupItem value="list" aria-label="Toggle list">
                          <List className="h-4 w-4" />
                        </ToggleGroupItem>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Liste</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ToggleGroupItem value="link" aria-label="Add link">
                          <LinkIcon className="h-4 w-4" />
                        </ToggleGroupItem>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ajouter un lien</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ToggleGroupItem value="image" aria-label="Add image">
                          <ImageIcon className="h-4 w-4" />
                        </ToggleGroupItem>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ajouter une image</p>
                      </TooltipContent>
                    </Tooltip>
                  </ToggleGroup>
                </TooltipProvider>

                {/* Answer textarea */}
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Rédigez votre réponse ici..."
                  className="min-h-[300px] bg-white/5 border-white/10 text-white placeholder:text-white/30 text-base leading-relaxed"
                />

                {/* Word count and actions */}
                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowHints(!showHints)}
                    className="text-white/70 border-white/10 hover:bg-white/5"
                  >
                    {showHints ? "Masquer les conseils" : "Voir les conseils"}
                  </Button>

                  <Button
                    onClick={handleSubmit}
                    className={cn(
                      "bg-gradient-to-r from-pink-500 to-purple-600",
                      "hover:from-pink-600 hover:to-purple-700",
                      "text-white",
                      "px-8 py-6 h-auto",
                      "text-lg",
                      "shadow-lg shadow-pink-500/25",
                      "border border-white/10",
                      "transition-all duration-300",
                      "hover:scale-[1.02] hover:shadow-pink-500/40",
                      "rounded-lg",
                      "font-medium",
                      "relative overflow-hidden group",
                      "flex items-center gap-3",
                    )}
                  >
                    <span>Question suivante</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Hints */}
                <AnimatePresence>
                  {showHints && mockQuestions[currentQuestion].hints && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white/5 rounded-lg p-4 space-y-2">
                        <h3 className="text-white font-medium">Conseils :</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {mockQuestions[currentQuestion].hints.map((hint, index) => (
                            <li key={index} className="text-white/70">
                              {hint}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="backdrop-blur-xl bg-white/5 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmer votre réponse</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Êtes-vous sûr de vouloir valider cette réponse ? Vous ne pourrez pas revenir en arrière.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white hover:bg-white/10 border-white/10">
              Réviser
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                "bg-gradient-to-r from-pink-500 to-purple-600",
                "hover:from-pink-600 hover:to-purple-700",
                "text-white border-0",
              )}
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Validation...
                </>
              ) : (
                "Valider"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}

