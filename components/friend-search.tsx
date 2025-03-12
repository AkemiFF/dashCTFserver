"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface FriendSearchProps {
  onSearch: (query: string) => void
}

export function FriendSearch({ onSearch }: FriendSearchProps) {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const clearSearch = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
        <Input
          type="text"
          placeholder="Rechercher des développeurs par nom, compétence ou spécialité..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-16 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-pink-500 focus:ring-pink-500/20 rounded-full"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-24 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <Button
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full"
        >
          Rechercher
        </Button>
      </div>
    </form>
  )
}

