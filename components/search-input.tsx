"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, History } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  const [open, setOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState([
    "React developer",
    "Machine learning",
    "Paris",
    "Full stack",
    "DevOps",
  ])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Add to recent searches if not empty and not already in the list
    if (value && !recentSearches.includes(value)) {
      setRecentSearches((prev) => [value, ...prev.slice(0, 4)])
    }

    // Close the command dialog if open
    if (open) {
      setOpen(false)
    }
  }

  const clearSearch = () => {
    onChange("")
  }

  const handleSelectRecentSearch = (search: string) => {
    onChange(search)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setOpen(true)
    }
  }

  return (
    <>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
          <Input
            type="text"
            placeholder={placeholder || "Rechercher..."}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={() => setOpen(true)}
            className="pl-10 pr-16 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-pink-500 focus:ring-pink-500/20 rounded-full"
          />
          {value && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-24 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
            >
              <X className="h-5 w-5" />
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

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Rechercher des développeurs, compétences, projets..." />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          <CommandGroup heading="Recherches récentes">
            {recentSearches.map((search) => (
              <CommandItem key={search} onSelect={() => handleSelectRecentSearch(search)} className="flex items-center">
                <History className="mr-2 h-4 w-4 text-white/50" />
                <span>{search}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => handleSelectRecentSearch("React developer")}>React developer</CommandItem>
            <CommandItem onSelect={() => handleSelectRecentSearch("Python expert")}>Python expert</CommandItem>
            <CommandItem onSelect={() => handleSelectRecentSearch("UX/UI designer")}>UX/UI designer</CommandItem>
            <CommandItem onSelect={() => handleSelectRecentSearch("DevOps engineer")}>DevOps engineer</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

