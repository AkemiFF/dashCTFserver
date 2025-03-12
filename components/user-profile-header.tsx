"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, Share2, MoreHorizontal, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface UserProfileHeaderProps {
  user: any
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
  const [showAllLinks, setShowAllLinks] = useState(false)

  return (
    <div className="w-full">
      {/* Cover Image */}
      <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden">
        <img src={user.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent opacity-70"></div>
      </div>

      {/* Profile Info Card */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 -mt-20 relative z-10">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Level */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-navy-950 shadow-xl">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  <span>Niveau {user.level}</span>
                </div>
              </div>
              {/* Contribution Points */}
              <div className="mt-6 flex flex-col items-center">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                  {user.contributionPoints}
                </div>
                <div className="text-xs text-white/70">points de contribution</div>
              </div>
              {/* Rank */}
              <Badge className="mt-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 border-none">
                {user.rank}
              </Badge>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-white/70">@{user.username}</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-none">
                    <Users className="h-4 w-4 mr-2" />
                    {user.connectionStatus === "friend" ? "Ami" : "Suivre"}
                  </Button>
                  <Button variant="ghost" className="bg-white/10 hover:bg-white/20">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-4 text-white/90">{user.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

