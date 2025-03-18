"use client"

import { useTextSelection } from "@/components/module/text-selection-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

export function AIExplainButton() {
  const { selectedText, isAIPanelOpen, isRequestPending, openAIPanel, setIsRequestPending, setRequestId } =
    useTextSelection()

  const [hasSelection, setHasSelection] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Mettre à jour l'état de sélection
  useEffect(() => {
    setHasSelection(!!selectedText && selectedText.length > 3)
  }, [selectedText])

  const handleExplain = () => {
    if (!hasSelection || isRequestPending) return

    try {
      // Générer un ID unique pour cette requête (utiliser uuidv4 au lieu de crypto.randomUUID())
      const newRequestId = uuidv4()
      console.log("Generating new request with ID:", newRequestId)

      // Définir l'ID de requête et marquer comme en attente
      setRequestId(newRequestId)
      setIsRequestPending(true)

      // Ouvrir le panneau
      openAIPanel()
    } catch (error) {
      console.error("Error in handleExplain:", error)
      setIsRequestPending(false)
    }
  }

  return (
    <motion.div
      className="fixed bottom-6 z-50"
      initial={{ right: "1.5rem" }}
      animate={{ right: isAIPanelOpen ? "calc(400px + 1.5rem)" : "1.5rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Button
        onClick={handleExplain}
        disabled={!hasSelection || isRequestPending}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "rounded-full shadow-lg transition-all duration-300 flex items-center gap-2",
          hasSelection
            ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-pink-500/20"
            : "bg-gray-700/50 text-gray-400 cursor-not-allowed",
          isHovered && hasSelection ? "pl-4 pr-5" : "px-4",
        )}
      >
        <Sparkles
          className={cn(
            "h-4 w-4 transition-all",
            hasSelection ? "text-white" : "text-gray-400",
            isHovered && hasSelection && "animate-pulse",
          )}
        />
        <span
          className={cn(
            "font-medium transition-all duration-300",
            isHovered && hasSelection ? "opacity-100 max-w-40" : "opacity-0 max-w-0 overflow-hidden",
          )}
        >
          Expliquer avec l'IA
        </span>
      </Button>
    </motion.div>
  )
}

