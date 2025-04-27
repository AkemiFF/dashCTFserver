"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { CTFChallenge } from "@/services/types/ctf"
import { motion } from "framer-motion"
import { Award, ChevronLeft, Clock, Download, Flag, Server, Shield, Users } from "lucide-react"
import Link from "next/link"

interface ChallengeDetailHeaderProps {
  challenge: CTFChallenge
  instanceUrl: string
  isInstanceRunning: boolean
  onStartChallenge?: () => void
}

export function ChallengeDetailHeader({
  challenge,
  instanceUrl,
  isInstanceRunning,
  onStartChallenge,
}: ChallengeDetailHeaderProps) {
  const difficultyColor = {
    easy: "bg-emerald-950 text-emerald-400 border-emerald-800",
    medium: "bg-amber-950 text-amber-400 border-amber-800",
    hard: "bg-rose-950 text-rose-400 border-rose-800",
  }

  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent rounded-xl -z-10" />

      <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center mb-4">
          <Link href="/challenges">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Retour aux défis
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-white"
            >
              {challenge.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-wrap gap-2"
            >
              <Badge variant="outline" className={difficultyColor[challenge.difficulty]}>
                {challenge.difficulty === "easy" ? "Facile" : challenge.difficulty === "medium" ? "Moyen" : "Difficile"}
              </Badge>

              <Badge variant="outline" className="bg-gray-800 text-gray-200 border-gray-700">
                <Server className="h-3 w-3 mr-1" />
                {challenge.challenge_type.name}
              </Badge>

              {challenge.categories.map((category) => (
                <Badge key={category.id} variant="outline" className="bg-gray-800 text-gray-200 border-gray-700">
                  {category.name}
                </Badge>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-300"
            >
              <div className="flex items-center">
                <Award className="h-4 w-4 text-yellow-400 mr-2" />
                <span>{challenge.points} points</span>
              </div>

              <div className="flex items-center">
                <Users className="h-4 w-4 text-blue-400 mr-2" />
                <span>{challenge.solved_count || 0} résolutions</span>
              </div>

              {challenge.time_limit_minutes && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-green-400 mr-2" />
                  <span>{challenge.time_limit_minutes} minutes</span>
                </div>
              )}

              <div className="flex items-center">
                <Shield className="h-4 w-4 text-purple-400 mr-2" />
                <span>{challenge.attempt_count || 0} tentatives</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col gap-3 min-w-[200px]"
          >
            {isInstanceRunning ? (
              <Link href={instanceUrl} className="w-full">
                <Button variant="default" className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Server className="mr-2 h-4 w-4" />
                  Gérer l'instance
                </Button>
              </Link>
            ) : onStartChallenge ? (
              <Button
                variant="default"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                onClick={onStartChallenge}
              >
                <Flag className="mr-2 h-4 w-4" />
                Démarrer le défi
              </Button>
            ) : (
              <Link href={instanceUrl} className="w-full">
                <Button
                  variant="default"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                >
                  <Flag className="mr-2 h-4 w-4" />
                  Démarrer le défi
                </Button>
              </Link>
            )}

            {challenge.downloadable_files && challenge.downloadable_files.length > 0 && (
              <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                <Download className="mr-2 h-4 w-4" />
                Télécharger les fichiers ({challenge.downloadable_files.length})
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
