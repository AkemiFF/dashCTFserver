"use client"

import { ActivityFeed } from "@/components/activity-feed"
import { BadgesSection } from "@/components/badges-section"
import { ContributionGraph } from "@/components/contribution-graph"
import ProfileHeader from "@/components/profile-header"
import { ProfileOnboarding } from "@/components/profile-onboarding"
import { ProjectsSection } from "@/components/projects-section"
import { SkillsSection } from "@/components/skills-section"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { authFetch } from "@/lib/api"
import { BASE_URL } from "@/lib/host"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"
import { Activity, BookOpen, Code2, GitBranch, Terminal, Trophy } from "lucide-react"
import { useEffect, useState } from "react"

export default function ProfilePage() {
  const [init, setInit] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const fetchAllData = async () => {
    try {
      const response = await authFetch(`${BASE_URL}/api/auth/user/`)
      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }
      const full_data = await authFetch(`${BASE_URL}/api/accounts/users/me/`)
      if (!full_data.ok) {
        throw new Error("Failed to fetch full_data")
      }
      const userData = await response.json()
      const fullData = await full_data.json()

      // Update profile data with fetched data
      setProfileData({
        id: fullData.id,
        name: fullData.name || fullData.profile?.display_name || "",
        username: fullData.username,
        avatar: fullData.photo || "/placeholder.svg?height=150&width=150",
        coverImage: fullData.photo || "/placeholder.svg?height=400&width=1200",
        bio: fullData.bio || "",
        location: fullData.profile?.location || "",
        joinedDate: `Membre depuis ${new Date(fullData.date_joined).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`,
        website: fullData.website_url || "",
        github: fullData.github_url || "",
        level: 0,
        contributionPoints: 0,
        rank: fullData.role || "student",
        followers: userData.followers_count || 0,
        following: userData.following_count || 0,
        posts: userData.post_count || 0,
        skills:
          fullData.profile?.skills?.map((skill: any) => ({
            id: skill.id,
            name: skill.name,
            level: 80,
            category: skill.skill_type,
          })) || [],
        user_projects:
          fullData.user_projects?.map((project: any) => ({
            id: project.id,
            name: project.project_name,
            description: project.description,
            stars: 0,
            forks: 0,
            language: project.language,
            link: project.link,
            image: project.image || "/placeholder.svg?height=200&width=400",
          })) || [],
        profileCompleted: !!(fullData.bio && fullData.profile?.location),
      })

      // Set onboarding visibility based on profile completion
      setShowOnboarding(!fullData.bio || !fullData.profile?.location)
      setIsLoading(false)

      console.log("User data:", userData)
      console.log("User full data:", fullData)
    } catch (error) {
      console.error("Error fetching user data:", error)
      setIsLoading(false)
    }
  }
  // Simulate fetching user data and checking if profile is complete
  useEffect(() => {
    fetchAllData()
  }, [])

  const handleProfileComplete = (formData: any) => {
    // In a real app, you would send this data to your backend
    console.log("Profile data submitted:", formData)

    // Update local state with the new profile data
    setProfileData((prev: any) => ({
      ...prev,
      ...formData,
      profileCompleted: true,
    }))

    // Store completion status in localStorage (for demo purposes)
    localStorage.setItem("profileCompleted", "true")

    // Close the onboarding dialog
    setShowOnboarding(false)

    // Show success toast
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully saved.",
      variant: "default",
    })
  }

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-pink-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white/70">Loading profile...</p>
        </div>
      </div>
    )
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

      <Toaster />

      <main className="container mx-auto px-4 pt-20 pb-16 relative z-10">
        {profileData && <ProfileHeader user={profileData} />}

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
                        {profileData?.contributionData?.length > 0 ? (
                          <ContributionGraph data={profileData.contributionData} />
                        ) : (
                          <div className="text-center py-8 text-white/70">
                            <p>No contribution data available yet.</p>
                            <Button
                              variant="outline"
                              className="mt-4 border-white/10 hover:bg-white/5"
                              onClick={() => setShowOnboarding(true)}
                            >
                              Complete Your Profile
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {profileData?.user_projects?.length > 0 ? (
                      <ProjectsSection projects={profileData.user_projects} />
                    ) : (
                      <Card className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-4 flex items-center">
                            <GitBranch className="h-5 w-5 mr-2 text-pink-500" />
                            Projects
                          </h3>
                          <div className="text-center py-8 text-white/70">
                            <p>No projects added yet.</p>
                            <Button
                              variant="outline"
                              className="mt-4 border-white/10 hover:bg-white/5"
                              onClick={() => setShowOnboarding(true)}
                            >
                              Add Your Projects
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}
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
                        {profileData?.skills?.length > 0 ? (
                          <div className="space-y-4">
                            {profileData.skills.slice(0, 5).map((skill: any) => (
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
                            <Button variant="ghost" className="w-full mt-4 border border-white/10 hover:bg-white/5">
                              Voir toutes les compétences
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center py-4 text-white/70">
                            <p>No skills added yet.</p>
                            <Button
                              variant="outline"
                              className="mt-4 border-white/10 hover:bg-white/5"
                              onClick={() => setShowOnboarding(true)}
                            >
                              Add Your Skills
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {profileData?.badges?.length > 0 ? (
                      <BadgesSection badges={profileData.badges} />
                    ) : (
                      <Card className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-4 flex items-center">
                            <Trophy className="h-5 w-5 mr-2 text-pink-500" />
                            Badges
                          </h3>
                          <div className="text-center py-4 text-white/70">
                            <p>Complete challenges to earn badges!</p>
                          </div>
                        </div>
                      </Card>
                    )}
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
                        {profileData?.recentActivity?.length > 0 ? (
                          <>
                            <ActivityFeed activities={profileData.recentActivity.slice(0, 3)} />
                            <Button variant="ghost" className="w-full mt-4 border border-white/10 hover:bg-white/5">
                              Voir toute l'activité
                            </Button>
                          </>
                        ) : (
                          <div className="text-center py-4 text-white/70">
                            <p>No recent activity.</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-6">
              {profileData?.user_projects?.length > 0 ? (
                <ProjectsSection projects={profileData.user_projects} showAll={true} />
              ) : (
                <Card className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-4">Projects</h3>
                    <p className="text-white/70 mb-4">You haven't added any projects yet.</p>
                    <Button
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      onClick={() => setShowOnboarding(true)}
                    >
                      Complete Your Profile
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="skills" className="mt-6">
              {profileData?.skills?.length > 0 ? (
                <SkillsSection skills={profileData.skills} />
              ) : (
                <Card className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-4">Skills</h3>
                    <p className="text-white/70 mb-4">You haven't added any skills yet.</p>
                    <Button
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      onClick={() => setShowOnboarding(true)}
                    >
                      Add Your Skills
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              {profileData?.badges?.length > 0 ? (
                <BadgesSection badges={profileData.badges} showAll={true} />
              ) : (
                <Card className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-4">Achievements</h3>
                    <p className="text-white/70 mb-4">Complete challenges to earn badges and achievements!</p>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">Activité Complète</h3>
                  {profileData?.recentActivity?.length > 0 ? (
                    <ActivityFeed activities={profileData.recentActivity} />
                  ) : (
                    <div className="text-center py-8 text-white/70">
                      <p>No activity recorded yet.</p>
                      <p className="mt-2">Start contributing to projects to see your activity here!</p>
                    </div>
                  )}
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

      {/* Profile Onboarding Dialog */}
      {showOnboarding && (
        <ProfileOnboarding
          open={showOnboarding}
          onOpenChange={setShowOnboarding}
          onComplete={handleProfileComplete}
          initialData={profileData}
        />
      )}
    </div>
  )
}

