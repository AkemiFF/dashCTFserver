"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Users,
  Bookmark,
  Calendar,
  Settings,
  HelpCircle,
  MessageCircle,
  Bell,
  Compass,
  TrendingUp,
} from "lucide-react"

export function Sidebar() {
  const menuItems = [
    { icon: Home, label: "Accueil", active: true },
    { icon: Compass, label: "Explorer", active: false },
    { icon: TrendingUp, label: "Tendances", active: false },
    { icon: MessageCircle, label: "Messages", active: false, notifications: 3 },
    { icon: Bell, label: "Notifications", active: false, notifications: 5 },
    { icon: Bookmark, label: "Enregistrés", active: false },
    { icon: Users, label: "Amis", active: false },
    { icon: Calendar, label: "Événements", active: false },
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
            <AvatarImage src="/placeholder.svg?height=56&width=56" alt="@user" />
            <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">JD</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-white">Jean Dupont</h3>
            <p className="text-sm text-white/60">@jeandupont</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="p-2 rounded-lg bg-white/5">
            <div className="font-semibold text-white">248</div>
            <div className="text-xs text-white/60">Posts</div>
          </div>
          <div className="p-2 rounded-lg bg-white/5">
            <div className="font-semibold text-white">1.2K</div>
            <div className="text-xs text-white/60">Abonnés</div>
          </div>
          <div className="p-2 rounded-lg bg-white/5">
            <div className="font-semibold text-white">652</div>
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
              className={`w-full justify-start text-base font-normal ${
                item.active
                  ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
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

