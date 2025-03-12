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
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight, Clock, Loader2, Timer } from "lucide-react"
import { useEffect, useState } from "react"

// Types pour les données
interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
}

interface QuestionAnalytics {
  questionId: number
  timeSpent: number
  selectedAnswer: number | null
  isCorrect: boolean
  timestamp: number
}

interface ExamAnalytics {
  examId: string
  startTime: number
  questions: QuestionAnalytics[]
  totalTimeSpent: number
}

// Exemple de questions
const mockQuestions: Question[] = [
  {
    id: 1,
    text: "Quelle est la principale caractéristique du deep learning ?",
    options: [
      "L'apprentissage supervisé uniquement",
      "L'utilisation de réseaux de neurones multicouches",
      "Le traitement de petites quantités de données",
      "L'absence de paramètres ajustables",
    ],
    correctAnswer: 1,
  },
  // Ajoutez plus de questions ici
]

export default function QuestionPage() {
  const [init, setInit] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutes en secondes
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Initialisation des analytics
  useEffect(() => {
    const examId = "exam123" // À remplacer par l'ID réel de l'examen
    const storedAnalytics = localStorage.getItem(`exam_${examId}`)
    if (!storedAnalytics) {
      const initialAnalytics: ExamAnalytics = {
        examId,
        startTime: Date.now(),
        questions: [],
        totalTimeSpent: 0,
      }
      localStorage.setItem(`exam_${examId}`, JSON.stringify(initialAnalytics))
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

  // Formatage du temps
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Sauvegarde des analytics pour une question
  const saveQuestionAnalytics = () => {
    const examId = "exam123" // À remplacer par l'ID réel
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)

    const questionAnalytics: QuestionAnalytics = {
      questionId: mockQuestions[currentQuestion].id,
      timeSpent,
      selectedAnswer,
      isCorrect: selectedAnswer === mockQuestions[currentQuestion].correctAnswer,
      timestamp: Date.now(),
    }

    const storedAnalytics = localStorage.getItem(`exam_${examId}`)
    if (storedAnalytics) {
      const analytics: ExamAnalytics = JSON.parse(storedAnalytics)
      analytics.questions.push(questionAnalytics)
      analytics.totalTimeSpent += timeSpent
      localStorage.setItem(`exam_${examId}`, JSON.stringify(analytics))
    }
  }

  // Gestion de la fin de l'examen
  const handleExamEnd = () => {
    // Sauvegarder les dernières analytics
    saveQuestionAnalytics()

    // Rediriger vers la page de résultats
    // router.push(`/exam/${examId}/results`)
  }

  // Gestion de la soumission d'une réponse
  const handleSubmit = () => {
    if (selectedAnswer === null) {
      toast({
        variant: "destructive",
        title: "Réponse requise",
        description: "Veuillez sélectionner une réponse avant de continuer.",
      })
      return
    }
    setShowConfirmation(true)
  }

  // Confirmation et passage à la question suivante
  const handleConfirmSubmit = () => {
    setIsSubmitting(true)
    saveQuestionAnalytics()

    setTimeout(() => {
      if (currentQuestion < mockQuestions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
        setSelectedAnswer(null)
        setQuestionStartTime(Date.now())
      } else {
        handleExamEnd()
      }
      setShowConfirmation(false)
      setIsSubmitting(false)
    }, 1000)
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
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-pink-500" />
              <div className="text-white/70">
                Question {currentQuestion + 1}/{mockQuestions.length}
              </div>
            </div>
          </div>
          <Progress
            value={(timeLeft / (45 * 60)) * 100}
            className="bg-gradient-to-r from-pink-500 to-purple-600 mt-2 bg-white/10"
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
              >
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-8">
                  {mockQuestions[currentQuestion].text}
                </h2>

                <RadioGroup
                  value={selectedAnswer?.toString()}
                  onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
                  className="space-y-4"
                >
                  {mockQuestions[currentQuestion].options.map((option, index) => (
                    <Label
                      key={index}
                      className={cn(
                        "flex items-center space-x-2 rounded-lg border border-white/10 p-4",
                        "transition-all duration-200",
                        "hover:bg-white/5",
                        selectedAnswer === index && "bg-white/10 border-pink-500",
                        "cursor-pointer",
                      )}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <span className="text-white/90">{option}</span>
                    </Label>
                  ))}
                </RadioGroup>

                <div className="mt-8 flex justify-end">
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

