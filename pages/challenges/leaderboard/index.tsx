"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ctfService } from "@/services/ctf-service"
import type { CTFLeaderboardEntry } from "@/services/types/ctf"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"
import { AlertCircle, ChevronLeft, Crown, Loader2, Medal, Trophy } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<CTFLeaderboardEntry[]>([])
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
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const data = await ctfService.getLeaderboard()
        setLeaderboard(data)
      } catch (err) {
        console.error("Error fetching leaderboard:", err)
        setError("Une erreur est survenue lors du chargement du classement. Veuillez réessayer.")
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-300" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-gray-400">{rank}</span>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
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
            <Trophy className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">Classement CTF</h1>
          </motion.div>
          <p className="text-gray-300 mt-2 ml-12">Les meilleurs hackers de la plateforme</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-300">Chargement du classement...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-white">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Rang</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Utilisateur</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Points</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Défis résolus</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Dernière résolution</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <motion.tr
                      key={entry.user_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`border-b border-gray-800 ${index < 3 ? "bg-blue-900/10" : ""
                        } hover:bg-gray-800/50 transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800">
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={entry.avatar} alt={entry.username} />
                            <AvatarFallback className="bg-blue-900 text-blue-300">
                              {entry.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-white">{entry.username}</div>
                            {index < 3 && (
                              <div className="text-xs text-gray-400">
                                {index === 0 ? "Champion" : index === 1 ? "Vice-champion" : "Médaille de bronze"}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-lg font-bold text-yellow-400">{entry.points}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-300">{entry.solved_count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-400 text-sm">
                        {formatDate(entry.last_solve_time)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}

