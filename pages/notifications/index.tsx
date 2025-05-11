"use client"

import { NotificationsFilter } from "@/components/notifications-filter"
import { NotificationsList } from "@/components/notifications-list"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"
import { Bell, CheckCheck } from "lucide-react"
import type { NextPage } from "next"
import { useEffect, useState } from "react"

// Types for notifications
export interface Notification {
  id: string
  type: "friend_request" | "mention" | "comment" | "like" | "project" | "achievement" | "system"
  content: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  user?: {
    id: string
    name: string
    username: string
    avatar: string
  }
  project?: {
    id: string
    name: string
  }
}

const NotificationsPage: NextPage = () => {
  const [init, setInit] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { toast } = useToast()

  // Initialize particles
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  // Load notifications (in a real app, this would be an API call)
  useEffect(() => {
    // Sample notifications data
    const sampleNotifications: Notification[] = [
      {
        id: "1",
        type: "friend_request",
        content: "a envoyé une demande d'ami",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        actionUrl: "/friends",
        user: {
          id: "user1",
          name: "Thomas Lefèvre",
          username: "tlefevre",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      },
      {
        id: "2",
        type: "mention",
        content: "vous a mentionné dans un commentaire",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        actionUrl: "/posts/123",
        user: {
          id: "user2",
          name: "Marie Dubois",
          username: "m_dubois",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      },
      {
        id: "3",
        type: "comment",
        content: "a commenté votre publication sur l'intelligence artificielle",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: true,
        actionUrl: "/posts/456",
        user: {
          id: "user3",
          name: "Emma Martin",
          username: "emma_dev",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      },
      {
        id: "4",
        type: "like",
        content: "a aimé votre projet",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: false,
        actionUrl: "/projects/789",
        user: {
          id: "user4",
          name: "Lucas Moreau",
          username: "lmoreau",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        project: {
          id: "proj1",
          name: "SecureAuth",
        },
      },
      {
        id: "5",
        type: "project",
        content: "vous a invité à collaborer sur un projet",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
        read: true,
        actionUrl: "/projects/101",
        user: {
          id: "user5",
          name: "Sophie Laurent",
          username: "sophie_l",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        project: {
          id: "proj2",
          name: "DataViz Platform",
        },
      },
      {
        id: "6",
        type: "achievement",
        content: "Félicitations ! Vous avez débloqué le badge 'Code Warrior'",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        read: false,
        actionUrl: "/profile#achievements",
      },
      {
        id: "7",
        type: "system",
        content: "Votre compte a été vérifié avec succès",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
        read: true,
        actionUrl: "/settings",
      },
      {
        id: "8",
        type: "friend_request",
        content: "a accepté votre demande d'ami",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
        read: true,
        actionUrl: "/profile/chloepetit",
        user: {
          id: "user6",
          name: "Chloé Petit",
          username: "chloepetit",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      },
      {
        id: "9",
        type: "mention",
        content: "vous a mentionné dans une discussion",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120), // 5 days ago
        read: true,
        actionUrl: "/messages",
        user: {
          id: "user7",
          name: "Gabriel Rousseau",
          username: "g_rousseau",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      },
      {
        id: "10",
        type: "comment",
        content: "a répondu à votre commentaire",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 144), // 6 days ago
        read: true,
        actionUrl: "/posts/789",
        user: {
          id: "user8",
          name: "Léa Mercier",
          username: "lea_m",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      },
    ]

    setNotifications(sampleNotifications)
  }, [])

  // Particles options
  const particlesOptions = {
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ff1493",
      },
      links: {
        enable: true,
        color: "#ff1493",
        opacity: 0.2,
      },
      move: {
        enable: true,
        speed: 0.5,
      },
      size: {
        value: 2,
      },
      opacity: {
        value: 0.5,
      },
    },
    background: {
      color: {
        value: "transparent",
      },
    },
  }

  // Filter notifications based on active filter
  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true
    if (activeFilter === "unread") return !notification.read
    return notification.type === activeFilter
  })

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      })),
    )

    toast({
      title: "Notifications marquées comme lues",
      description: "Toutes vos notifications ont été marquées comme lues",
    })
  }

  // Mark a single notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
            ...notification,
            read: true,
          }
          : notification,
      ),
    )
  }

  // Count unread notifications
  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Particles Background */}
      {init && <Particles id="tsparticles" options={particlesOptions} className="absolute inset-0 z-0" />}

      <SiteHeader unreadNotifications={0} />
      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Notifications</h1>
                <p className="text-gray-400">Restez informé des activités qui vous concernent</p>
              </div>
            </div>

            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="outline"
                className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Tout marquer comme lu
                {unreadCount > 0 && (
                  <span className="ml-2 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5">{unreadCount}</span>
                )}
              </Button>
            )}
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-2 border border-white/10"
          >
            <NotificationsFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          </motion.div>
        </motion.div>

        {/* Notifications List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <NotificationsList notifications={filteredNotifications} onMarkAsRead={handleMarkAsRead} />
        </motion.div>
      </div>
    </div>
  )
}

export default NotificationsPage

