"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ctfService } from "@/services/ctf-service"
import type { UserChallengeStats } from "@/services/types/ctf"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"
import { AlertCircle, Award, ChevronLeft, Flag, Loader2, Target, Trophy } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function MyProgressPage() {
  const [stats, setStats] = useState<UserChallengeStats | null>(null)
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
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await ctfService.getUserStats()
        setStats(data)
      } catch (err) {
        console.error("Error fetching user stats:", err)
        setError("Une erreur est survenue lors du chargement de vos statistiques. Veuillez réessayer.")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
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

      {/* <SiteHeader /> */}

      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/challenges">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Retour aux défis
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <Target className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">Ma Progression</h1>
          </motion.div>
          <p className="text-gray-300 mt-2 ml-12">Suivez votre avancement dans les défis CTF</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-300">Chargement de vos statistiques...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-white">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Overall Progress Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-white">Progression globale</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Défis résolus</span>
                      <span className="text-white font-bold">
                        {stats.solved_count} / {stats.total_count}
                      </span>
                    </div>

                    <Progress value={(stats.solved_count / stats.total_count) * 100} className="h-2 bg-gray-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{ width: `${(stats.solved_count / stats.total_count) * 100}%` }}
                      />
                    </Progress>

                    <div className="pt-4 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-400">{stats.points_earned}</div>
                        <div className="text-sm text-gray-400">Points gagnés</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Categories Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-2"
            >
              <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-white">Progression par catégorie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.categories.map((category, index) => (
                      <div key={category.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">{category.name}</span>
                          <span className="text-white">
                            {category.solved} / {category.total}
                          </span>
                        </div>

                        <Progress value={(category.solved / category.total) * 100} className="h-2 bg-gray-800">
                          <div
                            className={`h-full rounded-full ${index % 3 === 0 ? "bg-blue-500" : index % 3 === 1 ? "bg-purple-500" : "bg-cyan-500"
                              }`}
                            style={{ width: `${(category.solved / category.total) * 100}%` }}
                          />
                        </Progress>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-white">Réalisations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-blue-900/20 rounded-lg border border-blue-800">
                      <div className="p-2 bg-blue-900/50 rounded-full mr-3">
                        <Flag className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Premier Flag</div>
                        <div className="text-xs text-gray-400">Premier défi résolu</div>
                      </div>
                    </div>

                    {stats.solved_count >= 5 && (
                      <div className="flex items-center p-3 bg-purple-900/20 rounded-lg border border-purple-800">
                        <div className="p-2 bg-purple-900/50 rounded-full mr-3">
                          <Trophy className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Chasseur de flags</div>
                          <div className="text-xs text-gray-400">5 défis résolus</div>
                        </div>
                      </div>
                    )}

                    {stats.points_earned >= 1000 && (
                      <div className="flex items-center p-3 bg-yellow-900/20 rounded-lg border border-yellow-800">
                        <div className="p-2 bg-yellow-900/50 rounded-full mr-3">
                          <Award className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Expert CTF</div>
                          <div className="text-xs text-gray-400">1000+ points gagnés</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          <Alert className="bg-blue-900/30 border-blue-800 text-white">
            <AlertTitle>Aucune donnée</AlertTitle>
            <AlertDescription>
              Vous n'avez pas encore participé à des défis CTF. Commencez dès maintenant !
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  )
}

