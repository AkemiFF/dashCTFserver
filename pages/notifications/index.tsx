"use client"

import { useState, useEffect } from "react"
import { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { useToast } from "@/components/ui/use-toast"
import type { NextPage } from "next"

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
    <div className="p-10">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <p>Simple notifications page with explicit types.</p>
    </div>
  )
}

export default NotificationsPage

