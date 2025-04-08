"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { CheckCircle2, Filter, Search, SortAsc, SortDesc, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ChallengeCategory, ChallengeType } from "@/services/types/ctf"

interface ChallengeFiltersProps {
  categories: ChallengeCategory[]
  types: ChallengeType[]
  onFilterChange: (filters: ChallengeFilters) => void
}

export interface ChallengeFilters {
  search: string
  categories: number[]
  types: number[]
  difficulty: string[]
  pointsRange: [number, number]
  showSolved: boolean
  sortBy: "points" | "solves" | "newest"
  sortDirection: "asc" | "desc"
}

const defaultFilters: ChallengeFilters = {
  search: "",
  categories: [],
  types: [],
  difficulty: [],
  pointsRange: [0, 500],
  showSolved: true,
  sortBy: "points",
  sortDirection: "desc",
}

export function ChallengeFilters({ categories, types, onFilterChange }: ChallengeFiltersProps) {
  const [filters, setFilters] = useState<ChallengeFilters>(defaultFilters)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }))
  }

  const toggleCategory = (categoryId: number) => {
    setFilters((prev) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId]
      return { ...prev, categories: newCategories }
    })
  }

  const toggleType = (typeId: number) => {
    setFilters((prev) => {
      const newTypes = prev.types.includes(typeId) ? prev.types.filter((id) => id !== typeId) : [...prev.types, typeId]
      return { ...prev, types: newTypes }
    })
  }

  const toggleDifficulty = (difficulty: string) => {
    setFilters((prev) => {
      const newDifficulty = prev.difficulty.includes(difficulty)
        ? prev.difficulty.filter((d) => d !== difficulty)
        : [...prev.difficulty, difficulty]
      return { ...prev, difficulty: newDifficulty }
    })
  }

  const handlePointsChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, pointsRange: [value[0], value[1]] }))
  }

  const toggleShowSolved = () => {
    setFilters((prev) => ({ ...prev, showSolved: !prev.showSolved }))
  }

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sortBy: value as "points" | "solves" | "newest" }))
  }

  const toggleSortDirection = () => {
    setFilters((prev) => ({
      ...prev,
      sortDirection: prev.sortDirection === "asc" ? "desc" : "asc",
    }))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  const containerVariants = {
    collapsed: { height: "64px", overflow: "hidden" },
    expanded: {
      height: "auto",
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  const hasActiveFilters =
    filters.search !== "" ||
    filters.categories.length > 0 ||
    filters.types.length > 0 ||
    filters.difficulty.length > 0 ||
    filters.pointsRange[0] > 0 ||
    filters.pointsRange[1] < 500 ||
    !filters.showSolved ||
    filters.sortBy !== "points" ||
    filters.sortDirection !== "desc"

  return (
    <motion.div
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={containerVariants}
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-medium text-white">Filtres</h3>
          {hasActiveFilters && <Badge className="bg-blue-600">Actifs</Badge>}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4 mr-1" />
              Réinitialiser
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-400 hover:text-blue-300"
          >
            {isExpanded ? "Réduire" : "Développer"}
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un défi..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Catégories</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={filters.categories.includes(category.id) ? "default" : "outline"}
                className={`cursor-pointer ${filters.categories.includes(category.id)
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  }`}
                onClick={() => toggleCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Types */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Types de défis</h4>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <Badge
                key={type.id}
                variant={filters.types.includes(type.id) ? "default" : "outline"}
                className={`cursor-pointer ${filters.types.includes(type.id)
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  }`}
                onClick={() => toggleType(type.id)}
              >
                {type.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Difficulté</h4>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filters.difficulty.includes("easy") ? "default" : "outline"}
              className={`cursor-pointer ${filters.difficulty.includes("easy")
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                }`}
              onClick={() => toggleDifficulty("easy")}
            >
              Facile
            </Badge>
            <Badge
              variant={filters.difficulty.includes("medium") ? "default" : "outline"}
              className={`cursor-pointer ${filters.difficulty.includes("medium")
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                }`}
              onClick={() => toggleDifficulty("medium")}
            >
              Moyen
            </Badge>
            <Badge
              variant={filters.difficulty.includes("hard") ? "default" : "outline"}
              className={`cursor-pointer ${filters.difficulty.includes("hard")
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                }`}
              onClick={() => toggleDifficulty("hard")}
            >
              Difficile
            </Badge>
          </div>
        </div>

        {/* Points Range */}
        <div>
          <div className="flex justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-300">Points</h4>
            <span className="text-sm text-gray-400">
              {filters.pointsRange[0]} - {filters.pointsRange[1]}
            </span>
          </div>
          <Slider
            defaultValue={[0, 500]}
            min={0}
            max={500}
            step={10}
            value={[filters.pointsRange[0], filters.pointsRange[1]]}
            onValueChange={handlePointsChange}
            className="my-4"
          />
        </div>

        {/* Show Solved */}
        <div className="flex items-center space-x-2">
          <Button
            variant={filters.showSolved ? "default" : "outline"}
            size="sm"
            onClick={toggleShowSolved}
            className={filters.showSolved ? "bg-green-600 hover:bg-green-700" : "text-gray-300"}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {filters.showSolved ? "Afficher les défis résolus" : "Masquer les défis résolus"}
          </Button>
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="points">Points</SelectItem>
                <SelectItem value="solves">Nombre de résolutions</SelectItem>
                <SelectItem value="newest">Date d'ajout</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortDirection}
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
          >
            {filters.sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

