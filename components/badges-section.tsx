"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Award } from "lucide-react"

interface Badge {
  id: number
  name: string
  icon: string
  level: string
}

interface BadgesSectionProps {
  badges: Badge[]
  showAll?: boolean
}

export default function BadgesSection({ badges, showAll = false }: BadgesSectionProps) {
  const displayedBadges = showAll ? badges : badges.slice(0, 6)

  const getBadgeColor = (level: string) => {
    switch (level) {
      case "gold":
        return "from-yellow-400 to-amber-600"
      case "silver":
        return "from-gray-300 to-gray-500"
      case "bronze":
        return "from-amber-700 to-amber-900"
      default:
        return "from-pink-500 to-purple-600"
    }
  }

  return (
    <Card className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-pink-500" />
          Badges & Certifications
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {displayedBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex flex-col items-center"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${getBadgeColor(badge.level)} shadow-lg`}
              >
                <span className="text-xl font-bold text-white">{badge.icon.charAt(0).toUpperCase()}</span>
              </div>
              <span className="mt-2 text-sm font-medium text-center">{badge.name}</span>
            </motion.div>
          ))}
        </div>

        {!showAll && badges.length > 6 && (
          <div className="mt-4 text-center">
            <span className="text-sm text-white/70">+{badges.length - 6} autres badges</span>
          </div>
        )}
      </div>
    </Card>
  )
}

export { BadgesSection }

