"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { TrendingUp, Hash } from "lucide-react"

export function TrendingTopics() {
  const trends = [
    { tag: "IntelligenceArtificielle", posts: "12.5K", category: "Technologie" },
    { tag: "DéveloppementDurable", posts: "8.3K", category: "Environnement" },
    { tag: "NouvellesTechnologies", posts: "6.7K", category: "Technologie" },
    { tag: "SantéMentale", posts: "5.2K", category: "Santé" },
    { tag: "ApprentissageEnLigne", posts: "4.8K", category: "Éducation" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4"
    >
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="h-5 w-5 text-pink-500" />
        <h3 className="font-semibold text-white">Tendances pour vous</h3>
      </div>
      <div className="space-y-4">
        {trends.map((trend, index) => (
          <div key={index} className="group">
            <div className="text-xs text-white/60">{trend.category}</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Hash className="h-4 w-4 text-pink-500" />
                <span className="font-medium text-white group-hover:text-pink-500 transition-colors">{trend.tag}</span>
              </div>
              <div className="text-xs text-white/60">{trend.posts} posts</div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="ghost" className="w-full mt-3 text-pink-500 hover:bg-white/5">
        Voir plus
      </Button>
    </motion.div>
  )
}

