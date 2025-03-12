"use client"

import type React from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"
import { ArrowRight, KeyRound, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function ExamPage() {
  const [examCode, setExamCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [init, setInit] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!examCode.trim()) {
      toast({
        variant: "destructive",
        title: "Code manquant",
        description: "Veuillez entrer un code d'examen valide.",
      })
      return
    }

    setIsLoading(true)
    // Simuler une vérification du code
    setTimeout(() => {
      setIsLoading(false)
      // Ici, vous pouvez ajouter la logique de vérification réelle du code
      if (examCode === "TEST123") {
        toast({
          title: "Code valide",
          description: "Redirection vers votre examen...",
        })
        // Redirection vers le QCM
        // router.push(`/exam/${examCode}/quiz`)
      } else {
        toast({
          variant: "destructive",
          title: "Code invalide",
          description: "Le code d'examen entré n'est pas valide.",
        })
      }
    }, 1500)
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
      <div className="container relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg"
        >
          {/* Glass card */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 shadow-2xl">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-md" />
                  <div className="relative bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-4">
                    <KeyRound className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                Accéder à votre examen
              </h1>
              <p className="text-white/60 mt-3 text-lg">Entrez le code fourni par votre professeur</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="exam-code" className="text-white/70 text-base">
                  Code d&apos;examen
                </Label>
                <Input
                  id="exam-code"
                  value={examCode}
                  onChange={(e) => setExamCode(e.target.value.toUpperCase())}
                  placeholder="Ex: TEST123"
                  className={cn(
                    "bg-white/5 border-white/10 text-white",
                    "placeholder:text-white/30",
                    "h-14 text-lg text-center tracking-wider",
                    "uppercase",
                    "transition-all duration-300",
                    "focus:scale-[1.02] focus:bg-white/10",
                  )}
                  maxLength={10}
                />
              </div>

              <Alert className="bg-white/5 border-white/10">
                <AlertDescription className="text-white/60">
                  Le code d&apos;examen est sensible à la casse et doit être exactement comme fourni par votre
                  professeur.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full",
                  "bg-gradient-to-r from-pink-500 to-purple-600",
                  "hover:from-pink-600 hover:to-purple-700",
                  "text-white",
                  "py-7 h-auto",
                  "text-lg",
                  "shadow-lg shadow-pink-500/25",
                  "border border-white/10",
                  "transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-pink-500/40",
                  "rounded-lg",
                  "font-medium",
                  "relative overflow-hidden group",
                  "flex items-center justify-center gap-3",
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Vérification...</span>
                  </>
                ) : (
                  <>
                    <span>Accéder à l&apos;examen</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-600/0 via-pink-600/40 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

