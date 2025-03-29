"use client"

import type React from "react"

import Layout from "@/components/admin/layout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authFetchAdmin } from "@/lib/api"
import { ADMIN_NAME, BASE_URL } from "@/lib/host"
import {
  AlertCircle,
  DockIcon as Docker,
  Download,
  Flag,
  Play,
  Plus,
  Search,
  Shield,
  Terminal,
  Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Types
interface Challenge {
  id: string
  title: string
  challenge_type: {
    id: string
    name: string
    slug: string
    icon: string
  }
  difficulty: "easy" | "medium" | "hard"
  description: string
  points: number
  is_active: boolean
  built_image: string
  created_at: string
}

export default function ChallengesPage() {
  const router = useRouter()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Fetch challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true)

        const response = await authFetchAdmin(`${BASE_URL}/api/ctf/challenges/`)
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des défis")
        }

        const data = await response.json()
        setChallenges(data.results)
        setFilteredChallenges(data.results)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [])

  // Filter challenges based on search query and active tab
  useEffect(() => {
    let filtered = challenges

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (challenge) =>
          challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          challenge.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((challenge) => {
        if (activeTab === "ssh") return challenge.challenge_type.slug === "ssh"
        if (activeTab === "web") return challenge.challenge_type.slug === "web"
        if (activeTab === "crypto") return challenge.challenge_type.slug === "crypto"
        return true
      })
    }

    setFilteredChallenges(filtered)
  }, [searchQuery, activeTab, challenges])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Get badge color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "hard":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  // Get icon based on challenge type
  const getChallengeTypeIcon = (type: string) => {
    switch (type) {
      case "ssh":
        return <Terminal className="h-4 w-4" />
      case "web":
        return <Globe className="h-4 w-4" />
      case "crypto":
        return <Lock className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
            Défis CTF
          </h1>

          <Button
            onClick={() => router.push(`${ADMIN_NAME}/challenges/add`)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un défi
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Rechercher un défi..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-white/5 border-white/10 text-white pl-10"
                />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList className="grid grid-cols-4 min-w-[300px]">
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="ssh">SSH</TabsTrigger>
                  <TabsTrigger value="web">Web</TabsTrigger>
                  <TabsTrigger value="crypto">Crypto</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-white/20 border-t-pink-500 rounded-full" />
          </div>
        ) : filteredChallenges.length === 0 ? (
          <Card className="border-dashed border-white/10 bg-white/5">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Flag className="h-12 w-12 text-white/30 mb-4" />
              <p className="text-white/70 text-center mb-4">Aucun défi trouvé. Créez votre premier défi CTF !</p>
              <Button
                onClick={() => router.push(`${ADMIN_NAME}/challenges/add`)}
                variant="outline"
                className="border-white/10 text-white hover:bg-white/10"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un défi
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <Card
                key={challenge.id}
                className="border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-white/20"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge className={`${getDifficultyColor(challenge.difficulty)} mb-2`}>
                      {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 border-white/20">
                      {getChallengeTypeIcon(challenge.challenge_type.slug)}
                      {challenge.challenge_type.name}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{challenge.title}</CardTitle>
                  <CardDescription className="text-white/70">{challenge.points} points</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="prose prose-invert prose-sm max-w-none opacity-80 line-clamp-3 mb-4">
                    <div dangerouslySetInnerHTML={{ __html: challenge.description.substring(0, 150) + "..." }} />
                  </div>

                  <Separator className="my-4 bg-white/10" />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {challenge.built_image ? (
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                          <Docker className="h-3 w-3 mr-1" />
                          Image prête
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          <Docker className="h-3 w-3 mr-1" />
                          Non construite
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => router.push(`${ADMIN_NAME}/challenges/${challenge.id}`)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/70 hover:text-green-400 hover:bg-green-500/10"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/70 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

// Missing icons
const Globe = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const Lock = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

