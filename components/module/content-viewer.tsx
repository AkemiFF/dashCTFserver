"use client"

import { useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import type { ContentItem as ContentItemType } from "@/services/types/course"
import { ContentItem } from "./content-item"

interface ContentViewerProps {
  contentSets: ContentItemType[][]
  currentContentIndex: number
  setCurrentContentIndex: (index: number) => void
  totalItems: number
  setCurrentStep: (step: "content" | "quiz") => void
}

export function ContentViewer({
  contentSets,
  currentContentIndex,
  setCurrentContentIndex,
  totalItems,
  setCurrentStep,
}: ContentViewerProps) {
  const contentContainerRef = useRef<HTMLDivElement>(null)
  const totalPages = contentSets.length
  const currentContentSet = contentSets[currentContentIndex] || []

  const handlePreviousContent = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1)
      // Faire défiler vers le haut de la page
      contentContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleNextContent = () => {
    if (currentContentIndex < contentSets.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1)
      // Faire défiler vers le haut de la page
      contentContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      // Si nous sommes à la dernière page, proposer de passer au quiz
      setCurrentStep("quiz")
    }
  }

  if (!contentSets || contentSets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/70">Aucun contenu disponible pour ce module.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Barre de progression */}
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
          style={{ width: `${((currentContentIndex + 1) / totalPages) * 100}%` }}
        />
      </div>

      {/* Indicateur de page */}
      <div className="flex justify-between items-center text-sm text-white/60">
        <span>
          Page {currentContentIndex + 1} sur {totalPages}
        </span>
        <span>
          {Math.min((currentContentIndex + 1) * currentContentSet.length, totalItems)} sur {totalItems} éléments
        </span>
      </div>

      {/* Contenu actuel */}
      <div ref={contentContainerRef} className="space-y-8 min-h-[50vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentContentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {currentContentSet.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ContentItem item={item} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={handlePreviousContent}
          disabled={currentContentIndex === 0}
          className="border-white/10 hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Précédent
        </Button>

        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
            // Afficher les 5 pages autour de la page actuelle
            let pageToShow
            if (totalPages <= 5) {
              pageToShow = idx
            } else if (currentContentIndex < 2) {
              pageToShow = idx
            } else if (currentContentIndex > totalPages - 3) {
              pageToShow = totalPages - 5 + idx
            } else {
              pageToShow = currentContentIndex - 2 + idx
            }

            return (
              <button
                key={pageToShow}
                onClick={() => setCurrentContentIndex(pageToShow)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${pageToShow === currentContentIndex ? "bg-pink-500 text-white" : "bg-white/10 hover:bg-white/20"
                  }`}
              >
                {pageToShow + 1}
              </button>
            )
          })}
          {totalPages > 5 && currentContentIndex < totalPages - 3 && (
            <>
              <span className="text-white/40">...</span>
              <button
                onClick={() => setCurrentContentIndex(totalPages - 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {currentContentIndex < totalPages - 1 ? (
          <Button
            onClick={handleNextContent}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            Suivant
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentStep("quiz")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            Passer au quiz
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}

