"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"

interface TextSelectionPosition {
  x: number
  y: number
}

interface UseTextSelectionReturn {
  selectedText: string
  selectionPosition: TextSelectionPosition | null
  clearSelection: () => void
}

export function useTextSelection(containerRef: React.RefObject<HTMLElement>): UseTextSelectionReturn {
  const [selectedText, setSelectedText] = useState("")
  const [selectionPosition, setSelectionPosition] = useState<TextSelectionPosition | null>(null)

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection()

    if (!selection || selection.isCollapsed || !containerRef.current) {
      setSelectedText("")
      setSelectionPosition(null)
      return
    }

    // Vérifier si la sélection est dans le conteneur
    let node = selection.anchorNode
    let isInContainer = false

    while (node) {
      if (node === containerRef.current) {
        isInContainer = true
        break
      }
      node = node.parentNode
    }

    if (!isInContainer) {
      setSelectedText("")
      setSelectionPosition(null)
      return
    }

    const text = selection.toString().trim()

    if (text) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      setSelectedText(text)
      setSelectionPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom + window.scrollY,
      })
    } else {
      setSelectedText("")
      setSelectionPosition(null)
    }
  }, [containerRef])

  const clearSelection = useCallback(() => {
    window.getSelection()?.removeAllRanges()
    setSelectedText("")
    setSelectionPosition(null)
  }, [])

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection)
    document.addEventListener("keyup", handleTextSelection)

    return () => {
      document.removeEventListener("mouseup", handleTextSelection)
      document.removeEventListener("keyup", handleTextSelection)
    }
  }, [handleTextSelection])

  return { selectedText, selectionPosition, clearSelection }
}

