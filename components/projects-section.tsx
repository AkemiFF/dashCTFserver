"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GitFork, Star, ExternalLink, GitBranch } from "lucide-react"

interface Project {
  id: number
  name: string
  description: string
  stars: number
  forks: number
  language: string
  link: string
  image: string
}

interface ProjectsSectionProps {
  projects: Project[]
  showAll?: boolean
}

export default function ProjectsSection({ projects, showAll = false }: ProjectsSectionProps) {
  const displayedProjects = showAll ? projects : projects.slice(0, 3)

  return (
    <Card className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <GitBranch className="h-5 w-5 mr-2 text-pink-500" />
          Projets
        </h3>

        <div className="grid grid-cols-1 gap-6">
          {displayedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
                <div className="md:flex">
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-600/20"></div>
                  </div>

                  <div className="p-6 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-bold">{project.name}</h4>
                      <Badge className="bg-white/10 hover:bg-white/20 text-white">{project.language}</Badge>
                    </div>

                    <p className="mt-2 text-white/70">{project.description}</p>

                    <div className="mt-4 flex items-center space-x-4">
                      <div className="flex items-center text-white/70">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>{project.stars}</span>
                      </div>

                      <div className="flex items-center text-white/70">
                        <GitFork className="h-4 w-4 mr-1 text-blue-500" />
                        <span>{project.forks}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button
                        variant="ghost"
                        className="bg-white/10 hover:bg-white/20"
                        onClick={() => window.open(project.link, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Voir le projet
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!showAll && projects.length > 3 && (
          <Button variant="ghost" className="w-full mt-4 border border-white/10 hover:bg-white/5">
            Voir tous les projets ({projects.length})
          </Button>
        )}
      </div>
    </Card>
  )
}

export { ProjectsSection }

