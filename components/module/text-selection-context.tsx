"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface TextSelectionContextType {
  selectedText: string | null
  selectionPosition: { x: number; y: number } | null
  showAIExplanation: boolean
  setSelectedText: (text: string | null) => void
  setSelectionPosition: (position: { x: number; y: number } | null) => void
  setShowAIExplanation: (show: boolean) => void
  clearSelection: () => void
}

const TextSelectionContext = createContext<TextSelectionContextType | undefined>(undefined)

export function TextSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null)
  const [showAIExplanation, setShowAIExplanation] = useState(false)

  const clearSelection = () => {
    window.getSelection()?.removeAllRanges()
    setSelectedText(null)
    setSelectionPosition(null)
    setShowAIExplanation(false)
  }

  return (
    <TextSelectionContext.Provider
      value={{
        selectedText,
        selectionPosition,
        showAIExplanation,
        setSelectedText,
        setSelectionPosition,
        setShowAIExplanation,
        clearSelection,
      }}
    >
      {children}
    </TextSelectionContext.Provider>
  )
}

export function useTextSelection() {
  const context = useContext(TextSelectionContext)
  if (context === undefined) {
    throw new Error("useTextSelection must be used within a TextSelectionProvider")
  }
  return context
}

