"use client"

import { ChallengeGrid } from "@/components/ctf/challenge-grid"
import { SiteHeader } from "@/components/site-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ctfService } from "@/services/ctf-service"
import type { CTFChallenge, ChallengeCategory, ChallengeType } from "@/services/types/ctf"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"
import { Loader2, Shield, Terminal } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ChallengesPage() {
  const router = useRouter()
  const [challenges, setChallenges] = useState<CTFChallenge[]>([])
  const [categories, setCategories] = useState<ChallengeCategory[]>([])
  const [types, setTypes] = useState<ChallengeType[]>([])
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
    const fetchChallenges = async () => {
      try {
        setLoading(true)
        const data = await ctfService.getChallenges()
        console.log("Fetched challenges:", data);

        // Extract unique categories and types from challenges
        const uniqueCategories: ChallengeCategory[] = []
        const uniqueTypes: ChallengeType[] = []

        data.forEach((challenge) => {
          challenge.categories.forEach((category) => {
            if (!uniqueCategories.some((c) => c.id === category.id)) {
              uniqueCategories.push(category)
            }
          })

          if (!uniqueTypes.some((t) => t.id === challenge.challenge_type.id)) {
            uniqueTypes.push(challenge.challenge_type)
          }
        })

        setChallenges(data)
        setCategories(uniqueCategories)
        setTypes(uniqueTypes)
      } catch (err) {
        console.error("Error fetching challenges:", err)
        setError("Une erreur est survenue lors du chargement des défis. Veuillez réessayer.")
      } finally {
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [])

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

      <SiteHeader unreadNotifications={1} />

      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Défis CTF</h1>
              <p className="text-gray-300 mt-2">Mettez vos compétences à l'épreuve avec nos défis de cybersécurité</p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={() => router.push("/challenges/leaderboard")}
              >
                <Shield className="h-4 w-4 mr-2" />
                Classement
              </Button>

              <Button
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                onClick={() => router.push("/challenges/my-progress")}
              >
                <Terminal className="h-4 w-4 mr-2" />
                Mon Progression
              </Button>
            </div>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-300">Chargement des défis...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-white">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <ChallengeGrid challenges={challenges} categories={categories} types={types} />
        )}
      </main>
    </div>
  )
}

