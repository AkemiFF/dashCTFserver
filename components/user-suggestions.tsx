"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, UserPlus } from "lucide-react"

export function UserSuggestions() {
  const suggestions = [
    {
      name: "Marie Laurent",
      username: "@marielaurent",
      avatar: "/placeholder.svg?height=40&width=40",
      mutualFriends: 5,
    },
    { name: "Thomas Petit", username: "@thomaspetit", avatar: "/placeholder.svg?height=40&width=40", mutualFriends: 3 },
    {
      name: "Camille Dubois",
      username: "@camilledubois",
      avatar: "/placeholder.svg?height=40&width=40",
      mutualFriends: 2,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Users className="h-5 w-5 text-pink-500" />
        <h3 className="font-semibold text-white">Suggestions pour vous</h3>
      </div>
      <div className="space-y-4">
        {suggestions.map((user, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border border-white/10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-white">{user.name}</div>
                <div className="text-xs text-white/60 flex items-center">
                  <span>{user.username}</span>
                  <span className="mx-1">•</span>
                  <span>{user.mutualFriends} amis en commun</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 text-white/70 hover:text-pink-500 hover:bg-white/5"
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="ghost" className="w-full mt-3 text-pink-500 hover:bg-white/5">
        Voir plus
      </Button>
    </motion.div>
  )
}

