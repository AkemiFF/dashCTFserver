"use client"

import React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  BookOpen,
  Shield,
  Terminal,
  Trophy,
  Settings,
  HelpCircle,
  MessageCircle,
  Bell,
  Flame,
  FileText,
  Laptop,
  Zap,
  Lock,
  Search,
  Bug,
  Network,
  Key,
} from "lucide-react"
import type { UserProfile } from "@/services/user-service"

interface SidebarProps {
  userProfile: UserProfile | null
}

export function Sidebar({ userProfile }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: BookOpen, label: "Courses", active: false },
    { icon: Shield, label: "Challenges", active: false, notifications: 2 },
    { icon: Terminal, label: "OSINT Framework", active: false },
    { icon: Trophy, label: "Leaderboard", active: false },
    { icon: MessageCircle, label: "Community", active: false },
    { icon: Bell, label: "Notifications", active: false, notifications: 3 },
    { icon: FileText, label: "Documentation", active: false },
  ]

  const bottomItems = [
    { icon: Settings, label: "Settings" },
    { icon: HelpCircle, label: "Help & Support" },
  ]

  // Map icon strings to actual components
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      Laptop,
      Zap,
      Lock,
      Search,
      Bug,
      Network,
      Key,
      Shield,
      Flame,
    }

    return iconMap[iconName] || Laptop
  }

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
            <AvatarImage src={userProfile?.avatar || "/placeholder.svg?height=56&width=56"} alt="@user" />
            <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              {userProfile?.displayName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-white">{userProfile?.displayName || "Loading..."}</h3>
            <p className="text-sm text-white/60">{userProfile?.role || "Ethical Hacker"}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="p-2 rounded-lg bg-white/5">
            <div className="font-semibold text-white">{userProfile?.coursesCompleted || 0}</div>
            <div className="text-xs text-white/60">Courses</div>
          </div>
          <div className="p-2 rounded-lg bg-white/5">
            <div className="font-semibold text-white">{userProfile?.challengesCompleted || 0}</div>
            <div className="text-xs text-white/60">Challenges</div>
          </div>
          <div className="p-2 rounded-lg bg-white/5">
            <div className="font-semibold text-white">{userProfile?.totalPoints?.toLocaleString() || 0}</div>
            <div className="text-xs text-white/60">Points</div>
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

      {/* Skills Section */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Flame className="h-4 w-4 text-pink-500" />
          My Skills
        </h3>
        <div className="space-y-2">
          {userProfile?.skills?.map((skill, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <div className="flex items-center gap-2">
                {React.createElement(getIconComponent(skill.icon), { className: "h-4 w-4 text-pink-400" })}
                <span className="text-sm">{skill.name}</span>
              </div>
              <Badge variant="outline" className="bg-white/10 text-xs">
                {skill.level}
              </Badge>
            </div>
          ))}
        </div>
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
