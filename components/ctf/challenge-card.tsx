"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { CTFChallenge } from "@/services/types/ctf"
import { Award, CheckCircle2, ChevronRight, Clock, Lock, Server, Shield, Users } from "lucide-react"
import Link from "next/link"

interface ChallengeCardProps {
  challenge: CTFChallenge
  index: number
}

export function ChallengeCard({ challenge, index }: ChallengeCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const difficultyColor = {
    easy: "bg-emerald-950 text-emerald-400 border-emerald-800",
    medium: "bg-amber-950 text-amber-400 border-amber-800",
    hard: "bg-rose-950 text-rose-400 border-rose-800",
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
    hover: {
      y: -5,
      boxShadow: "0 10px 30px -10px rgba(2, 132, 199, 0.2)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  const glowVariants = {
    initial: { opacity: 0 },
    hover: {
      opacity: 0.7,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      custom={index}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl blur-xl"
        variants={glowVariants}
        initial="initial"
        animate={isHovered ? "hover" : "initial"}
      />

      <Card className="relative overflow-hidden border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        {challenge.is_solved && (
          <div className="absolute top-0 right-0 m-2">
            <Badge variant="default" className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Résolu
            </Badge>
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={difficultyColor[challenge.difficulty]}>
                  {challenge.difficulty === "easy"
                    ? "Facile"
                    : challenge.difficulty === "medium"
                      ? "Moyen"
                      : "Difficile"}
                </Badge>
                {challenge.categories.map((category) => (
                  <Badge key={category.id} variant="outline" className="bg-gray-800 text-gray-200 border-gray-700">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center bg-blue-900/30 px-3 py-1 rounded-full border border-blue-800">
              <Award className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="font-bold text-white">{challenge.points} pts</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="mt-2 text-gray-300 line-clamp-2">{challenge.description.replace(/<[^>]*>?/gm, "")}</div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-400">
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>{challenge.solved_count || 0} résolutions</span>
            </div>
            <div className="flex items-center">
              <Server className="h-3 w-3 mr-1" />
              <span>{challenge.challenge_type.name}</span>
            </div>
            {challenge.time_limit_minutes && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{challenge.time_limit_minutes} min</span>
              </div>
            )}
            <div className="flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              <span>{challenge.attempt_count || 0} tentatives</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Link href={`/challenges/${challenge.id}`} className="w-full">
            <Button
              variant="default"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            >
              {challenge.is_solved ? (
                <>
                  Revoir le défi
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Relever le défi
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </Link>
        </CardFooter>

        {!challenge.is_active && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
            <div className="text-center p-4">
              <Lock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-300 font-medium">Ce défi n'est pas encore disponible</p>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

