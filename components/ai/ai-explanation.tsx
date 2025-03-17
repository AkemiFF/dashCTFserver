"use client"

import type React from "react"

import { useTextSelection } from "@/components/module/text-selection-context"
import { Button } from "@/components/ui/button"
import { getAuthHeader } from "@/lib/auth"
import { BASE_URL } from "@/lib/host"
import { motion, useDragControls } from "framer-motion"
import { ArrowLeftRight, Clock, Loader2, Maximize2, Minimize2, Send, Sparkles, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useAIConversation } from "@/hooks/use-ai-conversation"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"

interface AIExplanationProps {
  selectedText: string
  position: { x: number; y: number }
  onClose: () => void
}

export function AIExplanation({ selectedText, position, onClose }: AIExplanationProps) {
  const [explanation, setExplanation] = useState("")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [docked, setDocked] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [newPrompt, setNewPrompt] = useState("")
  const [submittingPrompt, setSubmittingPrompt] = useState(false)

  const { isRequestPending, setIsRequestPending, requestId } = useTextSelection()
  const { conversations, currentConversation, createConversation, addMessage, switchConversation } = useAIConversation()

  const containerRef = useRef<HTMLDivElement>(null)
  const [adjustedPosition, setAdjustedPosition] = useState(position)
  const controllerRef = useRef<AbortController | null>(null)
  const fetchAttemptedRef = useRef(false)
  const dragControls = useDragControls()
  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  // Créer une nouvelle conversation avec le texte sélectionné
  useEffect(() => {
    if (selectedText && !currentConversation) {
      createConversation(selectedText)
    }
  }, [selectedText, currentConversation, createConversation])

  // Ajuster la position de la fenêtre
  useEffect(() => {
    const adjustPosition = () => {
      if (!containerRef.current || docked) return

      const rect = containerRef.current.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      }

      if (!expanded) {
        setAdjustedPosition({
          x: Math.min(position.x, viewport.width - rect.width - 20),
          y: position.y + rect.height > viewport.height - 20 ? position.y - rect.height - 10 : position.y,
        })
      } else {
        // Si élargi, centrer horizontalement
        setAdjustedPosition({
          x: Math.max(20, Math.min((viewport.width - rect.width) / 2, viewport.width - rect.width - 20)),
          y: Math.max(20, Math.min((viewport.height - rect.height) / 2, viewport.height - rect.height - 20)),
        })
      }
    }

    adjustPosition()
    window.addEventListener("resize", adjustPosition)
    return () => window.removeEventListener("resize", adjustPosition)
  }, [position, explanation, expanded, docked])

  // Fetch l'explication
  useEffect(() => {
    if (fetchAttemptedRef.current || !currentConversation) {
      return
    }

    const currentRequestId = requestId || uuidv4()

    const fetchExplanation = async () => {
      if (!isRequestPending && !submittingPrompt) {
        return
      }

      fetchAttemptedRef.current = true

      try {
        setLoading(true)
        setExplanation("")

        if (controllerRef.current) {
          controllerRef.current.abort()
        }
        controllerRef.current = new AbortController()

        const promptToSend = submittingPrompt ? newPrompt : selectedText

        // Ajouter le message utilisateur à la conversation
        if (submittingPrompt && currentConversation) {
          addMessage(currentConversation.id, "user", promptToSend)
        }

        const response = await fetch(`${BASE_URL}/api/chat/stream/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(await getAuthHeader()),
          },
          body: JSON.stringify({
            prompt: promptToSend,
            requestId: currentRequestId,
            conversationId: currentConversation?.id,
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
                setExplanation(fullResponse)
              }
            } catch (e) {
              console.error("Parse error:", e)
            }
          }
        }

        // Ajouter la réponse à la conversation
        if (currentConversation) {
          addMessage(currentConversation.id, "assistant", fullResponse)
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Fetch error:", error)
          setExplanation("Erreur lors de la génération de l'explication")

          // Ajouter le message d'erreur à la conversation
          if (currentConversation) {
            addMessage(currentConversation.id, "assistant", "Erreur lors de la génération de l'explication")
          }
        }
      } finally {
        setLoading(false)
        setIsRequestPending(false)
        setSubmittingPrompt(false)
        setNewPrompt("")
      }
    }

    if ((selectedText.length > 3 && !submittingPrompt) || (submittingPrompt && newPrompt.length > 0)) {
      fetchExplanation()
    }

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort()
        controllerRef.current = null
      }
    }
  }, [selectedText, requestId, isRequestPending, submittingPrompt, newPrompt, currentConversation, addMessage])

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    if (controllerRef.current) {
      controllerRef.current.abort()
    }
    onClose()
  }

  const handleDragStart = (event: React.PointerEvent) => {
    if (!docked) {
      dragControls.start(event)
    }
  }

  const handleToggleExpand = () => {
    setExpanded(!expanded)
    if (docked) {
      setDocked(false)
    }
  }

  const handleToggleDock = () => {
    setDocked(!docked)
    if (!docked) {
      setExpanded(true)
    }
  }

  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPrompt.trim() && !submittingPrompt && !loading) {
      setSubmittingPrompt(true)
      fetchAttemptedRef.current = false
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmitPrompt(e)
    }
  }

  return (
    <motion.div
      ref={containerRef}
      drag={!docked}
      dragControls={dragControls}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        width: docked ? "400px" : expanded ? "500px" : "350px",
        height: docked ? "100vh" : expanded ? "600px" : "auto",
        left: docked ? "auto" : `${adjustedPosition.x}px`,
        top: docked ? 0 : `${adjustedPosition.y}px`,
        right: docked ? 0 : "auto",
        bottom: docked ? 0 : "auto",
        borderRadius: docked ? "0" : "12px",
      }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.2 }}
      className={cn("fixed z-1000", docked ? "right-0 top-0 bottom-0" : "")}
    >
      <div className="relative backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl overflow-hidden flex flex-col h-full">
        {/* Effet de particules animées */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-pink-500/40 rounded-full"
              initial={{
                x: Math.random() * 320,
                y: Math.random() * 400,
                opacity: 0.2 + Math.random() * 0.3,
              }}
              animate={{
                y: [null, Math.random() * 400],
                opacity: [null, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            />
          ))}
        </div>

        {/* Entête avec poignée de déplacement */}
        <div
          className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5 cursor-move"
          onPointerDown={handleDragStart}
        >
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
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-white/10"
              onClick={handleToggleExpand}
              title={expanded ? "Réduire" : "Agrandir"}
            >
              {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-white/10"
              onClick={handleToggleDock}
              title={docked ? "Détacher" : "Attacher à droite"}
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-white/10"
              onClick={() => setShowHistory(!showHistory)}
              title={showHistory ? "Masquer l'historique" : "Afficher l'historique"}
            >
              <Clock className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-white/10"
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
              {currentConversation?.messages.map((msg, index) => (
                <div key={msg.id} className={cn("flex flex-col", msg.role === "user" ? "items-end" : "items-start")}>
                  <div className="text-xs text-white/40 mb-1">{msg.role === "user" ? "Vous" : "Assistant"}</div>
                  <div
                    className={cn(
                      "p-3 rounded-lg max-w-[85%] text-sm",
                      msg.role === "user"
                        ? "bg-pink-500/20 border border-pink-500/30"
                        : "bg-white/5 border border-white/10",
                    )}
                  >
                    {msg.content}
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
                  disabled={loading || submittingPrompt}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={loading || submittingPrompt || !newPrompt.trim()}
                  className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Ligne de connexion (seulement si pas en mode dock ou étendu) */}
      {!docked && !expanded && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 40 }}
          className="absolute left-4 w-px bg-gradient-to-b from-pink-500/80 to-transparent"
          style={{
            top: adjustedPosition.y > position.y ? "-40px" : "100%",
            transformOrigin: adjustedPosition.y > position.y ? "bottom" : "top",
          }}
        />
      )}
    </motion.div>
  )
}

