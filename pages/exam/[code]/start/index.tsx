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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"
import { AlertCircle, BookOpen, CheckCircle2, Clock, HelpCircle, Timer } from "lucide-react"
import { useEffect, useState } from "react"

// Simuler les données de l'examen
const examData = {
  title: "Introduction à l'Intelligence Artificielle",
  duration: 45, // en minutes
  questions: 20,
  professor: "Dr. Smith",
  instructions: [
    "Vous ne pouvez pas revenir en arrière une fois une question validée",
    "Chaque question a une seule réponse correcte",
    "Le temps restant est affiché en permanence",
    "L'examen se termine automatiquement une fois le temps écoulé",
  ],
}

export default function StartExam() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [init, setInit] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })

    // Simuler un chargement
    const timer = setTimeout(() => setIsReady(true), 1000)
    return () => clearTimeout(timer)
  }, [])

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

      {/* Background effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute -left-32 -top-32 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -right-32 -bottom-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl"
        >
          {/* Timer Card */}
          <Card className="mb-6 backdrop-blur-xl bg-white/5 border-white/10">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-3 text-white">
                <Clock className="w-6 h-6 text-pink-500" />
                Durée de l&apos;examen
              </CardTitle>
              <CardDescription className="text-center text-white/60">
                Une fois commencé, le temps ne peut pas être mis en pause
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2 text-4xl font-bold text-pink-500">
                <Timer className="w-8 h-8" />
                {examData.duration} minutes
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* Exam Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 mb-2">
                {examData.title}
              </h1>
              <p className="text-white/60 text-lg">Professeur: {examData.professor}</p>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-white/80">
                  <HelpCircle className="w-5 h-5 text-pink-500" />
                  <span>{examData.questions} questions</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="w-5 h-5 text-pink-500" />
                  <span>{examData.duration} minutes</span>
                </div>
              </div>
            </div>

            <Separator className="my-8 bg-white/10" />

            {/* Instructions */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-pink-500 flex-shrink-0" />
                <h2 className="text-xl font-semibold text-white">Instructions</h2>
              </div>
              <ul className="space-y-4">
                {examData.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-pink-500 flex-shrink-0 mt-1" />
                    <span className="text-white/80">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Warning */}
            <div className="bg-white/5 rounded-lg p-4 mb-8 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
              <div className="text-white/70">
                <p className="font-semibold mb-1">Important</p>
                <p>
                  Assurez-vous d&apos;avoir une connexion internet stable et de ne pas être dérangé pendant la durée de
                  l&apos;examen.
                </p>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => setShowConfirmation(true)}
                disabled={!isReady}
                className={cn(
                  "bg-gradient-to-r from-pink-500 to-purple-600",
                  "hover:from-pink-600 hover:to-purple-700",
                  "text-white",
                  "py-6 px-8 h-auto",
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
                <span>Commencer l&apos;examen</span>
                <Timer className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="backdrop-blur-xl bg-white/5 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Êtes-vous prêt à commencer ?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Une fois commencé, le chronomètre démarrera et vous ne pourrez pas mettre l&apos;examen en pause.
              Assurez-vous d&apos;être dans un environnement calme et d&apos;avoir le temps nécessaire.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white hover:bg-white/10 border-white/10">
              Pas encore
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                "bg-gradient-to-r from-pink-500 to-purple-600",
                "hover:from-pink-600 hover:to-purple-700",
                "text-white border-0",
              )}
              onClick={() => {
                // Rediriger vers la première question
                // router.push(`/exam/${examCode}/question/1`)
              }}
            >
              Commencer maintenant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}

