"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import type { OsintNode } from "@/lib/osint-data"

interface SearchResultsProps {
  results: OsintNode[]
  onSelect: (nodeId: string) => void
  clearSearch: () => void
}

export function SearchResults({ results, onSelect, clearSearch }: SearchResultsProps) {
  return (
    <div className="p-4 bg-[#1a1a2e]/80 shadow-lg rounded-md m-4 border border-[#64ffda]/50 backdrop-blur-md">
      <h2 className="text-lg font-semibold mb-2 text-white">Search Results</h2>
      <ul className="space-y-2">
        {results.map((result) => (
          <motion.li
            key={result.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-2 hover:bg-[#16213e]/70 rounded-md cursor-pointer flex items-center justify-between text-gray-200"
            onClick={() => {
              onSelect(result.id)
              clearSearch()
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
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
