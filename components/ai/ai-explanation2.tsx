"use client"

import { useTextSelection } from "@/components/module/text-selection-context"
import { Button } from "@/components/ui/button"
import { getAuthHeader } from "@/lib/auth"
import { BASE_URL } from "@/lib/host"
import { motion } from "framer-motion"
import { Check, Copy, Loader2, Sparkles, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface AIExplanationProps {
  selectedText: string
  position: { x: number; y: number }
  onClose: () => void
}

export function AIExplanation({ selectedText, position, onClose }: AIExplanationProps) {
  const [explanation, setExplanation] = useState("")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const { isRequestPending, setIsRequestPending, requestId } = useTextSelection()

  const containerRef = useRef<HTMLDivElement>(null)
  const [adjustedPosition, setAdjustedPosition] = useState(position)
  const controllerRef = useRef<AbortController | null>(null)
  const fetchAttemptedRef = useRef(false)

  useEffect(() => {
    const adjustPosition = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      }

      setAdjustedPosition({
        x: Math.min(position.x, viewport.width - rect.width - 20),
        y: position.y + rect.height > viewport.height - 20 ? position.y - rect.height - 10 : position.y,
      })
    }

    adjustPosition()
  }, [position, explanation])

  useEffect(() => {
    // Éviter les requêtes multiples
    if (fetchAttemptedRef.current) {
      console.log("Fetch already attempted, skipping")
      return
    }

    const currentRequestId = requestId

    const fetchExplanation = async () => {
      if (!isRequestPending) {
        console.log("Request not pending, skipping fetch")
        return
      }

      fetchAttemptedRef.current = true

      try {
        setLoading(true)
        setExplanation("")

        // Créer un nouveau contrôleur pour cette requête
        if (controllerRef.current) {
          controllerRef.current.abort()
        }
        controllerRef.current = new AbortController()

        console.log(`Starting fetch for request ${currentRequestId}`)

        const response = await fetch(`${BASE_URL}/api/chat/stream/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(await getAuthHeader()),
          },
          body: JSON.stringify({
            prompt: selectedText,
            requestId: currentRequestId, // Inclure l'ID de requête pour le suivi côté serveur
          }),
          signal: controllerRef.current.signal,
        })

        if (!response.body) throw new Error("No response body")

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""

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
                setExplanation((prev) => prev + data.content)
              }
            } catch (e) {
              console.error("Parse error:", e)
            }
          }
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Fetch error:", error)
          setExplanation("Erreur lors de la génération de l'explication")
        }
      } finally {
        setLoading(false)
        setIsRequestPending(false)
      }
    }

    if (selectedText.length > 3) {
      fetchExplanation()
    }

    return () => {
      if (controllerRef.current) {
        console.log(`Aborting fetch for request ${currentRequestId}`)
        controllerRef.current.abort()
        controllerRef.current = null
      }
    }
  }, [selectedText, requestId, isRequestPending, setIsRequestPending])

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

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="fixed z-1000 w-80"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
    >
      <div className="relative backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
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

        {/* Entête */}
        <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Sparkles className="h-5 w-5 text-pink-400" />
              <motion.div
                className="absolute inset-0 rounded-full bg-pink-400/20"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
            <h3 className="font-medium text-white">Explication IA</h3>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-white/10" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Contenu */}
        <div className="p-4">
          <div className="mb-2 text-xs text-white/60">Texte sélectionné:</div>
          <div className="p-2 bg-white/5 rounded border border-white/10 text-sm mb-4 max-h-20 overflow-y-auto">
            {selectedText.length > 150 ? `${selectedText.substring(0, 150)}...` : selectedText}
          </div>

          <div className="mb-2 text-xs text-white/60">Explication:</div>
          <div className="relative">
            {loading ? (
              <div className="min-h-[100px] flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Loader2 className="h-6 w-6 text-pink-400" />
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-white/5 rounded-lg border border-white/10 text-sm whitespace-pre-line min-h-[100px] max-h-[200px] overflow-y-auto"
              >
                {explanation}
              </motion.div>
            )}
          </div>
        </div>

        {/* Pied de page */}
        <div className="p-3 border-t border-white/10 bg-white/5 flex justify-between items-center">
          <div className="text-xs text-white/60">Propulsé par Hackitech AI</div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-white/10 hover:bg-white/10 text-xs gap-1.5"
            onClick={handleCopy}
            disabled={loading}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copié</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copier</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Ligne de connexion */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: 40 }}
        className="absolute left-4 w-px bg-gradient-to-b from-pink-500/80 to-transparent"
        style={{
          top: adjustedPosition.y > position.y ? "-40px" : "100%",
          transformOrigin: adjustedPosition.y > position.y ? "bottom" : "top",
        }}
      />
    </motion.div>
  )
}

