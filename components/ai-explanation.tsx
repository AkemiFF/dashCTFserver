"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Check, Copy, Loader2, Sparkles, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface AIExplanationProps {
  selectedText: string
  position: { x: number; y: number }
  onClose: () => void
}

export function AIExplanation({ selectedText, position, onClose }: AIExplanationProps) {
  const [explanation, setExplanation] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Ajuster la position pour éviter que le popup sorte de l'écran
  const [adjustedPosition, setAdjustedPosition] = useState(position)

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let newX = position.x
      let newY = position.y

      // Ajuster horizontalement
      if (position.x + rect.width > viewportWidth - 20) {
        newX = viewportWidth - rect.width - 20
      }

      // Ajuster verticalement
      if (position.y + rect.height > viewportHeight - 20) {
        newY = position.y - rect.height - 10
      }

      setAdjustedPosition({ x: newX, y: newY })
    }
  }, [position, explanation])

  useEffect(() => {
    // Simuler une requête à l'API d'IA
    const timer = setTimeout(() => {
      // Générer une explication basée sur le texte sélectionné
      const generateExplanation = () => {
        if (selectedText.length < 10) {
          return "Veuillez sélectionner un passage plus long pour obtenir une explication pertinente."
        }

        // Simuler différentes explications selon le contenu
        if (selectedText.toLowerCase().includes("javascript")) {
          return "JavaScript est un langage de programmation qui permet d'implémenter des mécanismes complexes sur une page web. C'est un langage orienté objet à prototype, principalement utilisé côté client pour rendre les pages web interactives.\n\nJavaScript est essentiel au développement web moderne et constitue l'un des trois piliers du web avec HTML et CSS."
        } else if (selectedText.toLowerCase().includes("react")) {
          return "React est une bibliothèque JavaScript front-end développée par Facebook pour créer des interfaces utilisateur. Elle permet de construire des composants réutilisables qui présentent des données qui changent au fil du temps.\n\nReact utilise un DOM virtuel pour optimiser les performances de rendu et adopte un flux de données unidirectionnel."
        } else if (selectedText.toLowerCase().includes("css")) {
          return "CSS (Cascading Style Sheets) est un langage de feuille de style utilisé pour décrire la présentation d'un document écrit en HTML. CSS est conçu pour permettre la séparation de la présentation et du contenu.\n\nIl permet de contrôler la mise en page, les couleurs, les polices et l'apparence générale d'une page web."
        } else {
          return `Ce passage traite de concepts importants dans le domaine de l'informatique et du développement web. Voici une explication simplifiée:\n\n${selectedText.substring(0, 50)}... fait référence à ${selectedText.length > 100 ? "des principes fondamentaux qui sont essentiels à maîtriser pour progresser dans ce domaine" : "un concept spécifique qui mérite d'être approfondi"}.\n\nPour mieux comprendre, essayez de mettre en pratique ces concepts dans des projets concrets.`
        }
      }

      setExplanation(generateExplanation())
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [selectedText])

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-white/10" onClick={onClose}>
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

