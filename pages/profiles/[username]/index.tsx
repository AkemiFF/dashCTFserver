"use client"

import { ActivityFeed } from "@/components/activity-feed"
import { BadgesSection } from "@/components/badges-section"
import { ContributionGraph } from "@/components/contribution-graph"
import { ProjectsSection } from "@/components/projects-section"
import { SkillsSection } from "@/components/skills-section"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfileHeader } from "@/components/user-profile-header"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"
import { Activity, BookOpen, Code2, GitBranch, Terminal, Trophy } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function UserProfilePage() {
  const [init, setInit] = useState(false)
  const params = useParams()
  const username = params?.username as string || ""

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

  // Sample user data - in a real app, you would fetch this based on the username
  const userData = {
    id: "user456",
    name: "Marie Laurent",
    username: username || "m_laurent",
    avatar: "/placeholder.svg?height=150&width=150",
    coverImage: "/placeholder.svg?height=400&width=1200",
    bio: "Frontend Developer & UX Designer | Open source enthusiast | Passionate about creating beautiful, accessible interfaces | Always learning new technologies",
    location: "Lyon, France",
    joinedDate: "Membre depuis Juin 2021",
    website: "https://marielaurent.dev",
    github: "github.com/marielaurent",
    gitlab: "gitlab.com/marielaurent",
    stackoverflow: "stackoverflow.com/users/marielaurent",
    hackthebox: "hackthebox.com/marielaurent",
    level: 38,
    contributionPoints: 6542,
    rank: "Advanced",
    connectionStatus: "not_connected", // can be "friend", "pending_outgoing", "pending_incoming", "not_connected"
    followers: 876,
    following: 432,
    posts: 67,
    achievements: [
      { id: 1, name: "UI Master", icon: "layout", description: "A créé 30+ interfaces utilisateur exceptionnelles" },
      {
        id: 2,
        name: "Accessibility Champion",
        icon: "eye",
        description: "Contribue activement à rendre le web accessible à tous",
      },
      { id: 3, name: "Community Helper", icon: "users", description: "A aidé 20+ développeurs débutants" },
    ],
    skills: [
      { name: "JavaScript", level: 92, category: "language" },
      { name: "TypeScript", level: 88, category: "language" },
      { name: "HTML/CSS", level: 95, category: "language" },
      { name: "React", level: 90, category: "framework" },
      { name: "Vue.js", level: 85, category: "framework" },
      { name: "Figma", level: 88, category: "tool" },
      { name: "Tailwind CSS", level: 92, category: "framework" },
      { name: "Next.js", level: 80, category: "framework" },
      { name: "UI/UX Design", level: 90, category: "skill" },
      { name: "Accessibility", level: 85, category: "skill" },
      { name: "Responsive Design", level: 93, category: "skill" },
      { name: "Animation", level: 87, category: "skill" },
      { name: "Performance Optimization", level: 82, category: "skill" },
      { name: "Git", level: 85, category: "tool" },
      { name: "Jest", level: 78, category: "tool" },
    ],
    projects: [
      {
        id: 1,
        name: "AccessUI",
        description:
          "Bibliothèque de composants React accessibles avec support ARIA complet et thèmes personnalisables",
        stars: 287,
        forks: 64,
        language: "TypeScript",
        link: "https://github.com/marielaurent/accessui",
        image: "/placeholder.svg?height=200&width=400",
      },
      {
        id: 2,
        name: "MotionKit",
        description: "Toolkit d'animations et de transitions pour applications web modernes",
        stars: 176,
        forks: 42,
        language: "JavaScript",
        link: "https://github.com/marielaurent/motionkit",
        image: "/placeholder.svg?height=200&width=400",
      },
      {
        id: 3,
        name: "DesignSystem",
        description: "Système de design complet et documenté pour applications d'entreprise",
        stars: 134,
        forks: 38,
        language: "TypeScript/CSS",
        link: "https://github.com/marielaurent/designsystem",
        image: "/placeholder.svg?height=200&width=400",
      },
    ],
    recentActivity: [
      {
        id: 1,
        type: "commit",
        project: "AccessUI",
        description: "Amélioration du contraste des composants pour WCAG 2.1 AAA",
        timestamp: "Il y a 3 jours",
      },
      {
        id: 2,
        type: "pull_request",
        project: "React",
        description: "Correction d'un bug d'accessibilité dans les composants de formulaire",
        timestamp: "Il y a 1 semaine",
      },
      {
        id: 3,
        type: "article",
        project: "Blog personnel",
        description: "Publication: 'Créer des interfaces accessibles sans sacrifier l'esthétique'",
        timestamp: "Il y a 2 semaines",
      },
      {
        id: 4,
        type: "hackathon",
        project: "UX Challenge 2023",
        description: "1ère place au challenge de design d'interface",
        timestamp: "Il y a 1 mois",
      },
    ],
    badges: [
      { id: 1, name: "React Master", icon: "react", level: "gold" },
      { id: 2, name: "UI Designer", icon: "layout", level: "gold" },
      { id: 3, name: "Accessibility Expert", icon: "eye", level: "gold" },
      { id: 4, name: "Animation Wizard", icon: "zap", level: "silver" },
      { id: 5, name: "TypeScript Pro", icon: "code", level: "silver" },
      { id: 6, name: "Frontend Architect", icon: "layers", level: "silver" },
      { id: 7, name: "Performance Guru", icon: "trending-up", level: "bronze" },
      { id: 8, name: "Testing Champion", icon: "check-circle", level: "bronze" },
    ],
    contributionData: [
      { month: "Jan", contributions: 38 },
      { month: "Fév", contributions: 42 },
      { month: "Mar", contributions: 56 },
      { month: "Avr", contributions: 48 },
      { month: "Mai", contributions: 62 },
      { month: "Juin", contributions: 79 },
      { month: "Juil", contributions: 84 },
      { month: "Août", contributions: 72 },
      { month: "Sep", contributions: 91 },
      { month: "Oct", contributions: 86 },
      { month: "Nov", contributions: 94 },
      { month: "Déc", contributions: 78 },
    ],
    mutualFriends: 12,
    mutualProjects: 3,
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



      <main className="container mx-auto px-4 pt-20 pb-16 relative z-10">
        <UserProfileHeader user={userData} />

        <div className="mt-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-6 md:w-fit mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-full p-1">
              <TabsTrigger
                value="overview"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600"
              >
                <Code2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Aperçu</span>
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600"
              >
                <GitBranch className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Projets</span>
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600"
              >
                <Terminal className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Compétences</span>
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600"
              >
                <Trophy className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Réussites</span>
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600"
              >
                <Activity className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Activité</span>
              </TabsTrigger>
              <TabsTrigger
                value="learning"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Formation</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                          <Activity className="h-5 w-5 mr-2 text-pink-500" />
                          Contributions
                        </h3>
                        <ContributionGraph data={userData.contributionData} />
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <ProjectsSection projects={userData.projects} />
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                          <Terminal className="h-5 w-5 mr-2 text-pink-500" />
                          Top Compétences
                        </h3>
                        <div className="space-y-4">
                          {userData.skills.slice(0, 5).map((skill) => (
                            <div key={skill.name}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">{skill.name}</span>
                                <span className="text-sm font-medium">{skill.level}%</span>
                              </div>
                              <div className="w-full bg-white/10 rounded-full h-2.5">
                                <div
                                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full"
                                  style={{ width: `${skill.level}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-4 border border-white/10 hover:bg-white/5">
                          Voir toutes les compétences
                        </Button>
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <BadgesSection badges={userData.badges} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Card className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                          <Activity className="h-5 w-5 mr-2 text-pink-500" />
                          Activité Récente
                        </h3>
                        <ActivityFeed activities={userData.recentActivity.slice(0, 3)} />
                        <Button variant="ghost" className="w-full mt-4 border border-white/10 hover:bg-white/5">
                          Voir toute l'activité
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-6">
              <ProjectsSection projects={userData.projects} showAll={true} />
            </TabsContent>

            <TabsContent value="skills" className="mt-6">
              <SkillsSection skills={userData.skills} />
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <BadgesSection badges={userData.badges} showAll={true} />
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">Activité Complète</h3>
                  <ActivityFeed activities={userData.recentActivity} />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="learning" className="mt-6">
              <Card className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">Parcours d'Apprentissage</h3>
                  <p className="text-white/70 mb-4">
                    Découvrez les domaines techniques dans lesquels {userData.name} se perfectionne.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <Card className="bg-white/5 border border-white/10">
                      <div className="p-4">
                        <h4 className="font-semibold">Design System Architecture</h4>
                        <div className="flex items-center mt-2">
                          <div className="w-full bg-white/10 rounded-full h-2.5 mr-2">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full w-[85%]"></div>
                          </div>
                          <span className="text-sm">85%</span>
                        </div>
                      </div>
                    </Card>
                    <Card className="bg-white/5 border border-white/10">
                      <div className="p-4">
                        <h4 className="font-semibold">Web Animation</h4>
                        <div className="flex items-center mt-2">
                          <div className="w-full bg-white/10 rounded-full h-2.5 mr-2">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full w-[78%]"></div>
                          </div>
                          <span className="text-sm">78%</span>
                        </div>
                      </div>
                    </Card>
                    <Card className="bg-white/5 border border-white/10">
                      <div className="p-4">
                        <h4 className="font-semibold">WebGL & 3D Graphics</h4>
                        <div className="flex items-center mt-2">
                          <div className="w-full bg-white/10 rounded-full h-2.5 mr-2">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full w-[65%]"></div>
                          </div>
                          <span className="text-sm">65%</span>
                        </div>
                      </div>
                    </Card>
                    <Card className="bg-white/5 border border-white/10">
                      <div className="p-4">
                        <h4 className="font-semibold">Mobile App Development</h4>
                        <div className="flex items-center mt-2">
                          <div className="w-full bg-white/10 rounded-full h-2.5 mr-2">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full w-[55%]"></div>
                          </div>
                          <span className="text-sm">55%</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

