"use client"

import { createContext, useContext, useState, type ReactNode } from "react";

interface TextSelectionContextType {
  selectedText: string | null
  selectionPosition: { x: number; y: number } | null
  isAIPanelOpen: boolean
  isRequestPending: boolean
  requestId: string | null
  setSelectedText: (text: string | null) => void
  setSelectionPosition: (position: { x: number; y: number } | null) => void
  openAIPanel: () => void
  closeAIPanel: () => void
  setIsRequestPending: (isPending: boolean) => void
  setRequestId: (id: string | null) => void
  clearSelection: () => void
}

const TextSelectionContext = createContext<TextSelectionContextType | undefined>(undefined)

export function TextSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null)
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false)
  const [isRequestPending, setIsRequestPending] = useState(false)
  const [requestId, setRequestId] = useState<string | null>(null)

  const openAIPanel = () => {
    console.log("Opening AI panel")
    setIsAIPanelOpen(true)
  }

  const closeAIPanel = () => {
    console.log("Closing AI panel")
    setIsAIPanelOpen(false)
  }

  const clearSelection = () => {
    console.log("Clearing selection")
    window.getSelection()?.removeAllRanges()
    setSelectedText(null)
    setSelectionPosition(null)
    setIsRequestPending(false)
    setRequestId(null)
  }

  return (
    <TextSelectionContext.Provider
      value={{
        selectedText,
        selectionPosition,
        isAIPanelOpen,
        isRequestPending,
        requestId,
        setSelectedText,
        setSelectionPosition,
        openAIPanel,
        closeAIPanel,
        setIsRequestPending,
        setRequestId,
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

