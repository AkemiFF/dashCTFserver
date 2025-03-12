"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Calendar,
  Globe,
  Github,
  GitlabIcon as GitlabFilled,
  SquareStackIcon as StackIcon,
  Shield,
  Users,
  MessageSquare,
  Edit,
  Share2,
  MoreHorizontal,
  ChevronUp,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfileHeaderProps {
  user: any
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [showAllLinks, setShowAllLinks] = useState(false)

  return (
    <div className="w-full">
      {/* Cover Image */}
      <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden">
        <img src={user.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent opacity-70"></div>

        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 bg-white/10 backdrop-blur-md hover:bg-white/20"
        >
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>

      {/* Profile Info Card */}
      <Card className="backdrop-blur-xl bg-white/5 border border-white/10 -mt-20 relative z-10">
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
                    Suivre
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

              {/* User Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-xl font-bold">{user.followers}</div>
                  <div className="text-xs text-white/70">Abonnés</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{user.following}</div>
                  <div className="text-xs text-white/70">Abonnements</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{user.posts}</div>
                  <div className="text-xs text-white/70">Publications</div>
                </div>
              </div>

              {/* User Details */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex items-center text-sm text-white/70">
                  <MapPin className="h-4 w-4 mr-2 text-pink-500" />
                  {user.location}
                </div>
                <div className="flex items-center text-sm text-white/70">
                  <Calendar className="h-4 w-4 mr-2 text-pink-500" />
                  {user.joinedDate}
                </div>
                <div className="flex items-center text-sm text-white/70">
                  <Globe className="h-4 w-4 mr-2 text-pink-500" />
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-500 transition-colors"
                  >
                    {user.website.replace("https://", "")}
                  </a>
                </div>
                <div className="flex items-center text-sm text-white/70">
                  <Github className="h-4 w-4 mr-2 text-pink-500" />
                  <a
                    href={`https://${user.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-500 transition-colors"
                  >
                    {user.github}
                  </a>
                </div>
              </div>

              {/* External Links */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Liens externes</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => setShowAllLinks(!showAllLinks)}
                  >
                    {showAllLinks ? "Voir moins" : "Voir tous"}
                    <ChevronUp className={cn("h-3 w-3 ml-1 transition-transform", !showAllLinks && "rotate-180")} />
                  </Button>
                </div>

                <div className={cn("grid gap-2 mt-2", showAllLinks ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
                  <a
                    href={`https://${user.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Github className="h-4 w-4 mr-2 text-pink-500" />
                    <span className="text-sm">{user.github}</span>
                  </a>

                  <a
                    href={`https://${user.gitlab}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <GitlabFilled className="h-4 w-4 mr-2 text-pink-500" />
                    <span className="text-sm">{user.gitlab}</span>
                  </a>

                  {showAllLinks && (
                    <>
                      <a
                        href={`https://${user.stackoverflow}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <StackIcon className="h-4 w-4 mr-2 text-pink-500" />
                        <span className="text-sm">{user.stackoverflow}</span>
                      </a>

                      <a
                        href={`https://${user.hackthebox}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <Shield className="h-4 w-4 mr-2 text-pink-500" />
                        <span className="text-sm">{user.hackthebox}</span>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export { ProfileHeader }

