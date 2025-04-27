"use client"

import { ChallengeDescription } from "@/components/ctf/challenge-description"
import { ChallengeDetailHeader } from "@/components/ctf/challenge-detail-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ctfService } from "@/services/ctf-service"
import type { CTFChallenge, DownloadableFile } from "@/services/types/ctf"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"
import { AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"



export default function ChallengePage() {
  const params = useParams()
  const [id, setId] = useState("")
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [challenge, setChallenge] = useState<CTFChallenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [init, setInit] = useState(false)

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
        } catch (err) {
          console.error("Error fetching challenge:", err)
          setError("Une erreur est survenue lors du chargement du défi. Veuillez réessayer.")
        } finally {
          setLoading(false)
        }
      }

      fetchChallenge()
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [id])

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
  if (isLoading) {
    return <>Loading</>
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-300">Chargement du défi...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-white">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : challenge ? (
          <div className="space-y-6">
            <ChallengeDetailHeader
              challenge={challenge}
              instanceUrl={`/challenges/${id}/instance`}
              isInstanceRunning={challenge.docker_status === "running"}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ChallengeDescription
                  challenge={challenge}
                  onDownloadFile={handleDownloadFile}
                  onUnlockHint={handleUnlockHint}
                />

                {challenge.docker_status === "running" && (
                  <div className="p-6 rounded-xl border border-green-800 bg-green-900/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-green-300">Instance active</h3>
                        <p className="text-green-200/80">Vous avez une instance active pour ce défi.</p>
                      </div>
                      <Link href={`/challenges/${id}/instance`}>
                        <Button className="bg-green-700 hover:bg-green-800 text-white">Gérer l'instance</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* <FlagSubmission challengeId={challenge.id} onSubmit={handleSubmitFlag} /> */}
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
