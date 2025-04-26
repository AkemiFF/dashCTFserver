"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import type { OsintNode } from "@/lib/osint-data"

interface ListViewProps {
  expandedNodes: Set<string>
  toggleNode: (nodeId: string) => void
  rootNode: OsintNode
}

export function ListView({ expandedNodes, toggleNode, rootNode }: ListViewProps) {
  const renderNode = (node: OsintNode, level = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children && node.children.length > 0

    // Ajouter des couleurs différentes selon le niveau pour une meilleure hiérarchie visuelle
    const getBgColor = () => {
      if (level === 0) return "bg-[#1a1a2e]/80"
      if (level === 1) return "bg-[#16213e]/60"
      return "bg-transparent"
    }

    return (
      <div key={node.id} className="w-full">
        <div
          className={`flex items-center justify-between p-2 ${
            level > 0 ? `ml-${level * 2}` : ""
          } hover:bg-[#16213e]/70 rounded-md cursor-pointer transition-colors duration-200 ${getBgColor()}`}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          <div className="flex items-center gap-2">
            {hasChildren && (
              <span
                className={`text-[#64ffda] transition-transform duration-300 ${isExpanded ? "transform rotate-90" : ""}`}
              >
                ►
              </span>
            )}
            <span className="text-white">{node.name}</span>
            {node.tool && <span className="text-xs text-[#64ffda] ml-1">(T)</span>}
            {node.registration && <span className="text-xs text-[#ff2a6d] ml-1">(R)</span>}
            {node.darkweb && <span className="text-xs text-[#7b42f6] ml-1">(D)</span>}
            {node.manual && <span className="text-xs text-[#05d9e8] ml-1">(M)</span>}
          </div>
          {node.url && (
            <a
              href={node.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff2a6d] hover:text-[#ff5e8f] p-1 hover:bg-[#1a1a2e]/50 rounded-full transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>

        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-l-2 border-[#64ffda]/30 ml-2 pl-2"
          >
            {node.children?.map((child) => renderNode(child, level + 1))}
          </motion.div>
        )}
      </div>
    )
  }

  return <div className="max-w-4xl mx-auto">{renderNode(rootNode)}</div>
}
