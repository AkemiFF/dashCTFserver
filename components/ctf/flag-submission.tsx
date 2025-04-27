"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { FlagSubmissionResult } from "@/services/types/ctf"
import confetti from "canvas-confetti"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, CheckCircle2, Flag, Loader2 } from "lucide-react"
import { useState } from "react"

interface FlagSubmissionProps {
  challengeId: string
  onSubmit: (flag: string) => Promise<FlagSubmissionResult>
}

export function FlagSubmission({ challengeId, onSubmit }: FlagSubmissionProps) {
  const [flag, setFlag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<FlagSubmissionResult | null>(null)
  const [attempts, setAttempts] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!flag.trim()) return

    setIsSubmitting(true)
    setResult(null)

    try {
      const result = await onSubmit(flag)
      setResult(result)
      setAttempts((prev) => prev + 1)

      if (result.success) {
        // Trigger confetti animation on success
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Une erreur s'est produite lors de la soumission du flag.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <Flag className="h-5 w-5 mr-2 text-blue-400" />
        Soumettre un flag
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="FLAG{...}"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white pr-24"
            disabled={isSubmitting}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-xs text-gray-400">
              {attempts > 0 ? `${attempts} tentative${attempts > 1 ? "s" : ""}` : ""}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
          disabled={isSubmitting || !flag.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Vérification...
            </>
          ) : (
            "Soumettre le flag"
          )}
        </Button>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`mt-4 p-4 rounded-lg ${result.success
              ? "bg-green-900/30 border border-green-800 text-green-300"
              : "bg-red-900/30 border border-red-800 text-red-300"
              }`}
          >
            <div className="flex items-start">
              {result.success ? (
                <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-400" />
              )}
              <div>
                <p className="font-medium">{result.message}</p>
                {result.success && result.points_earned && (
                  <p className="text-sm mt-1">
                    Vous avez gagné <span className="font-bold">{result.points_earned} points</span>
                    {result.time_taken && (
                      <>
                        {" "}
                        en {Math.floor(result.time_taken / 60)} min {result.time_taken % 60} sec
                      </>
                    )}
                    {result.first_blood && (
                      <span className="ml-2 px-2 py-0.5 bg-yellow-900/50 text-yellow-300 rounded-full text-xs">
                        Premier sang !
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

