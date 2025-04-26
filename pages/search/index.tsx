"use client"

import { SearchFilters } from "@/components/search-filters"
import { SearchInput } from "@/components/search-input"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"
import { Briefcase, Code, Filter, Users, X } from "lucide-react"
import { useEffect, useState } from "react"

// Types for developer data
export interface Skill {
  name: string
  level: "beginner" | "intermediate" | "advanced" | "expert"
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
}

export interface Developer {
  id: string
  name: string
  username: string
  avatar: string
  title: string
  location: string
  skills: Skill[]
  projects: Project[]
  availability: "full-time" | "part-time" | "freelance" | "not-available"
  experience: number // in years
  contributionLevel: number // 1-100
  lastActive: Date
  bio: string
  github?: string
  linkedin?: string
  website?: string
}

export default function SearchPage() {
  const [init, setInit] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("developers")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [filteredDevelopers, setFilteredDevelopers] = useState<Developer[]>([])
  const [activeFilters, setActiveFilters] = useState({
    skills: [] as string[],
    locations: [] as string[],
    availability: [] as string[],
    experienceMin: 0,
    experienceMax: 20,
    contributionMin: 0,
  })
  const { toast } = useToast()
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Initialize particles
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  // Load developers data (in a real app, this would be an API call)
  useEffect(() => {
    // Sample developers data
    const sampleDevelopers: Developer[] = [
      {
        id: "1",
        name: "Sophie Martin",
        username: "sophie_dev",
        avatar: "/placeholder.svg?height=150&width=150",
        title: "Full Stack Developer",
        location: "Paris, France",
        skills: [
          { name: "React", level: "expert" },
          { name: "Node.js", level: "advanced" },
          { name: "TypeScript", level: "advanced" },
          { name: "MongoDB", level: "intermediate" },
        ],
        projects: [
          {
            id: "p1",
            name: "E-commerce Platform",
            description: "A modern e-commerce platform with React and Node.js",
            technologies: ["React", "Node.js", "MongoDB", "Redux"],
          },
          {
            id: "p2",
            name: "Task Management App",
            description: "A collaborative task management application",
            technologies: ["TypeScript", "React", "Firebase"],
          },
        ],
        availability: "freelance",
        experience: 5,
        contributionLevel: 78,
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        bio: "Passionate full stack developer with a focus on creating intuitive user experiences and scalable backend solutions.",
        github: "github.com/sophiedev",
        linkedin: "linkedin.com/in/sophiedev",
        website: "sophiedev.com",
      },
      {
        id: "2",
        name: "Thomas Lefèvre",
        username: "tlefevre",
        avatar: "/placeholder.svg?height=150&width=150",
        title: "Security Researcher",
        location: "Lyon, France",
        skills: [
          { name: "Penetration Testing", level: "expert" },
          { name: "Python", level: "advanced" },
          { name: "Network Security", level: "expert" },
          { name: "Cryptography", level: "intermediate" },
        ],
        projects: [
          {
            id: "p3",
            name: "Security Audit Tool",
            description: "An automated security auditing tool for web applications",
            technologies: ["Python", "Docker", "JavaScript"],
          },
        ],
        availability: "full-time",
        experience: 8,
        contributionLevel: 92,
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        bio: "Cybersecurity expert specializing in penetration testing and security audits for web applications and networks.",
        github: "github.com/tlefevre",
        linkedin: "linkedin.com/in/tlefevre",
      },
      {
        id: "3",
        name: "Emma Bernard",
        username: "emma_dev",
        avatar: "/placeholder.svg?height=150&width=150",
        title: "DevOps Engineer",
        location: "Bordeaux, France",
        skills: [
          { name: "Docker", level: "expert" },
          { name: "Kubernetes", level: "advanced" },
          { name: "AWS", level: "advanced" },
          { name: "Terraform", level: "advanced" },
          { name: "CI/CD", level: "expert" },
        ],
        projects: [
          {
            id: "p4",
            name: "Infrastructure as Code Framework",
            description: "A framework for managing cloud infrastructure using Terraform and AWS",
            technologies: ["Terraform", "AWS", "Python", "Docker"],
          },
          {
            id: "p5",
            name: "Automated Deployment Pipeline",
            description: "A CI/CD pipeline for automated testing and deployment",
            technologies: ["Jenkins", "Docker", "Kubernetes", "GitHub Actions"],
          },
        ],
        availability: "part-time",
        experience: 6,
        contributionLevel: 85,
        lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        bio: "DevOps engineer focused on automating infrastructure and streamlining deployment processes.",
        github: "github.com/emma_dev",
        linkedin: "linkedin.com/in/emma_dev",
        website: "emmadev.tech",
      },
      {
        id: "4",
        name: "Lucas Moreau",
        username: "lmoreau",
        avatar: "/placeholder.svg?height=150&width=150",
        title: "Mobile Developer",
        location: "Marseille, France",
        skills: [
          { name: "React Native", level: "expert" },
          { name: "Swift", level: "intermediate" },
          { name: "Kotlin", level: "intermediate" },
          { name: "JavaScript", level: "advanced" },
          { name: "Firebase", level: "advanced" },
        ],
        projects: [
          {
            id: "p6",
            name: "Health Tracking App",
            description: "A mobile application for tracking health metrics and fitness goals",
            technologies: ["React Native", "Firebase", "Redux"],
          },
        ],
        availability: "not-available",
        experience: 4,
        contributionLevel: 72,
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        bio: "Mobile developer specializing in cross-platform applications with React Native.",
        github: "github.com/lmoreau",
        linkedin: "linkedin.com/in/lmoreau",
      },
      {
        id: "5",
        name: "Chloé Petit",
        username: "chloepetit",
        avatar: "/placeholder.svg?height=150&width=150",
        title: "Data Scientist",
        location: "Toulouse, France",
        skills: [
          { name: "Python", level: "expert" },
          { name: "Machine Learning", level: "advanced" },
          { name: "TensorFlow", level: "advanced" },
          { name: "Data Visualization", level: "expert" },
          { name: "SQL", level: "intermediate" },
        ],
        projects: [
          {
            id: "p7",
            name: "Predictive Analytics Platform",
            description: "A platform for predictive analytics in e-commerce",
            technologies: ["Python", "TensorFlow", "SQL", "Tableau"],
          },
          {
            id: "p8",
            name: "Natural Language Processing Tool",
            description: "A tool for sentiment analysis and text classification",
            technologies: ["Python", "NLTK", "Scikit-learn", "Pandas"],
          },
        ],
        availability: "freelance",
        experience: 3,
        contributionLevel: 68,
        lastActive: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
        bio: "Data scientist with expertise in machine learning and predictive analytics.",
        github: "github.com/chloepetit",
        linkedin: "linkedin.com/in/chloepetit",
      },
      {
        id: "6",
        name: "Gabriel Rousseau",
        username: "g_rousseau",
        avatar: "/placeholder.svg?height=150&width=150",
        title: "Blockchain Developer",
        location: "Nice, France",
        skills: [
          { name: "Solidity", level: "expert" },
          { name: "Ethereum", level: "advanced" },
          { name: "Smart Contracts", level: "expert" },
          { name: "Web3.js", level: "advanced" },
          { name: "JavaScript", level: "advanced" },
        ],
        projects: [
          {
            id: "p9",
            name: "Decentralized Finance Platform",
            description: "A DeFi platform for lending and borrowing cryptocurrencies",
            technologies: ["Solidity", "Ethereum", "Web3.js", "React"],
          },
        ],
        availability: "full-time",
        experience: 4,
        contributionLevel: 81,
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        bio: "Blockchain developer specializing in Ethereum smart contracts and decentralized applications.",
        github: "github.com/g_rousseau",
        linkedin: "linkedin.com/in/g_rousseau",
        website: "grousseau.eth",
      },
      {
        id: "7",
        name: "Léa Mercier",
        username: "lea_m",
        avatar: "/placeholder.svg?height=150&width=150",
        title: "UX/UI Designer",
        location: "Paris, France",
        skills: [
          { name: "UI Design", level: "expert" },
          { name: "UX Research", level: "advanced" },
          { name: "Figma", level: "expert" },
          { name: "Adobe XD", level: "advanced" },
          { name: "HTML/CSS", level: "intermediate" },
        ],
        projects: [
          {
            id: "p10",
            name: "Banking App Redesign",
            description: "A complete redesign of a mobile banking application",
            technologies: ["Figma", "Adobe XD", "Sketch"],
          },
          {
            id: "p11",
            name: "E-learning Platform UI",
            description: "User interface design for an e-learning platform",
            technologies: ["Figma", "Illustrator", "Photoshop"],
          },
        ],
        availability: "part-time",
        experience: 5,
        contributionLevel: 76,
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        bio: "UX/UI designer passionate about creating intuitive and accessible user interfaces.",
        linkedin: "linkedin.com/in/lea_m",
        website: "leamercier.design",
      },
      {
        id: "8",
        name: "Antoine Renard",
        username: "a_renard",
        avatar: "/placeholder.svg?height=150&width=150",
        title: "ML Engineer",
        location: "Lyon, France",
        skills: [
          { name: "Python", level: "expert" },
          { name: "TensorFlow", level: "expert" },
          { name: "PyTorch", level: "advanced" },
          { name: "Computer Vision", level: "advanced" },
          { name: "NLP", level: "intermediate" },
        ],
        projects: [
          {
            id: "p12",
            name: "Image Recognition System",
            description: "A system for recognizing objects in images using deep learning",
            technologies: ["Python", "TensorFlow", "OpenCV", "Docker"],
          },
        ],
        availability: "freelance",
        experience: 7,
        contributionLevel: 88,
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        bio: "Machine learning engineer specializing in computer vision and deep learning.",
        github: "github.com/a_renard",
        linkedin: "linkedin.com/in/a_renard",
      },
    ]

    setDevelopers(sampleDevelopers)
    setFilteredDevelopers(sampleDevelopers)
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

  // Search and filter developers
  useEffect(() => {
    setIsLoading(true)

    // Simulate API call delay
    const timer = setTimeout(() => {
      let results = [...developers]

      // Apply search query
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase()
        results = results.filter(
          (dev) =>
            dev.name.toLowerCase().includes(query) ||
            dev.username.toLowerCase().includes(query) ||
            dev.title.toLowerCase().includes(query) ||
            dev.bio.toLowerCase().includes(query) ||
            dev.location.toLowerCase().includes(query) ||
            dev.skills.some((skill) => skill.name.toLowerCase().includes(query)) ||
            dev.projects.some(
              (project) =>
                project.name.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query) ||
                project.technologies.some((tech) => tech.toLowerCase().includes(query)),
            ),
        )
      }

      // Apply filters
      if (activeFilters.skills.length > 0) {
        results = results.filter((dev) =>
          activeFilters.skills.some((skill) =>
            dev.skills.some((devSkill) => devSkill.name.toLowerCase() === skill.toLowerCase()),
          ),
        )
      }

      if (activeFilters.locations.length > 0) {
        results = results.filter((dev) =>
          activeFilters.locations.some((location) => dev.location.toLowerCase().includes(location.toLowerCase())),
        )
      }

      if (activeFilters.availability.length > 0) {
        results = results.filter((dev) => activeFilters.availability.includes(dev.availability))
      }

      results = results.filter(
        (dev) =>
          dev.experience >= activeFilters.experienceMin &&
          dev.experience <= activeFilters.experienceMax &&
          dev.contributionLevel >= activeFilters.contributionMin,
      )

      setFilteredDevelopers(results)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [debouncedSearchQuery, activeFilters, developers])

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<typeof activeFilters>) => {
    setActiveFilters((prev) => ({ ...prev, ...newFilters }))
  }

  // Clear all filters
  const handleClearFilters = () => {
    setActiveFilters({
      skills: [],
      locations: [],
      availability: [],
      experienceMin: 0,
      experienceMax: 20,
      contributionMin: 0,
    })
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été réinitialisés",
    })
  }

  // Count active filters
  const activeFilterCount =
    activeFilters.skills.length +
    activeFilters.locations.length +
    activeFilters.availability.length +
    (activeFilters.experienceMin > 0 ? 1 : 0) +
    (activeFilters.experienceMax < 20 ? 1 : 0) +
    (activeFilters.contributionMin > 0 ? 1 : 0)

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

      <SiteHeader unreadNotifications={5} />

      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
              Recherche avancée
            </h1>
            <p className="text-white/70">
              Trouvez des développeurs, des projets et des compétences qui correspondent à vos besoins
            </p>
          </div>

          {/* Search input */}
          <div className="mb-6">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher par nom, compétence, projet ou localisation..."
            />
          </div>

          {/* Tabs and filter toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <Tabs defaultValue="developers" onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-full p-1">
                <TabsTrigger
                  value="developers"
                  className={cn(
                    "rounded-full px-4 py-2",
                    activeTab === "developers" && "bg-gradient-to-r from-pink-500 to-purple-600 text-white",
                  )}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Développeurs
                </TabsTrigger>
                <TabsTrigger
                  value="skills"
                  className={cn(
                    "rounded-full px-4 py-2",
                    activeTab === "skills" && "bg-gradient-to-r from-pink-500 to-purple-600 text-white",
                  )}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Compétences
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className={cn(
                    "rounded-full px-4 py-2",
                    activeTab === "projects" && "bg-gradient-to-r from-pink-500 to-purple-600 text-white",
                  )}
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Projets
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant={showFilters ? "default" : "outline"}
                className={cn(
                  "flex items-center gap-2",
                  showFilters
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                    : "bg-white/5 border-white/10 hover:bg-white/10",
                )}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                <span>Filtres</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-white/20 text-white text-xs rounded-full px-2 py-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/5 hover:bg-white/10"
                  onClick={handleClearFilters}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters sidebar */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="lg:col-span-1"
              >
                <SearchFilters activeFilters={activeFilters} onFilterChange={handleFilterChange} />
              </motion.div>
            )}

            {/* Search results */}
            <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
              <Tabs>
                <TabsContent value="developers" className="mt-0">
                  {/* <SearchResults
                    developers={filteredDevelopers}
                    isLoading={isLoading}
                    showFilters={showFilters}
                    searchQuery={debouncedSearchQuery}
                  /> */}
                </TabsContent>

                <TabsContent value="skills" className="mt-0">
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                    <Code className="h-16 w-16 mx-auto text-pink-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Recherche par compétences</h3>
                    <p className="text-white/70 mb-6">
                      Cette fonctionnalité sera bientôt disponible. Vous pourrez rechercher des développeurs par
                      compétences spécifiques.
                    </p>
                    <Button
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      onClick={() => setActiveTab("developers")}
                    >
                      Retour à la recherche de développeurs
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="projects" className="mt-0">
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                    <Briefcase className="h-16 w-16 mx-auto text-pink-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Recherche par projets</h3>
                    <p className="text-white/70 mb-6">
                      Cette fonctionnalité sera bientôt disponible. Vous pourrez rechercher des projets et les
                      développeurs qui y contribuent.
                    </p>
                    <Button
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      onClick={() => setActiveTab("developers")}
                    >
                      Retour à la recherche de développeurs
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

