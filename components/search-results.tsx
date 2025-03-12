"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import type { Developer } from "@/pages/search"
import { AnimatePresence, motion } from "framer-motion"
import {
  Briefcase,
  Calendar,
  Clock,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Search,
  Star,
  UserPlus,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface SearchResultsProps {
  developers: Developer[]
  isLoading: boolean
  showFilters: boolean
  searchQuery: string
}

export function SearchResults({ developers, isLoading, showFilters, searchQuery }: SearchResultsProps) {
  const [expandedDeveloper, setExpandedDeveloper] = useState<string | null>(null)
  const { toast } = useToast()

  // Function to get skill level color
  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-blue-500/20 text-blue-500"
      case "intermediate":
        return "bg-green-500/20 text-green-500"
      case "advanced":
        return "bg-yellow-500/20 text-yellow-500"
      case "expert":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  // Function to format date
  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) {
      return `Il y a ${diffMins} minute${diffMins > 1 ? "s" : ""}`
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`
    } else {
      return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`
    }
  }

  // Function to get availability label and color
  const getAvailabilityInfo = (availability: string) => {
    switch (availability) {
      case "full-time":
        return { label: "Temps plein", color: "bg-green-500/20 text-green-500" }
      case "part-time":
        return { label: "Temps partiel", color: "bg-blue-500/20 text-blue-500" }
      case "freelance":
        return { label: "Freelance", color: "bg-yellow-500/20 text-yellow-500" }
      case "not-available":
        return { label: "Non disponible", color: "bg-red-500/20 text-red-500" }
      default:
        return { label: "Non spécifié", color: "bg-gray-500/20 text-gray-500" }
    }
  }

  // Handle connect button click
  const handleConnect = (developer: Developer) => {
    toast({
      title: "Demande envoyée",
      description: `Votre demande de connexion a été envoyée à ${developer.name}`,
    })
  }

  // Handle message button click
  const handleMessage = (developer: Developer) => {
    toast({
      title: "Message",
      description: `Vous pouvez maintenant envoyer un message à ${developer.name}`,
    })
  }

  // Toggle expanded developer
  const toggleExpandedDeveloper = (id: string) => {
    setExpandedDeveloper(expandedDeveloper === id ? null : id)
  }

  // Loading skeletons
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  // Empty state
  if (developers.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-8 text-center">
        <Search className="h-16 w-16 mx-auto text-pink-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
        <p className="text-white/70 mb-6">
          {searchQuery
            ? `Aucun développeur ne correspond à votre recherche "${searchQuery}"`
            : "Aucun développeur ne correspond aux filtres sélectionnés"}
        </p>
        <p className="text-white/50 mb-4">Essayez de :</p>
        <ul className="text-white/70 list-disc list-inside mb-6 inline-block text-left">
          <li>Utiliser des termes de recherche plus généraux</li>
          <li>Vérifier l'orthographe des mots-clés</li>
          <li>Réduire le nombre de filtres appliqués</li>
          <li>Rechercher par compétence ou localisation spécifique</li>
        </ul>
        <Button
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          onClick={() => window.location.reload()}
        >
          Réinitialiser la recherche
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-white/70">
          {developers.length} développeur{developers.length > 1 ? "s" : ""} trouvé{developers.length > 1 ? "s" : ""}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Trier par <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-navy-950/90 backdrop-blur-xl border-white/10 text-white">
            <DropdownMenuItem>Pertinence</DropdownMenuItem>
            <DropdownMenuItem>Expérience (décroissant)</DropdownMenuItem>
            <DropdownMenuItem>Expérience (croissant)</DropdownMenuItem>
            <DropdownMenuItem>Contribution (décroissant)</DropdownMenuItem>
            <DropdownMenuItem>Dernière activité</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AnimatePresence>
        {developers.map((developer) => (
          <motion.div
            key={developer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            layout
          >
            <Card className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition-colors">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <Avatar className="h-16 w-16 border-2 border-white/10">
                    <AvatarImage src={developer.avatar} alt={developer.name} />
                    <AvatarFallback>{developer.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div>
                        <Link href={`/profile/${developer.username}`} className="hover:underline">
                          <h3 className="text-xl font-semibold text-white">{developer.name}</h3>
                        </Link>
                        <p className="text-white/60">@{developer.username}</p>
                        <p className="text-white/80 mt-1">{developer.title}</p>

                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <div className="flex items-center text-white/60 text-sm">
                            <MapPin className="h-3.5 w-3.5 mr-1 text-pink-500" />
                            {developer.location}
                          </div>
                          <div className="flex items-center text-white/60 text-sm">
                            <Calendar className="h-3.5 w-3.5 mr-1 text-pink-500" />
                            {developer.experience} an{developer.experience > 1 ? "s" : ""} d'expérience
                          </div>
                          <div className="flex items-center text-white/60 text-sm">
                            <Clock className="h-3.5 w-3.5 mr-1 text-pink-500" />
                            Actif {formatDate(developer.lastActive)}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                          onClick={() => handleConnect(developer)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Connecter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/5 border-white/10 hover:bg-white/10"
                          onClick={() => handleMessage(developer)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-9 w-9 bg-white/5 border-white/10 hover:bg-white/10"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-navy-950/90 backdrop-blur-xl border-white/10 text-white"
                          >
                            <DropdownMenuItem>
                              <Link href={`/profile/${developer.username}`} className="flex w-full">
                                Voir le profil complet
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Partager le profil</DropdownMenuItem>
                            <DropdownMenuItem>Signaler</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {developer.skills.slice(0, 5).map((skill) => (
                          <Badge key={skill.name} className={`${getSkillLevelColor(skill.level)} border-none`}>
                            {skill.name}
                          </Badge>
                        ))}
                        {developer.skills.length > 5 && (
                          <Badge variant="outline" className="bg-white/5 border-white/10">
                            +{developer.skills.length - 5}
                          </Badge>
                        )}
                        <Badge className={`${getAvailabilityInfo(developer.availability).color} border-none ml-auto`}>
                          {getAvailabilityInfo(developer.availability).label}
                        </Badge>
                      </div>
                    </div>

                    {/* Contribution level */}
                    <div className="mt-4">
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-white/70">Niveau de contribution</div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-pink-500" />
                          <span className="ml-1 font-medium">{developer.contributionLevel}</span>
                        </div>
                        <div className="flex-grow">
                          <div className="h-2 bg-white/10 rounded-full">
                            <div
                              className="h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                              style={{ width: `${developer.contributionLevel}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Toggle details button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 text-pink-500 hover:text-pink-400 hover:bg-white/5 p-0"
                      onClick={() => toggleExpandedDeveloper(developer.id)}
                    >
                      {expandedDeveloper === developer.id ? "Voir moins" : "Voir plus"}
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform ${expandedDeveloper === developer.id ? "rotate-180" : ""
                          }`}
                      />
                    </Button>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {expandedDeveloper === developer.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {/* Bio */}
                          <div className="mt-4 text-white/80">
                            <p>{developer.bio}</p>
                          </div>

                          {/* Projects */}
                          {developer.projects.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-white/90 mb-2 flex items-center">
                                <Briefcase className="h-4 w-4 mr-1 text-pink-500" />
                                Projets récents
                              </h4>
                              <div className="space-y-2">
                                {developer.projects.map((project) => (
                                  <div key={project.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                                    <h5 className="font-medium text-white">{project.name}</h5>
                                    <p className="text-sm text-white/70 mt-1">{project.description}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {project.technologies.map((tech) => (
                                        <Badge
                                          key={tech}
                                          variant="outline"
                                          className="bg-white/5 border-white/10 text-xs"
                                        >
                                          {tech}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Links */}
                          <div className="mt-4 flex flex-wrap gap-3">
                            {developer.github && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/5 border-white/10 hover:bg-white/10"
                                asChild
                              >
                                <Link href={`https://${developer.github}`} target="_blank" rel="noopener noreferrer">
                                  <Github className="h-4 w-4 mr-2" />
                                  GitHub
                                </Link>
                              </Button>
                            )}
                            {developer.linkedin && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/5 border-white/10 hover:bg-white/10"
                                asChild
                              >
                                <Link href={`https://${developer.linkedin}`} target="_blank" rel="noopener noreferrer">
                                  <Linkedin className="h-4 w-4 mr-2" />
                                  LinkedIn
                                </Link>
                              </Button>
                            )}
                            {developer.website && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/5 border-white/10 hover:bg-white/10"
                                asChild
                              >
                                <Link href={`https://${developer.website}`} target="_blank" rel="noopener noreferrer">
                                  <Globe className="h-4 w-4 mr-2" />
                                  Site web
                                </Link>
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white/5 border-white/10 hover:bg-white/10"
                              asChild
                            >
                              <Link href={`/profile/${developer.username}`}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Profil complet
                              </Link>
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Helper component for ChevronDown icon
function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

