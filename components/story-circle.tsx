"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface StoryCircleProps {
  story: {
    id: number
    user: {
      name: string
      avatar: string
    }
    active: boolean
  }
}

export function StoryCircle({ story }: StoryCircleProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center cursor-pointer"
    >
      <div
        className={cn(
          "p-0.5 rounded-full",
          story.active ? "bg-gradient-to-r from-pink-500 to-purple-600" : "bg-white/20",
        )}
      >
        <div className="p-0.5 bg-navy-950 rounded-full">
          <Avatar className="h-16 w-16 border-2 border-transparent">
            <AvatarImage src={story.user.avatar} alt={story.user.name} />
            <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              {story.user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <span className="text-xs text-white/80 mt-2">{story.user.name}</span>
    </motion.div>
  )
}

