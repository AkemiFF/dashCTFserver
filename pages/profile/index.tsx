"use client"

import { ActivityFeed } from "@/components/activity-feed"
import { BadgesSection } from "@/components/badges-section"
import { ContributionGraph } from "@/components/contribution-graph"
import ProfileHeader from "@/components/profile-header"
import { ProjectsSection } from "@/components/projects-section"
import { SkillsSection } from "@/components/skills-section"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"
import { Activity, BookOpen, Code2, GitBranch, Terminal, Trophy } from "lucide-react"
import { useEffect, useState } from "react"

export default function ProfilePage() {
  const [init, setInit] = useState(false)

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

  // Sample user data
  const userData = {
    id: "user123",
    name: "Alex Durand",
    username: "0xalexcode",
    avatar: "/placeholder.svg?height=150&width=150",
    coverImage: "/placeholder.svg?height=400&width=1200",
    bio: "Développeur full-stack & ethical hacker | Contributeur open source | Passionné de cybersécurité et d'IA | Toujours à la recherche de nouveaux défis techniques",
    location: "Paris, France",
    joinedDate: "Membre depuis Mars 2022",
    website: "https://alexdurand.dev",
    github: "github.com/0xalexcode",
    gitlab: "gitlab.com/0xalexcode",
    stackoverflow: "stackoverflow.com/users/0xalexcode",
    hackthebox: "hackthebox.com/0xalexcode",
    level: 42,
    contributionPoints: 8756,
    rank: "Expert",
    followers: 1243,
    following: 567,
    posts: 89,
    achievements: [
      { id: 1, name: "Bug Hunter", icon: "bug", description: "A trouvé et corrigé 50 bugs critiques" },
      {
        id: 2,
        name: "Open Source Hero",
        icon: "git-branch",
        description: "100+ contributions à des projets open source",
      },
      { id: 3, name: "Mentor", icon: "users", description: "A aidé 25+ développeurs débutants" },
      { id: 4, name: "CTF Champion", icon: "flag", description: "Vainqueur de 5 compétitions Capture The Flag" },
    ],
    skills: [
      { name: "JavaScript", level: 95, category: "language" },
      { name: "TypeScript", level: 90, category: "language" },
      { name: "Python", level: 85, category: "language" },
      { name: "Rust", level: 75, category: "language" },
      { name: "Go", level: 70, category: "language" },
      { name: "React", level: 92, category: "framework" },
      { name: "Node.js", level: 88, category: "framework" },
      { name: "Next.js", level: 85, category: "framework" },
      { name: "Docker", level: 80, category: "tool" },
      { name: "Kubernetes", level: 75, category: "tool" },
      { name: "AWS", level: 82, category: "cloud" },
      { name: "Penetration Testing", level: 88, category: "security" },
      { name: "Network Security", level: 85, category: "security" },
      { name: "Cryptography", level: 78, category: "security" },
      { name: "Reverse Engineering", level: 80, category: "security" },
    ],
    projects: [
      {
        id: 1,
        name: "SecureAuth",
        description: "Système d'authentification multi-facteurs open source avec support pour WebAuthn et FIDO2",
        stars: 342,
        forks: 87,
        language: "TypeScript",
        link: "https://github.com/0xalexcode/secure-auth",
        image: "/placeholder.svg?height=200&width=400",
      },
      {
        id: 2,
        name: "NetScanPro",
        description: "Outil avancé de scan de vulnérabilités réseau avec reporting automatisé",
        stars: 256,
        forks: 62,
        language: "Python",
        link: "https://github.com/0xalexcode/netscanpro",
        image: "/placeholder.svg?height=200&width=400",
      },
      {
        id: 3,
        name: "BlockGuard",
        description: "Framework de sécurité pour applications blockchain et smart contracts",
        stars: 189,
        forks: 45,
        language: "Solidity/Rust",
        link: "https://github.com/0xalexcode/blockguard",
        image: "/placeholder.svg?height=200&width=400",
      },
    ],
    recentActivity: [
      {
        id: 1,
        type: "commit",
        project: "SecureAuth",
        description: "Ajout du support pour les clés de sécurité FIDO2",
        timestamp: "Il y a 2 jours",
      },
      {
        id: 2,
        type: "issue",
        project: "React Router",
        description: "Correction d'un bug dans la gestion des routes imbriquées",
        timestamp: "Il y a 5 jours",
      },
      {
        id: 3,
        type: "pull_request",
        project: "TensorFlow",
        description: "Optimisation des performances pour les modèles de NLP",
        timestamp: "Il y a 1 semaine",
      },
      {
        id: 4,
        type: "hackathon",
        project: "HackParis 2023",
        description: "2ème place au challenge de cybersécurité",
        timestamp: "Il y a 2 semaines",
      },
      {
        id: 5,
        type: "article",
        project: "Blog personnel",
        description: "Publication: 'Techniques avancées de reverse engineering'",
        timestamp: "Il y a 3 semaines",
      },
    ],
    badges: [
      { id: 1, name: "Python Master", icon: "python", level: "gold" },
      { id: 2, name: "React Expert", icon: "react", level: "gold" },
      { id: 3, name: "Security Specialist", icon: "shield", level: "gold" },
      { id: 4, name: "Cloud Architect", icon: "cloud", level: "silver" },
      { id: 5, name: "Database Guru", icon: "database", level: "silver" },
      { id: 6, name: "DevOps Engineer", icon: "server", level: "silver" },
      { id: 7, name: "Mobile Developer", icon: "smartphone", level: "bronze" },
      { id: 8, name: "UI/UX Designer", icon: "layout", level: "bronze" },
    ],
    contributionData: [
      { month: "Jan", contributions: 45 },
      { month: "Fév", contributions: 52 },
      { month: "Mar", contributions: 38 },
      { month: "Avr", contributions: 65 },
      { month: "Mai", contributions: 78 },
      { month: "Juin", contributions: 92 },
      { month: "Juil", contributions: 86 },
      { month: "Août", contributions: 74 },
      { month: "Sep", contributions: 103 },
      { month: "Oct", contributions: 121 },
      { month: "Nov", contributions: 98 },
      { month: "Déc", contributions: 110 },
    ],
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
        <ProfileHeader user={userData} />

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
                    Suivez votre progression dans différents domaines techniques et découvrez de nouvelles compétences à
                    acquérir.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <Card className="bg-white/5 border border-white/10">
                      <div className="p-4">
                        <h4 className="font-semibold">Cybersécurité Avancée</h4>
                        <div className="flex items-center mt-2">
                          <div className="w-full bg-white/10 rounded-full h-2.5 mr-2">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full w-[75%]"></div>
                          </div>
                          <span className="text-sm">75%</span>
                        </div>
                      </div>
                    </Card>
                    <Card className="bg-white/5 border border-white/10">
                      <div className="p-4">
                        <h4 className="font-semibold">Architecture Cloud</h4>
                        <div className="flex items-center mt-2">
                          <div className="w-full bg-white/10 rounded-full h-2.5 mr-2">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full w-[60%]"></div>
                          </div>
                          <span className="text-sm">60%</span>
                        </div>
                      </div>
                    </Card>
                    <Card className="bg-white/5 border border-white/10">
                      <div className="p-4">
                        <h4 className="font-semibold">Intelligence Artificielle</h4>
                        <div className="flex items-center mt-2">
                          <div className="w-full bg-white/10 rounded-full h-2.5 mr-2">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full w-[45%]"></div>
                          </div>
                          <span className="text-sm">45%</span>
                        </div>
                      </div>
                    </Card>
                    <Card className="bg-white/5 border border-white/10">
                      <div className="p-4">
                        <h4 className="font-semibold">Blockchain Development</h4>
                        <div className="flex items-center mt-2">
                          <div className="w-full bg-white/10 rounded-full h-2.5 mr-2">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full w-[30%]"></div>
                          </div>
                          <span className="text-sm">30%</span>
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

