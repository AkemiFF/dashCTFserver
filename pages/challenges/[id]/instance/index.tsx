"use client"

import { FlagSubmission } from "@/components/ctf/flag-submission"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import apiClient from "@/services/api-client"
import { ctfService } from "@/services/ctf-service"
import type { CTFChallenge, ChallengeInstance } from "@/services/types/ctf"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  RotateCcw,
  Server,
  Terminal,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function InstancePage() {
  const params = useParams()
  const [id, setId] = useState("")
  const { toast } = useToast()

  const [challenge, setChallenge] = useState<CTFChallenge | null>(null)
  const [instance, setInstance] = useState<ChallengeInstance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [init, setInit] = useState(false)
  const [startingInstance, setStartingInstance] = useState(false)
  const [instanceId, setInstanceId] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [progress, setProgress] = useState(100)
  const [isLoading, setIsLoading] = useState(true)

  const [sshInstructions, setSshInstructions] = useState<{
    instructions: string
    ssh_download_url?: string
    ssh_command?: string
  } | null>(null)

  const pollingInterval = useRef<NodeJS.Timeout | null>(null)
  const timerInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  useEffect(() => {
    if (params) {
      const paramsId = params.id as string
      setId(paramsId)

      const fetchChallenge = async () => {
        try {
          setLoading(true)
          const data = await ctfService.getChallenge(paramsId)
          setChallenge(data)

          // If the challenge has a running instance, update the state
          if (data.docker_status === "running") {
            setInstance({
              instance_id: "0",
              id: "0",
              challenge_id: data.id,
              status: "running",
              url: data.instance_url,
              ports: data.instance_ports,
              created_at: new Date().toISOString(), // Placeholder
              expires_at: new Date(Date.now() + 3600000).toISOString(), // Placeholder: 1 hour from now
            })
          } else {
            // If no running instance, start one automatically
            handleStartChallenge(paramsId)
          }
        } catch (err) {
          console.error("Error fetching challenge:", err)
          setError("Une erreur est survenue lors du chargement du défi. Veuillez réessayer.")
        } finally {
          setLoading(false)
          setIsLoading(false)
        }
      }

      fetchChallenge()

    } else {
      setIsLoading(true)
    }
    // Clean up polling and timer intervals on unmount
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
      }
    }
  }, [id])
  const handleSubmitFlag = async (flag: string) => {
    try {
      const result = await ctfService.submitFlag({
        challenge_id: id,
        flag,
      })

      // If the flag is correct, update the challenge
      if (result.success && challenge) {
        setChallenge({
          ...challenge,
          is_solved: true,
        })
      }

      return result
    } catch (err) {
      console.error("Error submitting flag:", err)
      throw err
    }
  }
  // Function to poll for instance status
  const pollInstanceStatus = async (instanceId: string) => {
    try {
      const result = await ctfService.checkInstanceStatus(instanceId)

      if (result.status === "running") {
        // Instance is ready
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current)
          pollingInterval.current = null
        }

        setStartingInstance(false)

        // Handle SSH specific instructions if available
        if (result.instructions) {
          setSshInstructions({
            instructions: result.instructions,
            ssh_download_url: result.ssh_download_url,
            ssh_command: result.ssh_command,
          })
        }

        // Update the challenge with instance information
        if (challenge) {
          setChallenge({
            ...challenge,
            docker_status: "running",
            instance_url: result.url,
            instance_ports: result.ports,
          })
        }

        // Update instance state
        setInstance({
          id: instanceId,
          instance_id: instanceId,
          challenge_id: id,
          status: "running",
          url: result.url,
          ports: result.ports || {},
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        })

        // Start the timer for instance expiration
        startExpirationTimer(new Date(Date.now() + 3600000).toISOString())

        toast({
          title: "Instance prête",
          description: "Votre instance de défi est maintenant prête à être utilisée.",
        })
      }
      // Continue polling for other statuses
    } catch (err) {
      console.error("Error checking instance status:", err)
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
        pollingInterval.current = null
      }
      setStartingInstance(false)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du démarrage de l'instance.",
      })
    }
  }

  const startExpirationTimer = (expiresAt: string) => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current)
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const expiresAtTime = new Date(expiresAt).getTime()
      const createdAtTime = new Date().getTime() - 3600000 // Assume created 1 hour ago

      const totalDuration = expiresAtTime - createdAtTime
      const remaining = expiresAtTime - now

      setTimeLeft(Math.max(0, Math.floor(remaining / 1000)))
      setProgress(Math.max(0, Math.min(100, (remaining / totalDuration) * 100)))

      if (remaining <= 0) {
        clearInterval(timerInterval.current!)
        // Instance expired
        setInstance((prev) => (prev ? { ...prev, status: "expired" } : null))
      }
    }

    calculateTimeLeft()
    timerInterval.current = setInterval(calculateTimeLeft, 1000)
  }

  const handleStartChallenge = async (paramsId: string = id) => {
    try {
      setStartingInstance(true)
      setSshInstructions(null)
      console.log("id before start :", paramsId);

      const response = await ctfService.startChallengeInstance(paramsId)

      if (response.status === "processing" && response.instance_id) {
        setInstanceId(response.instance_id)

        // Start polling for instance status
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current)
        }

        pollingInterval.current = setInterval(() => {
          pollInstanceStatus(paramsId)
        }, 3000) // Poll every 3 seconds

        toast({
          title: "Démarrage en cours",
          description: "L'instance de défi est en cours de démarrage. Veuillez patienter...",
        })
      } else if (response.status === "running") {
        // Handle immediate success (unlikely but possible)
        setStartingInstance(false)
        setInstance({
          id: response.instance_id,
          instance_id: response.instance_id,
          challenge_id: id,
          status: "running",
          url: response.url,
          ports: response.ports || {},
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 3600000).toISOString(),
        })

        // Update the challenge
        if (challenge) {
          setChallenge({
            ...challenge,
            docker_status: "running",
            instance_url: response.url,
            instance_ports: response.ports,
          })
        }

        // Start the timer for instance expiration
        startExpirationTimer(new Date(Date.now() + 3600000).toISOString())

        toast({
          title: "Instance démarrée",
          description: "Votre instance de défi a été démarrée avec succès.",
        })
      }
    } catch (err) {
      console.error("Error starting challenge instance:", err)
      setStartingInstance(false)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du démarrage de l'instance.",
      })
    }
  }
  if (isLoading) {
    return <>Loading</>
  }
  const handleRestartChallenge = async () => {
    try {
      // First stop the current instance
      if (instance) {
        await ctfService.stopChallengeInstance(id)
      }

      // Reset states
      setInstance(null)
      setSshInstructions(null)
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
      }

      // Then start a new one (reuse the start challenge logic)
      handleStartChallenge(id)
    } catch (err) {
      console.error("Error restarting challenge instance:", err)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du redémarrage de l'instance.",
      })
    }
  }

  const handleStopChallenge = async () => {
    try {
      await ctfService.stopChallengeInstance(id)
      setInstance(null)
      setSshInstructions(null)

      if (timerInterval.current) {
        clearInterval(timerInterval.current)
      }

      // Update the challenge
      if (challenge) {
        setChallenge({
          ...challenge,
          docker_status: "stopped",
          instance_url: undefined,
          instance_ports: undefined,
        })
      }

      toast({
        title: "Instance arrêtée",
        description: "Votre instance de défi a été arrêtée avec succès.",
      })
    } catch (err) {
      console.error("Error stopping challenge instance:", err)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'arrêt de l'instance.",
      })
    }
  }

  const handleDownloadSshKey = async () => {
    if (sshInstructions?.ssh_download_url) {
      try {
        const response = await apiClient.get(sshInstructions.ssh_download_url)

        if (response.status < 200 || response.status >= 300) {
          throw new Error("Failed to download SSH key")
        }

        const blob = new Blob([response.data])
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `cle_privee_${instanceId}.pem`
        document.body.appendChild(a)
        a.click()

        // Clean up
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Téléchargement réussi",
          description: "La clé SSH a été téléchargée avec succès.",
        })
      } catch (err) {
        console.error("Error downloading SSH key:", err)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors du téléchargement de la clé SSH.",
        })
      }
    }
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copié !",
      description: "Le texte a été copié dans le presse-papier.",
    })
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [hours > 0 ? `${hours}h` : null, minutes > 0 ? `${minutes}m` : null, `${secs}s`].filter(Boolean).join(" ")
  }

  const particlesOptions = {
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#0284c7",
      },
      links: {
        enable: true,
        color: "#0284c7",
        opacity: 0.2,
      },
      move: {
        enable: true,
        speed: 0.3,
      },
      size: {
        value: 2,
      },
      opacity: {
        value: 0.3,
      },
    },
    background: {
      color: {
        value: "transparent",
      },
    },
  }

  return (
    <div className="min-h-screen bg-[#0f1729] text-white relative overflow-hidden">
      {init && <Particles className="absolute inset-0" options={particlesOptions} />}

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -left-32 -top-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
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
          className="absolute -right-32 -bottom-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
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
      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="mb-6">
          <Link
            href={`/challenges/${id}`}
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au défi
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-300">Chargement de l'instance...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-white">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : challenge ? (
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                    <CardDescription className="text-gray-400 mt-1">Gestion de l'instance</CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      startingInstance
                        ? "bg-yellow-900/30 text-yellow-400 border-yellow-800"
                        : instance?.status === "running"
                          ? "bg-green-900/30 text-green-400 border-green-800"
                          : "bg-red-900/30 text-red-400 border-red-800"
                    }
                  >
                    {startingInstance
                      ? "Démarrage"
                      : instance?.status === "running"
                        ? "En cours d'exécution"
                        : "Arrêtée"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Instance Controls */}
                <div className="flex flex-wrap gap-3">
                  {instance?.status === "running" ? (
                    <>
                      <Button
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        onClick={handleRestartChallenge}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Redémarrer
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-800 text-red-400 hover:bg-red-900/30"
                        onClick={handleStopChallenge}
                      >
                        Arrêter
                      </Button>
                    </>
                  ) : (
                    !startingInstance && (
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                        onClick={() => handleStartChallenge()}
                      >
                        <Server className="h-4 w-4 mr-2" />
                        Démarrer l'instance
                      </Button>
                    )
                  )}
                </div>

                {/* Loading State */}
                {startingInstance && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-900/20 border border-blue-800 rounded-lg p-6"
                  >
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"></div>
                        <Server className="h-6 w-6 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-medium text-blue-300">Démarrage de l'instance</h3>
                        <p className="text-blue-200/80 max-w-md">
                          Votre instance de défi est en cours de démarrage. Cette opération peut prendre quelques
                          instants...
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Instance Info */}
                {instance?.status === "running" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Time Remaining */}
                    {timeLeft !== null && (
                      <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
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

                    {/* Instance URL */}
                    {instance.url && (
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center">
                            <ExternalLink className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                            <span className="text-gray-300 font-mono text-sm truncate">{instance.url}</span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-white"
                              onClick={() => handleCopyToClipboard(instance.url || "")}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copier
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => window.open(instance.url, "_blank")}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Accéder
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Instance Ports */}
                    {instance.ports && Object.keys(instance.ports).length > 0 && (
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-300 mb-3">Ports exposés</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {Object.entries(instance.ports).map(([port, hostPort]) => (
                            <div key={port} className="p-3 bg-gray-800/80 rounded-lg">
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
                                    handleCopyToClipboard(`${url.hostname}:${hostPort}`)
                                  }}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SSH Instructions */}
                    {sshInstructions && (
                      <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-medium text-green-300 flex items-center">
                          <Terminal className="h-5 w-5 mr-2" />
                          Instructions SSH
                        </h3>

                        <div className="prose prose-invert max-w-none prose-sm">
                          <div dangerouslySetInnerHTML={{ __html: sshInstructions.instructions }} />
                        </div>

                        <Separator className="bg-green-800/50" />

                        <div className="space-y-3">
                          {sshInstructions.ssh_download_url && (
                            <Button
                              variant="outline"
                              className="w-full sm:w-auto flex items-center gap-2 bg-green-950/50 hover:bg-green-950 border-green-800"
                              onClick={handleDownloadSshKey}
                            >
                              <Download className="h-4 w-4" />
                              Télécharger la clé privée
                            </Button>
                          )}

                          {sshInstructions.ssh_command && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-green-300">Commande SSH:</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-green-400 hover:text-green-300"
                                  onClick={() => handleCopyToClipboard(sshInstructions.ssh_command || "")}
                                >
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copier
                                </Button>
                              </div>
                              <div className="bg-black/50 p-3 rounded-md border border-green-800/50 font-mono text-sm overflow-x-auto">
                                {sshInstructions.ssh_command}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-6">
                          <FlagSubmission challengeId={challenge.id} onSubmit={handleSubmitFlag} />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </CardContent>
              <CardFooter className="border-t border-gray-800 pt-4">
                <p className="text-xs text-gray-400">
                  Les instances sont automatiquement arrêtées après une heure d'inactivité pour économiser les
                  ressources.
                </p>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-white">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertTitle>Défi introuvable</AlertTitle>
            <AlertDescription>Le défi que vous recherchez n'existe pas ou a été supprimé.</AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  )
}
