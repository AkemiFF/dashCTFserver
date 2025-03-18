"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useTextSelection } from "./text-selection-context"

interface TextContentItemProps {
  content: string
}

export function TextContentItem({ content }: TextContentItemProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { setSelectedText, setSelectionPosition, isRequestPending } = useTextSelection()
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
    </div>
  )
}

