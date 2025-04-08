"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChallengeCard } from "./challenge-card"
import { ChallengeFilters } from "./challenge-filters"
import type { CTFChallenge, ChallengeCategory, ChallengeType } from "@/services/types/ctf"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ChallengeGridProps {
  challenges: CTFChallenge[]
  categories: ChallengeCategory[]
  types: ChallengeType[]
}

export function ChallengeGrid({ challenges, categories, types }: ChallengeGridProps) {
  const [filteredChallenges, setFilteredChallenges] = useState<CTFChallenge[]>(challenges)
  const [isLoading, setIsLoading] = useState(false)

  const handleFilterChange = (filters: any) => {
    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      const filtered = challenges.filter((challenge) => {
        // Search filter
        if (filters.search && !challenge.title.toLowerCase().includes(filters.search.toLowerCase())) {
          return false
        }

        // Category filter
        if (filters.categories.length > 0 && !challenge.categories.some((cat) => filters.categories.includes(cat.id))) {
          return false
        }

        // Type filter
        if (filters.types.length > 0 && !filters.types.includes(challenge.challenge_type.id)) {
          return false
        }

        // Difficulty filter
        if (filters.difficulty.length > 0 && !filters.difficulty.includes(challenge.difficulty)) {
          return false
        }

        // Points range filter
        if (challenge.points < filters.pointsRange[0] || challenge.points > filters.pointsRange[1]) {
          return false
        }

        // Show solved filter
        if (!filters.showSolved && challenge.is_solved) {
          return false
        }

        return true
      })

      // Sort challenges
      const sorted = [...filtered].sort((a, b) => {
        if (filters.sortBy === "points") {
          return filters.sortDirection === "asc" ? a.points - b.points : b.points - a.points
        } else if (filters.sortBy === "solves") {
          const aCount = a.solved_count || 0
          const bCount = b.solved_count || 0
          return filters.sortDirection === "asc" ? aCount - bCount : bCount - aCount
        } else {
          // newest
          const aDate = new Date(a.created_at).getTime()
          const bDate = new Date(b.created_at).getTime()
          return filters.sortDirection === "asc" ? aDate - bDate : bDate - aDate
        }
      })

      setFilteredChallenges(sorted)
      setIsLoading(false)
    }, 300)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div>
      <ChallengeFilters categories={categories} types={types} onFilterChange={handleFilterChange} />

      {filteredChallenges.length === 0 ? (
        <Alert variant="default" className="bg-gray-800 border-gray-700 text-white">
          <AlertCircle className="h-4 w-4 text-gray-400" />
          <AlertTitle>Aucun défi trouvé</AlertTitle>
          <AlertDescription>
            Aucun défi ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
          </AlertDescription>
        </Alert>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredChallenges.map((challenge, index) => (
            <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  )
}

