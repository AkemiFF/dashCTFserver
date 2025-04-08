"use client"

import { ChallengeDescription } from "@/components/ctf/challenge-description"
import { ChallengeDetailHeader } from "@/components/ctf/challenge-detail-header"
import { ChallengeInstance } from "@/components/ctf/challenge-instance"
import { FlagSubmission } from "@/components/ctf/flag-submission"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { ctfService } from "@/services/ctf-service"
import type { CTFChallenge, ChallengeInstance as ChallengeInstanceType, DownloadableFile } from "@/services/types/ctf"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"
import { AlertCircle, Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"


export default function ChallengePage() {
  const params = useParams<{ id: string }>()
  const [id, setId] = useState<string>("")

  const { toast } = useToast()

  const [challenge, setChallenge] = useState<CTFChallenge | null>(null)
  const [instance, setInstance] = useState<ChallengeInstanceType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [init, setInit] = useState(false)
  useEffect(() => {
    if (!id) {
      setLoading(true)
    } else {
      console.log("ID complet:", id)
    }
  }, [id])
  useEffect(() => {
    if (!init) {
      initParticlesEngine(async (engine) => {
        await loadSlim(engine)
      }).then(() => {
        setInit(true)
      })
    }
  }, [init])
  useEffect(() => {
    setId(params?.id || "")
  }, [params])


  useEffect(() => {
    const fetchChallenge = async () => {
      if (!id) return; // Ensure the hook always runs but skips logic if id is missing
      try {
        setLoading(true)
        const data = await ctfService.getChallenge(id)
        setChallenge(data)

        // If the challenge has a running instance, update the state
        if (data.docker_status === "running") {
          setInstance({
            id: 0, // We don't have the actual instance ID here
            challenge_id: data.id,
            status: "running",
            url: data.instance_url,
            ports: data.instance_ports,
            created_at: new Date().toISOString(), // Placeholder
            expires_at: new Date(Date.now() + 3600000).toISOString(), // Placeholder: 1 hour from now
          })
        }
      } catch (err) {
        console.error("Error fetching challenge:", err)
        setError("Une erreur est survenue lors du chargement du défi. Veuillez réessayer.")
      } finally {
        setLoading(false)
      }
    }

    fetchChallenge()
  }, [id])


  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-300">Chargement du défi...</p>
      </div>
    )
  }

  const handleStartChallenge = async () => {
    try {
      const instance = await ctfService.startChallengeInstance(id)
      setInstance(instance)

      // Update the challenge with instance information
      if (challenge) {
        setChallenge({
          ...challenge,
          docker_status: "running",
          instance_url: instance.url,
          instance_ports: instance.ports,
        })
      }

      toast({
        title: "Instance démarrée",
        description: "Votre instance de défi a été démarrée avec succès.",
      })
    } catch (err) {
      console.error("Error starting challenge instance:", err)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du démarrage de l'instance.",
      })
    }
  }

  const handleRestartChallenge = async () => {
    try {
      // First stop the current instance
      if (instance) {
        await ctfService.stopChallengeInstance(id)
      }

      // Then start a new one
      const newInstance = await ctfService.startChallengeInstance(id)
      setInstance(newInstance)

      // Update the challenge with new instance information
      if (challenge) {
        setChallenge({
          ...challenge,
          docker_status: "running",
          instance_url: newInstance.url,
          instance_ports: newInstance.ports,
        })
      }

      toast({
        title: "Instance redémarrée",
        description: "Votre instance de défi a été redémarrée avec succès.",
      })
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

  const handleDownloadFile = async (file: DownloadableFile) => {
    try {
      const blob = await ctfService.downloadFile(file.url)

      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("Error downloading file:", err)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement du fichier.",
      })
    }
  }

  const handleUnlockHint = async (hintId: number) => {
    try {
      const result = await ctfService.unlockHint(id, hintId)

      if (result.success) {
        // Refresh the challenge to get the updated hint
        const updatedChallenge = await ctfService.getChallenge(id)
        setChallenge(updatedChallenge)

        toast({
          title: "Indice débloqué",
          description: "L'indice a été débloqué avec succès.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result.message,
        })
      }
    } catch (err) {
      console.error("Error unlocking hint:", err)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du déblocage de l'indice.",
      })
    }
  }

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

      {/* <SiteHeader /> */}

      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-300">Chargement des défis...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-white">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {challenge ? (
          <div className="space-y-6">
            <ChallengeDetailHeader
              challenge={challenge}
              onStartChallenge={handleStartChallenge}
              isInstanceRunning={instance?.status === "running"}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ChallengeDescription
                  challenge={challenge}
                  onDownloadFile={handleDownloadFile}
                  onUnlockHint={handleUnlockHint}
                />

                {instance && (
                  <ChallengeInstance
                    instance={instance}
                    onRestart={handleRestartChallenge}
                    onStop={handleStopChallenge}
                  />
                )}
              </div>

              <div className="space-y-6">
                <FlagSubmission challengeId={challenge.id} onSubmit={handleSubmitFlag} />
              </div>
            </div>
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

