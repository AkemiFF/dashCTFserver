"use client"

import { useState, useCallback } from "react"
import type { AIConversation, AIMessage } from "@/services/types/ai-conversation"
import { v4 as uuidv4 } from "uuid"

export function useAIConversation() {
  const [conversations, setConversations] = useState<AIConversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<AIConversation | null>(null)

  const createConversation = useCallback((initialPrompt?: string) => {
    const newConversation: AIConversation = {
      id: uuidv4(),
      messages: initialPrompt
        ? [
          {
            id: uuidv4(),
            role: "user",
            content: initialPrompt,
            timestamp: new Date(),
          },
        ]
        : [],
      title: initialPrompt
        ? initialPrompt.substring(0, 30) + (initialPrompt.length > 30 ? "..." : "")
        : "Nouvelle conversation",
    }

    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversation(newConversation)
    return newConversation
  }, [])

  const addMessage = useCallback(
    (conversationId: string, role: "user" | "assistant", content: string) => {
      const newMessage: AIMessage = {
        id: uuidv4(),
        role,
        content,
        timestamp: new Date(),
      }

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, newMessage],
            }
          }
          return conv
        }),
      )

      if (currentConversation?.id === conversationId) {
        setCurrentConversation((prev) =>
          prev
            ? {
              ...prev,
              messages: [...prev.messages, newMessage],
            }
            : null,
        )
      }

      return newMessage
    },
    [currentConversation],
  )

  const switchConversation = useCallback(
    (conversationId: string) => {
      const conversation = conversations.find((c) => c.id === conversationId)
      if (conversation) {
        setCurrentConversation(conversation)
      }
    },
    [conversations],
  )

  return {
    conversations,
    currentConversation,
    createConversation,
    addMessage,
    switchConversation,
  }
}

