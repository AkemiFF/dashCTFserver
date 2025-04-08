"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserBaseData } from "@/services/types/users"
import { motion } from "framer-motion"
import {
  Bell,
  Bookmark,
  Calendar,
  Compass,
  HelpCircle,
  Home,
  MessageCircle,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react"
import { useRouter } from "next/router"

export function Sidebar({ userData }: { userData: UserBaseData }) {
  const router = useRouter()
  const menuItems = [
    { icon: Home, label: "Accueil", active: true, link: "/" },
    { icon: Compass, label: "Explorer", active: false, link: "/explorer" },
    { icon: TrendingUp, label: "Tendances", active: false, link: "/tendances" },
    { icon: MessageCircle, label: "Messages", active: false, notifications: 3, link: "/messages" },
    { icon: Bell, label: "Notifications", active: false, notifications: 5, link: "/notifications" },
    { icon: Bookmark, label: "Enregistrés", active: false, link: "/enregistres" },
    { icon: Users, label: "Followers", active: false, link: "/followers" },
    { icon: Calendar, label: "Événements", active: false, link: "/events" },
  ]

  const bottomItems = [
    { icon: Settings, label: "Paramètres" },
    { icon: HelpCircle, label: "Aide" },
  ]

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4"
      >
        <div className="flex items-center space-x-4">
          <Avatar className="h-14 w-14 border-2 border-pink-500">
            <AvatarImage src={userData.avatar} alt="@user" />
            <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">JD</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-white">{userData.name}</h3>
            <p className="text-sm text-white/60">@{userData.username.toLowerCase()}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="p-2 rounded-lg bg-white/5">
            <div className="font-semibold text-white">{userData.post_count}</div>
            <div className="text-xs text-white/60">Posts</div>
          </div>
          <div className="p-2 rounded-lg bg-white/5">
            <div className="font-semibold text-white">{userData.followers_count}</div>
            <div className="text-xs text-white/60">Abonnés</div>
          </div>
          <div className="p-2 rounded-lg bg-white/5">
            <div className="font-semibold text-white">{userData.following_count}</div>
            <div className="text-xs text-white/60">Suivis</div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Menu */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-3">
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`w-full justify-start text-base font-normal ${item.active
                ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white"
                : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              onClick={() => router.push(item.link)}
            >
              <item.icon className={`mr-3 h-5 w-5 ${item.active ? "text-pink-500" : ""}`} />
              {item.label}
              {item.notifications && <Badge className="ml-auto bg-pink-500 text-white">{item.notifications}</Badge>}
            </Button>
          ))}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-3">
        <nav className="space-y-1">
          {bottomItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-base font-normal text-white/70 hover:text-white hover:bg-white/5"
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}

