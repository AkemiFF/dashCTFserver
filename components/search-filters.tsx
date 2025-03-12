"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Code, MapPin, Clock, Star, Search, Plus } from "lucide-react"

interface SearchFiltersProps {
  activeFilters: {
    skills: string[]
    locations: string[]
    availability: string[]
    experienceMin: number
    experienceMax: number
    contributionMin: number
  }
  onFilterChange: (filters: Partial<SearchFiltersProps["activeFilters"]>) => void
}

export function SearchFilters({ activeFilters, onFilterChange }: SearchFiltersProps) {
  const [skillInput, setSkillInput] = useState("")
  const [locationInput, setLocationInput] = useState("")

  // Common skills for suggestions
  const commonSkills = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "TypeScript",
    "Docker",
    "Kubernetes",
    "AWS",
    "Machine Learning",
    "DevOps",
    "UI/UX Design",
    "Mobile Development",
    "Blockchain",
    "Data Science",
  ]

  // Common locations
  const commonLocations = ["Paris", "Lyon", "Marseille", "Bordeaux", "Toulouse", "Nice", "Nantes", "Strasbourg"]

  // Availability options
  const availabilityOptions = [
    { value: "full-time", label: "Temps plein" },
    { value: "part-time", label: "Temps partiel" },
    { value: "freelance", label: "Freelance" },
    { value: "not-available", label: "Non disponible" },
  ]

  // Add a skill
  const handleAddSkill = (skill: string) => {
    if (skill && !activeFilters.skills.includes(skill)) {
      onFilterChange({ skills: [...activeFilters.skills, skill] })
      setSkillInput("")
    }
  }

  // Remove a skill
  const handleRemoveSkill = (skill: string) => {
    onFilterChange({ skills: activeFilters.skills.filter((s) => s !== skill) })
  }

  // Add a location
  const handleAddLocation = (location: string) => {
    if (location && !activeFilters.locations.includes(location)) {
      onFilterChange({ locations: [...activeFilters.locations, location] })
      setLocationInput("")
    }
  }

  // Remove a location
  const handleRemoveLocation = (location: string) => {
    onFilterChange({ locations: activeFilters.locations.filter((l) => l !== location) })
  }

  // Toggle availability
  const handleToggleAvailability = (value: string) => {
    if (activeFilters.availability.includes(value)) {
      onFilterChange({ availability: activeFilters.availability.filter((a) => a !== value) })
    } else {
      onFilterChange({ availability: [...activeFilters.availability, value] })
    }
  }

  return (
    <Card className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Filtres avancés</h3>

        <Accordion type="multiple" defaultValue={["skills", "location", "experience", "contribution"]}>
          {/* Skills filter */}
          <AccordionItem value="skills" className="border-white/10">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center">
                <Code className="h-4 w-4 mr-2 text-pink-500" />
                <span>Compétences</span>
                {activeFilters.skills.length > 0 && (
                  <Badge className="ml-2 bg-pink-500 text-white">{activeFilters.skills.length}</Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Ajouter une compétence..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  </div>
                  <Button
                    size="icon"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    onClick={() => handleAddSkill(skillInput)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Selected skills */}
                {activeFilters.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeFilters.skills.map((skill) => (
                      <Badge
                        key={skill}
                        className="bg-white/10 hover:bg-white/20 text-white"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        {skill} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Common skills */}
                <div>
                  <p className="text-sm text-white/70 mb-2">Suggestions :</p>
                  <div className="flex flex-wrap gap-2">
                    {commonSkills
                      .filter((skill) => !activeFilters.skills.includes(skill))
                      .slice(0, 8)
                      .map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="bg-white/5 hover:bg-white/10 border-white/10 cursor-pointer"
                          onClick={() => handleAddSkill(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Location filter */}
          <AccordionItem value="location" className="border-white/10">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-pink-500" />
                <span>Localisation</span>
                {activeFilters.locations.length > 0 && (
                  <Badge className="ml-2 bg-pink-500 text-white">{activeFilters.locations.length}</Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Input
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="Ajouter une localisation..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  </div>
                  <Button
                    size="icon"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    onClick={() => handleAddLocation(locationInput)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Selected locations */}
                {activeFilters.locations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeFilters.locations.map((location) => (
                      <Badge
                        key={location}
                        className="bg-white/10 hover:bg-white/20 text-white"
                        onClick={() => handleRemoveLocation(location)}
                      >
                        {location} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Common locations */}
                <div>
                  <p className="text-sm text-white/70 mb-2">Suggestions :</p>
                  <div className="flex flex-wrap gap-2">
                    {commonLocations
                      .filter((location) => !activeFilters.locations.includes(location))
                      .map((location) => (
                        <Badge
                          key={location}
                          variant="outline"
                          className="bg-white/5 hover:bg-white/10 border-white/10 cursor-pointer"
                          onClick={() => handleAddLocation(location)}
                        >
                          {location}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Availability filter */}
          <AccordionItem value="availability" className="border-white/10">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-pink-500" />
                <span>Disponibilité</span>
                {activeFilters.availability.length > 0 && (
                  <Badge className="ml-2 bg-pink-500 text-white">{activeFilters.availability.length}</Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {availabilityOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`availability-${option.value}`}
                      checked={activeFilters.availability.includes(option.value)}
                      onCheckedChange={() => handleToggleAvailability(option.value)}
                      className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                    />
                    <Label
                      htmlFor={`availability-${option.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Experience filter */}
          <AccordionItem value="experience" className="border-white/10">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-pink-500" />
                <span>Expérience</span>
                {(activeFilters.experienceMin > 0 || activeFilters.experienceMax < 20) && (
                  <Badge className="ml-2 bg-pink-500 text-white">
                    {activeFilters.experienceMin}-{activeFilters.experienceMax} ans
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white/70">Années d'expérience</span>
                    <span className="text-sm font-medium">
                      {activeFilters.experienceMin} - {activeFilters.experienceMax} ans
                    </span>
                  </div>
                  <Slider
                    value={[activeFilters.experienceMin, activeFilters.experienceMax]}
                    min={0}
                    max={20}
                    step={1}
                    onValueChange={(value) => {
                      onFilterChange({
                        experienceMin: value[0],
                        experienceMax: value[1],
                      })
                    }}
                    className="[&_[role=slider]]:bg-pink-500"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Contribution level filter */}
          <AccordionItem value="contribution" className="border-white/10">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-pink-500" />
                <span>Niveau de contribution</span>
                {activeFilters.contributionMin > 0 && (
                  <Badge className="ml-2 bg-pink-500 text-white">Min {activeFilters.contributionMin}</Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white/70">Niveau minimum</span>
                    <span className="text-sm font-medium">{activeFilters.contributionMin}</span>
                  </div>
                  <Slider
                    value={[activeFilters.contributionMin]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => {
                      onFilterChange({ contributionMin: value[0] })
                    }}
                    className="[&_[role=slider]]:bg-pink-500"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  )
}

// Helper component for X icon
function X(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

