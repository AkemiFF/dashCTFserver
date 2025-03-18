"use client"

import type React from "react"

import { useTextSelection } from "@/components/module/text-selection-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAIConversation } from "@/hooks/use-ai-conversation"
import { getAuthHeader } from "@/lib/auth"
import { BASE_URL } from "@/lib/host"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ChevronRight, Clock, Loader2, Send, Sparkles, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"
import { v4 as uuidv4 } from "uuid"

export function AISidePanel() {
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [newPrompt, setNewPrompt] = useState("")

  const {
    selectedText,
    isAIPanelOpen,
    isRequestPending,
    requestId,
    setIsRequestPending,
    openAIPanel,
    closeAIPanel,
    clearSelection,
  } = useTextSelection()

  const { conversations, currentConversation, createConversation, addMessage, switchConversation } = useAIConversation()

  const controllerRef = useRef<AbortController | null>(null)
  const initialRequestProcessedRef = useRef(false)
  const isProcessingRef = useRef(false) // Verrou pour éviter les requêtes multiples
  const promptInputRef = useRef<HTMLTextAreaElement>(null)
  const conversationEndRef = useRef<HTMLDivElement>(null)
  const lastRequestIdRef = useRef<string | null>(null)

  // Créer une nouvelle conversation avec le texte sélectionné
  useEffect(() => {
    if (selectedText && isAIPanelOpen && !currentConversation) {
      console.log("Creating new conversation with selected text:", selectedText)
      createConversation(selectedText)
    }
  }, [selectedText, isAIPanelOpen, currentConversation, createConversation])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [currentConversation?.messages, loading])

  // Fonction unifiée pour envoyer des messages à l'API
  const sendMessageToAPI = async (message: string, isInitialRequest = false) => {
    // Vérifications de sécurité
    if (!message.trim() || !currentConversation) {
      console.warn("Cannot send message: empty message or no conversation")
      return
    }

    // Vérifier si nous sommes déjà en train de traiter une requête
    if (isProcessingRef.current) {
      console.warn("Already processing a request, ignoring this one")
      return
    }

    // Pour les requêtes initiales, vérifier si nous avons déjà traité cette requête
    if (isInitialRequest) {
      if (initialRequestProcessedRef.current) {
        console.warn("Initial request already processed, ignoring")
        return
      }

      // Vérifier si l'ID de requête est le même que le dernier traité
      if (requestId && requestId === lastRequestIdRef.current) {
        console.warn("Duplicate request ID detected, ignoring:", requestId)
        return
      }

      // Mettre à jour le dernier ID de requête traité
      lastRequestIdRef.current = requestId || null
    }

    // Définir le verrou
    isProcessingRef.current = true

    try {
      setLoading(true)

      // Ajouter le message utilisateur à la conversation
      // Seulement si ce n'est pas la requête initiale ou si c'est la première fois
      if (!isInitialRequest) {
        console.log("Adding user message to conversation:", message)
        addMessage(currentConversation.id, "user", message)
      } else {
        console.log("Processing initial request with text:", message)
        // Pour la requête initiale, ajouter le message utilisateur une seule fois
        if (!initialRequestProcessedRef.current) {
          addMessage(currentConversation.id, "user", message)
          // Marquer comme traitée immédiatement pour éviter les doublons
          initialRequestProcessedRef.current = true
        }
      }

      // Annuler toute requête précédente
      if (controllerRef.current) {
        controllerRef.current.abort()
      }
      controllerRef.current = new AbortController()

      // Générer un ID de requête si nécessaire
      const currentRequestId = isInitialRequest ? requestId || uuidv4() : uuidv4()

      console.log(`Sending request with ID ${currentRequestId}`)

      const response = await fetch(`${BASE_URL}/api/chat/stream/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(await getAuthHeader()),
        },
        body: JSON.stringify({
          prompt: message,
          requestId: currentRequestId,
          conversationId: currentConversation.id,
        }),
        signal: controllerRef.current.signal,
      })

      if (!response.body) throw new Error("No response body")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let fullResponse = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split("\n\n")
        buffer = parts.pop() || ""

        for (const part of parts) {
          const event = part.replace(/^data: /, "")
          if (event === "[DONE]") break

          try {
            const data = JSON.parse(event)
            if (data.content) {
              fullResponse += data.content
            }
          } catch (e) {
            console.error("Parse error:", e)
          }
        }
      }

      // Ajouter la réponse à la conversation
      console.log("Adding assistant response to conversation")
      addMessage(currentConversation.id, "assistant", fullResponse)
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.error("Fetch error:", error)

        // Ajouter le message d'erreur à la conversation
        addMessage(currentConversation.id, "assistant", "Erreur lors de la génération de l'explication")
      }
    } finally {
      setLoading(false)

      // Réinitialiser l'état de la requête si c'était la requête initiale
      if (isInitialRequest) {
        setIsRequestPending(false)
      }

      // Vider le champ de saisie
      setNewPrompt("")

      // Libérer le verrou
      isProcessingRef.current = false
    }
  }

  // Traiter la requête initiale (texte sélectionné) - avec une dépendance réduite
  useEffect(() => {
    // Utiliser une fonction auto-exécutée pour éviter les problèmes de async/await dans useEffect
    ; (async () => {
      // Vérifier si nous avons une requête en attente et si nous ne sommes pas déjà en train de traiter
      if (
        isRequestPending &&
        !isProcessingRef.current &&
        !initialRequestProcessedRef.current &&
        selectedText &&
        selectedText.length > 3 &&
        currentConversation &&
        isAIPanelOpen
      ) {
        console.log("Initial request detected, processing...")
        await sendMessageToAPI(selectedText, true)
      }
    })()

    // Dépendances réduites pour éviter les déclenchements multiples
  }, [isRequestPending, currentConversation, isAIPanelOpen])

  const handleClose = () => {
    if (controllerRef.current) {
      controllerRef.current.abort()
    }

    closeAIPanel()
    clearSelection()
    initialRequestProcessedRef.current = false
    isProcessingRef.current = false
    lastRequestIdRef.current = null
  }

  const handleSubmitPrompt = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPrompt.trim() && !loading && currentConversation && !isProcessingRef.current) {
      console.log("Submitting user prompt:", newPrompt)
      await sendMessageToAPI(newPrompt.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmitPrompt(e as unknown as React.FormEvent)
    }
  }

  if (!isAIPanelOpen) {
    return null // Ne rien afficher si le panneau est fermé
  }

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed right-0 top-0 bottom-0 w-[400px] z-50 flex flex-col bg-black/40 backdrop-blur-xl border-l border-white/10 shadow-2xl"
    >
      {/* Entête */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="h-5 w-5 text-pink-400" />
            <motion.div
              className="absolute inset-0 rounded-full bg-pink-400/20"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
          <h3 className="font-medium text-white">Hackitech AI</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-white/10"
            onClick={() => setShowHistory(!showHistory)}
            title={showHistory ? "Masquer l'historique" : "Afficher l'historique"}
          >
            <Clock className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-white/10"
            onClick={handleClose}
            title="Fermer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden flex">
        {/* Historique des conversations */}
        {showHistory && (
          <div className="w-1/3 border-r border-white/10 bg-black/20 overflow-y-auto p-2">
            <div className="text-xs font-medium text-white/60 mb-2 px-2">Historique</div>
            {conversations.length === 0 ? (
              <div className="text-xs text-white/40 px-2">Aucune conversation</div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    className={cn(
                      "w-full text-left px-2 py-1.5 rounded text-xs hover:bg-white/5 transition-colors",
                      currentConversation?.id === conv.id ? "bg-white/10" : "",
                    )}
                    onClick={() => switchConversation(conv.id)}
                  >
                    <div className="font-medium truncate">{conv.title}</div>
                    <div className="text-white/40 truncate">
                      {conv.messages.length} message{conv.messages.length > 1 ? "s" : ""}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Conversation actuelle */}
        <div className={cn("flex flex-col", showHistory ? "w-2/3" : "w-full")}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentConversation?.messages.map((msg) => (
              <div key={msg.id} className={cn("flex flex-col", msg.role === "user" ? "items-end" : "items-start")}>
                <div className="text-xs text-white/40 mb-1">{msg.role === "user" ? "Vous" : "Assistant"}</div>
                <div
                  className={cn(
                    "p-3 rounded-lg max-w-[85%]",
                    msg.role === "user"
                      ? "bg-pink-500/20 border border-pink-500/30 text-sm"
                      : "bg-white/5 border border-white/10 markdown-content",
                  )}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      className="text-sm"
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-xl font-bold my-3" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-lg font-bold my-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-md font-bold my-2" {...props} />,
                        p: ({ node, ...props }) => <p className="my-2" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
                        li: ({ node, ...props }) => <li className="my-1" {...props} />,
                        a: ({ node, ...props }) => (
                          <a
                            className="text-blue-400 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                          />
                        ),
                        code: ({
                          node,
                          className,
                          children,
                          inline,
                          ...props
                        }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode }) => {
                          if (inline) {
                            return (
                              <code
                                className="bg-black/30 px-1 py-0.5 rounded text-pink-300 font-mono text-xs"
                                {...props}
                              >
                                {children}
                              </code>
                            )
                          }
                          return (
                            <div className="bg-black/50 rounded-md my-2 overflow-hidden">
                              <div className="bg-black/70 px-4 py-1 text-xs text-white/60 font-mono border-b border-white/10">
                                Code
                              </div>
                              <pre className="p-4 overflow-x-auto">
                                <code className={cn("font-mono text-xs", className)} {...props}>
                                  {children}
                                </code>
                              </pre>
                            </div>
                          )
                        },
                        blockquote: ({ node, ...props }) => (
                          <blockquote
                            className="border-l-2 border-pink-500/50 pl-4 italic text-white/80 my-2"
                            {...props}
                          />
                        ),
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-2">
                            <table className="min-w-full border border-white/10" {...props} />
                          </div>
                        ),
                        thead: ({ node, ...props }) => <thead className="bg-black/30" {...props} />,
                        th: ({ node, ...props }) => (
                          <th className="px-3 py-2 text-left text-xs font-medium border border-white/10" {...props} />
                        ),
                        td: ({ node, ...props }) => (
                          <td className="px-3 py-2 text-sm border border-white/10" {...props} />
                        ),
                        hr: ({ node, ...props }) => <hr className="my-4 border-white/10" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-center p-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Loader2 className="h-6 w-6 text-pink-400" />
                </motion.div>
              </div>
            )}

            <div ref={conversationEndRef} />
          </div>

          {/* Zone de saisie */}
          <div className="p-3 border-t border-white/10 bg-white/5">
            <form onSubmit={handleSubmitPrompt} className="flex gap-2">
              <Textarea
                ref={promptInputRef}
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez une question..."
                className="min-h-[40px] max-h-[120px] bg-black/20 border-white/10 resize-none"
                disabled={loading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !newPrompt.trim() || !currentConversation}
                className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bouton pour réduire le panneau */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 h-12 w-8 rounded-l-lg bg-black/40 backdrop-blur-sm border-l border-y border-white/10 hover:bg-black/60"
        onClick={handleClose}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}

