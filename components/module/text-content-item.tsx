"use client"

import { useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { AIExplanation } from "@/components/ai-explanation"
import { useTextSelection } from "./text-selection-context"

interface TextContentItemProps {
  content: string
}

export function TextContentItem({ content }: TextContentItemProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const {
    selectedText,
    selectionPosition,
    showAIExplanation,
    setSelectedText,
    setSelectionPosition,
    setShowAIExplanation,
    clearSelection,
  } = useTextSelection()

  const handleSelection = useCallback(() => {
    // Si l'explication AI est déjà affichée, ne pas traiter de nouvelles sélections
    if (showAIExplanation) return

    const selection = window.getSelection()
    if (!selection) return

    const text = selection.toString().trim()

    if (!text || text.length < 3) {
      // Texte trop court ou vide
      setSelectedText(null)
      setSelectionPosition(null)
      return
    }

    if (!contentRef.current) return

    try {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      // Vérifier si la sélection est à l'intérieur de ce composant
      const componentRect = contentRef.current.getBoundingClientRect()
      if (
        rect.top < componentRect.top ||
        rect.bottom > componentRect.bottom ||
        rect.left < componentRect.left ||
        rect.right > componentRect.right
      ) {
        return
      }

      console.log("Selection detected:", {
        text: text.substring(0, 20) + "...",
        position: { x: rect.left + rect.width / 2, y: rect.top },
      })

      setSelectedText(text)
      setSelectionPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      })
    } catch (err) {
      console.error("Error handling text selection:", err)
    }
  }, [showAIExplanation, setSelectedText, setSelectionPosition])

  useEffect(() => {
    const currentRef = contentRef.current
    if (!currentRef) return

    // Utiliser mouseup uniquement sur ce composant spécifique
    currentRef.addEventListener("mouseup", handleSelection)
    currentRef.addEventListener("touchend", handleSelection)

    return () => {
      currentRef.removeEventListener("mouseup", handleSelection)
      currentRef.removeEventListener("touchend", handleSelection)
    }
  }, [handleSelection])

  const handleAIExplain = () => {
    if (selectedText && selectionPosition) {
      console.log("Showing AI explanation for:", selectedText.substring(0, 20) + "...")
      setShowAIExplanation(true)
    }
  }

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content || "" }}
      />

      <AnimatePresence>
        {selectedText && selectionPosition && !showAIExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed z-40"
            style={{
              left: `${selectionPosition.x}px`,
              top: `${selectionPosition.y - window.scrollY + 10}px`,
              transform: "translateX(-50%)",
            }}
          >
            <Button
              size="sm"
              onClick={handleAIExplain}
              className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/20 flex items-center gap-1.5 px-3 py-1 h-auto text-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Expliquer avec l'IA
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAIExplanation && selectedText && selectionPosition && (
          <AIExplanation selectedText={selectedText} position={selectionPosition} onClose={clearSelection} />
        )}
      </AnimatePresence>
    </div>
  )
}

