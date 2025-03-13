"use client"

import { FriendRequests } from "@/components/friend-requests"
import { FriendSearch } from "@/components/friend-search"
import { FriendSuggestions } from "@/components/friend-suggestions"
import { FriendsList } from "@/components/friends-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function FriendsPage() {
  const [init, setInit] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("friends")

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
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
        <div className="max-w-5xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
              Réseau de développeurs
            </h1>
            <p className="text-white/70">Connectez-vous avec d'autres développeurs, hackers et passionnés de tech</p>
          </div>

          {/* Search and filters */}
          <div className="mb-8">
            <FriendSearch onSearch={setSearchQuery} />
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <Tabs defaultValue="friends" onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-full p-1">
                  <TabsTrigger
                    value="friends"
                    className={cn(
                      "rounded-full px-6",
                      activeTab === "friends" && "bg-gradient-to-r from-pink-500 to-purple-600 text-white",
                    )}
                  >
                    Amis
                  </TabsTrigger>
                  <TabsTrigger
                    value="requests"
                    className={cn(
                      "rounded-full px-6",
                      activeTab === "requests" && "bg-gradient-to-r from-pink-500 to-purple-600 text-white",
                    )}
                  >
                    Demandes <span className="ml-1 bg-pink-500 text-xs rounded-full px-1.5">3</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="discover"
                    className={cn(
                      "rounded-full px-6",
                      activeTab === "discover" && "bg-gradient-to-r from-pink-500 to-purple-600 text-white",
                    )}
                  >
                    Découvrir
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="friends" className="mt-0">
                <FriendsList searchQuery={searchQuery} />
              </TabsContent>

              <TabsContent value="requests" className="mt-0">
                <FriendRequests />
              </TabsContent>

              <TabsContent value="discover" className="mt-0">
                <FriendSuggestions searchQuery={searchQuery} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

