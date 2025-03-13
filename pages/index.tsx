"use client"

import { CreatePostCard } from "@/components/create-post-card"
import { PostCard } from "@/components/post-card"
import { Sidebar } from "@/components/sidebar"
import { StoryCircle } from "@/components/story-circle"
import { TrendingTopics } from "@/components/trending-topics"
import { Button } from "@/components/ui/button"
import { UserSuggestions } from "@/components/user-suggestions"
import { authFetch } from "@/lib/api"
import { BASE_URL } from "@/lib/host"
import { cn } from "@/lib/utils"
import { DefaultUserData } from "@/types/default"
import { UserBaseData } from "@/types/users"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { AnimatePresence, motion } from "framer-motion"
import { PlusCircle, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export default function Home() {
  const [init, setInit] = useState(false)
  const [activeView, setActiveView] = useState<"feed" | "discover" | "trending">("feed")
  const [userData, setData] = useState<UserBaseData>(DefaultUserData)
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await fetchUserData();
      await loadSlim(engine);
    }).then(() => {
      setInit(true)
    })
  }, [])

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
  const fetchUserData = async () => {
    try {
      const response = await authFetch(`${BASE_URL}/api/auth/user/`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      setData(userData);
      console.log("User data:", userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  // Sample posts data
  const posts = [
    {
      id: 1,
      user: {
        name: "Sophie Martin",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      content:
        "Je viens de terminer mon nouveau projet d'IA ! Tellement excitée de partager les résultats avec vous tous. #IntelligenceArtificielle #Innovation",
      image: "/placeholder.svg?height=400&width=600",
      likes: 243,
      comments: 56,
      shares: 12,
      timeAgo: "2h",
      featured: true,
    },
    {
      id: 2,
      user: {
        name: "Thomas Dubois",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: false,
      },
      content:
        "Magnifique journée pour une randonnée en montagne ! La vue était à couper le souffle. Qui d'autre aime l'aventure en plein air ?",
      image: "/placeholder.svg?height=400&width=600",
      likes: 187,
      comments: 32,
      shares: 8,
      timeAgo: "4h",
      featured: false,
    },
    {
      id: 3,
      user: {
        name: "Emma Bernard",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      content:
        "Nouveau livre, nouvelle aventure ! Je vous recommande vivement cette lecture passionnante sur l'avenir de la technologie et son impact sur notre société.",
      likes: 98,
      comments: 24,
      shares: 5,
      timeAgo: "6h",
      featured: false,
    },
    {
      id: 4,
      user: {
        name: "Lucas Moreau",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: false,
      },
      content:
        "Qui serait intéressé par un webinaire sur les dernières tendances en développement web ? Je pense organiser quelque chose le mois prochain. #Dev #WebDev #Formation",
      image: "/placeholder.svg?height=400&width=600",
      likes: 156,
      comments: 47,
      shares: 23,
      timeAgo: "12h",
      featured: true,
    },
  ]

  // Sample stories data
  const stories = [
    { id: 1, user: { name: "Marie", avatar: "/placeholder.svg?height=60&width=60" }, active: true },
    { id: 2, user: { name: "Jean", avatar: "/placeholder.svg?height=60&width=60" }, active: true },
    { id: 3, user: { name: "Léa", avatar: "/placeholder.svg?height=60&width=60" }, active: true },
    { id: 4, user: { name: "Paul", avatar: "/placeholder.svg?height=60&width=60" }, active: false },
    { id: 5, user: { name: "Chloé", avatar: "/placeholder.svg?height=60&width=60" }, active: false },
    { id: 6, user: { name: "Hugo", avatar: "/placeholder.svg?height=60&width=60" }, active: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white relative overflow-hidden">
      {init && <Particles className="absolute inset-0" options={particlesOptions} />}

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -left-32 -top-32 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -right-32 -bottom-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>



      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24 self-start">
            <Sidebar userData={userData} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6 space-y-6">
            {/* View Selector */}
            <div className="flex justify-center mb-6">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-full p-1 flex">
                <Button
                  variant="ghost"
                  className={cn(
                    "rounded-full px-6",
                    activeView === "feed" && "bg-gradient-to-r from-pink-500 to-purple-600 text-white",
                  )}
                  onClick={() => setActiveView("feed")}
                >
                  Pour vous
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "rounded-full px-6",
                    activeView === "discover" && "bg-gradient-to-r from-pink-500 to-purple-600 text-white",
                  )}
                  onClick={() => setActiveView("discover")}
                >
                  Découvrir
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "rounded-full px-6",
                    activeView === "trending" && "bg-gradient-to-r from-pink-500 to-purple-600 text-white",
                  )}
                  onClick={() => setActiveView("trending")}
                >
                  Tendances
                </Button>
              </div>
            </div>

            {/* Stories */}
            <div className="relative">
              <div className="absolute inset-y-0 -left-4 flex items-center">
                <Button variant="ghost" className="rounded-full w-8 h-8 p-0 bg-white/10 backdrop-blur-md">
                  <PlusCircle className="h-5 w-5 text-pink-500" />
                </Button>
              </div>
              <div className="overflow-x-auto flex gap-4 py-2 px-6 scrollbar-hide">
                {stories.map((story) => (
                  <StoryCircle key={story.id} story={story} />
                ))}
              </div>
            </div>

            {/* Create Post */}
            <CreatePostCard />

            {/* Featured Post (Larger) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {posts
                .filter((post) => post.featured)
                .map((post) => (
                  <div key={post.id} className="mb-8 relative">
                    <div className="absolute -top-2 -left-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 z-10">
                      <Sparkles className="h-3 w-3" />
                      <span>Tendance</span>
                    </div>
                    <PostCard post={post} featured={true} />
                  </div>
                ))}
            </motion.div>

            {/* Regular Posts */}
            <div className="space-y-6">
              <AnimatePresence>
                {posts
                  .filter((post) => !post.featured)
                  .map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <PostCard post={post} />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 self-start">
            <TrendingTopics />
            <UserSuggestions />
          </div>
        </div>
      </main>
    </div>
  )
}

