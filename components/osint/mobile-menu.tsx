"use client"

import { motion } from "framer-motion"
import { ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { OsintNode } from "@/lib/osint-data"

interface MobileMenuProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  searchResults: OsintNode[]
  setSelectedNode: (nodeId: string | null) => void
  expandParents: (id: string) => void
  setMobileMenuOpen: (open: boolean) => void
  viewMode: "graph" | "list"
  setViewMode: (mode: "graph" | "list") => void
  categories: OsintNode[]
  setActiveCategory: (id: string | null) => void
  setExpandedNodes: (nodes: Set<string>) => void
}

export function MobileMenu({
  searchTerm,
  setSearchTerm,
  searchResults,
  setSelectedNode,
  expandParents,
  setMobileMenuOpen,
  viewMode,
  setViewMode,
  categories,
  setActiveCategory,
  setExpandedNodes,
}: MobileMenuProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-[#0f0c29]/95 z-50 flex flex-col p-4 backdrop-blur-md"
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          <span className="text-[#64ffda]">OSINT</span> Framework
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(false)}
          className="text-white hover:bg-[#16213e]/50"
        >
          <X size={24} />
        </Button>
      </div>

      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#1a1a2e]/70 border-[#64ffda]/50 text-white"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant={viewMode === "graph" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("graph")}
          className={viewMode === "graph" ? "bg-[#64ffda] text-[#0f0c29]" : "text-[#64ffda] border-[#64ffda]/50"}
        >
          Graph
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("list")}
          className={viewMode === "list" ? "bg-[#64ffda] text-[#0f0c29]" : "text-[#64ffda] border-[#64ffda]/50"}
        >
          List
        </Button>
      </div>

      <div className="overflow-auto flex-grow">
        {searchTerm && searchResults.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white mb-2">Search Results</h3>
            {searchResults.map((result) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-2 hover:bg-[#16213e]/70 rounded-md cursor-pointer flex items-center justify-between text-gray-200"
                onClick={() => {
                  setSelectedNode(result.id)
                  expandParents(result.id)
                  setSearchTerm("")
                  setMobileMenuOpen(false)
                }}
              >
                <span>{result.name}</span>
                {result.url && (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ff2a6d] hover:text-[#ff5e8f]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white mb-2">Categories</h3>
            {categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-2 hover:bg-[#16213e]/70 rounded-md cursor-pointer text-gray-200"
                onClick={() => {
                  setActiveCategory(category.id)
                  setExpandedNodes(new Set(["osint-framework", category.id]))
                  setMobileMenuOpen(false)
                }}
              >
                {category.name}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
