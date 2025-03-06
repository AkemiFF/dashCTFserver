"use client"

import { useEffect, useState } from "react"

interface Announcement {
  id: number
  content: string
  isAdmin: boolean
}

interface Ad {
  id: number
  title: string
  imageUrl: string
  link: string
}

const sampleAnnouncements: Announcement[] = [
  { id: 1, content: "Nouvelle mise à jour de sécurité disponible !", isAdmin: true },
  { id: 2, content: "Webinaire sur l'IA ce vendredi à 18h", isAdmin: true },
  { id: 3, content: "Participez à notre hackathon annuel !", isAdmin: false },
]

const sampleAds: Ad[] = [
  {
    id: 1,
    title: "Cours de cybersécurité en ligne",
    imageUrl: "/ads/cybersecurity-course.jpg",
    link: "https://example.com/cybersecurity-course",
  },
  {
    id: 2,
    title: "Nouveau IDE pour développeurs",
    imageUrl: "/ads/new-ide.jpg",
    link: "https://example.com/new-ide",
  },
]

export function SidebarHome() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div
      className={`w-80 bg-gray-800 p-4 rounded-lg border border-green-500 shadow-lg shadow-green-500/20 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"
        }`}
    >
      <h2 className="text-xl font-bold mb-4 text-green-400">Annonces importantes</h2>
      <div className="space-y-4 mb-8">
        {sampleAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className={`p-3 rounded-lg ${announcement.isAdmin ? "bg-red-900/30 border border-red-500" : "bg-gray-700"}`}
          >
            {announcement.isAdmin && <span className="text-xs font-semibold text-red-400 mb-1 block">ADMIN</span>}
            <p className="text-sm text-gray-300">{announcement.content}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4 text-green-400">Publicités</h2>
      <div className="space-y-4">
        {sampleAds.map((ad) => (
          <a
            key={ad.id}
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <img
              src={ad.imageUrl || "/placeholder.svg"}
              alt={ad.title}
              className="w-full h-32 object-cover rounded-lg mb-2"
            />
            <p className="text-sm font-semibold text-green-400">{ad.title}</p>
          </a>
        ))}
      </div>
    </div>
  )
}

