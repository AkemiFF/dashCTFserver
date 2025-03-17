"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTextSelection } from "./text-selection-context"

interface TextContentItemProps {
  content: string
}

export function TextContentItem({ content }: TextContentItemProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const {
    selectedText,
    selectionPosition,
    isAIPanelOpen,
    isRequestPending,
    setSelectedText,
    setSelectionPosition,
    openAIPanel,
    setIsRequestPending,
    setRequestId,
  } = useTextSelection()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSelection = useCallback(() => {
    // Si une requête est en cours, ne pas traiter de nouvelles sélections
    if (isProcessing || isRequestPending) return

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
      setIsProcessing(true)
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      // Vérifier la position
      const componentRect = contentRef.current?.getBoundingClientRect()
      if (!componentRect || !isWithinBounds(rect, componentRect)) return

      setSelectedText(text)
      setSelectionPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      })
    } finally {
      setIsProcessing(false)
    }
  }, [isProcessing, isRequestPending, setSelectedText, setSelectionPosition])

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

  const handleAIExplain = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (selectedText && selectionPosition) {
      console.log("Ouverture du panneau IA")

      // Générer un ID unique pour cette requête
      const newRequestId = crypto.randomUUID()
      setRequestId(newRequestId)
      setIsRequestPending(true)
      openAIPanel()
    }
  }

  const isWithinBounds = (rect: DOMRect, container: DOMRect) => {
    return (
      rect.top >= container.top &&
      rect.bottom <= container.bottom &&
      rect.left >= container.left &&
      rect.right <= container.right
    )
  }

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content || "" }}
      />

      <AnimatePresence>
        {selectedText && selectionPosition && !isRequestPending && (
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
    </div>
  )
}

