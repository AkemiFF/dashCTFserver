"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { ChallengeInstance } from "@/services/types/ctf"
import { AlertTriangle, Clock, ExternalLink, Loader2, RotateCcw, Server, Terminal } from "lucide-react"

interface ChallengeInstanceProps {
  instance: ChallengeInstance | null
  onRestart: () => void
  onStop: () => void
}

export function ChallengeInstance({ instance, onRestart, onStop }: ChallengeInstanceProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!instance || !instance.expires_at) return

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const expiresAt = new Date(instance.expires_at).getTime()
      const createdAt = new Date(instance.created_at).getTime()

      const totalDuration = expiresAt - createdAt
      const elapsed = now - createdAt
      const remaining = expiresAt - now

      setTimeLeft(Math.max(0, Math.floor(remaining / 1000)))
      setProgress(Math.max(0, Math.min(100, (remaining / totalDuration) * 100)))

      if (remaining <= 0) {
        clearInterval(timer)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [instance])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [hours > 0 ? `${hours}h` : null, minutes > 0 ? `${minutes}m` : null, `${secs}s`].filter(Boolean).join(" ")
  }

  if (!instance) return null

  return (
    <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Server className="h-5 w-5 mr-2 text-blue-400" />
          Instance du défi
        </h2>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRestart}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Redémarrer
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onStop}
            className="border-red-800 text-red-400 hover:bg-red-900/30"
          >
            Arrêter
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {instance.status === "pending" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center p-6 bg-gray-800/50 rounded-lg"
          >
            <Loader2 className="h-6 w-6 text-blue-400 animate-spin mr-3" />
            <p className="text-gray-300">Démarrage de l'instance en cours...</p>
          </motion.div>
        )}

        {instance.status === "error" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center p-4 bg-red-900/30 border border-red-800 rounded-lg"
          >
            <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
            <p className="text-red-300">Une erreur est survenue lors du démarrage de l'instance. Veuillez réessayer.</p>
          </motion.div>
        )}

        {instance.status === "running" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {instance.url && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center">
                  <ExternalLink className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="text-gray-300 font-mono text-sm truncate">{instance.url}</span>
                </div>

                <Button
                  size="sm"
                  onClick={() => window.open(instance.url, "_blank")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Accéder
                </Button>
              </div>
            )}

            {instance.ports && Object.keys(instance.ports).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(instance.ports).map(([port, hostPort]) => (
                  <div key={port} className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Terminal className="h-4 w-4 text-green-400 mr-2" />
                        <span className="text-gray-300 font-mono text-sm">
                          {port} → {hostPort}
                        </span>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const url = new URL(instance.url || "")
                          navigator.clipboard.writeText(`${url.hostname}:${hostPort}`)
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        Copier
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {timeLeft !== null && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-300">
                    <Clock className="h-4 w-4 text-yellow-400 mr-2" />
                    <span>Temps restant:</span>
                  </div>
                  <span className="font-mono text-white">{formatTime(timeLeft)}</span>
                </div>

                <Progress value={progress} className="h-2 bg-gray-800">
                  <div
                    className={`h-full rounded-full ${progress > 60 ? "bg-green-500" : progress > 30 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                    style={{ width: `${progress}%` }}
                  />
                </Progress>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

