"use client"

import type { ContentItem } from "@/services/types/course"
import { Drawer, DrawerContent } from "@/components/ui/drawer"

interface TableOfContentsProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  content: ContentItem[]
  currentContentIndex: number
  setCurrentContentIndex: (index: number) => void
  itemsPerPage: number
}

export function TableOfContents({
  isOpen,
  setIsOpen,
  content,
  currentContentIndex,
  setCurrentContentIndex,
  itemsPerPage,
}: TableOfContentsProps) {
  if (!content || content.length === 0) return null

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="bg-navy-900 border-t border-white/10">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Table des matières</h3>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {content.map((item, index) => {
              const pageIndex = Math.floor(index / itemsPerPage)
              const isCurrentPage = pageIndex === currentContentIndex

              let title = ""
              if (item.type === "text") {
                // Extraire le premier titre ou les premiers mots du contenu
                const content = item.content || ""
                const titleMatch = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i)
                if (titleMatch) {
                  title = titleMatch[1].replace(/<[^>]*>/g, "") // Supprimer les balises HTML
                } else {
                  // Prendre les premiers mots du contenu
                  const textContent = content.replace(/<[^>]*>/g, "").trim()
                  title = textContent.split(" ").slice(0, 5).join(" ") + "..."
                }
              } else if (item.type === "image") {
                title = `Image ${index + 1}`
              } else if (item.type === "video") {
                title = `Vidéo ${index + 1}`
              } else if (item.type === "file") {
                title = item.filename || `Fichier ${index + 1}`
              } else if (item.type === "link") {
                title = item.description || `Lien ${index + 1}`
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentContentIndex(pageIndex)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-colors flex items-center gap-2 ${isCurrentPage ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/70"
                    }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isCurrentPage ? "bg-pink-500 text-white" : "bg-white/10"
                      }`}
                  >
                    {index + 1}
                  </div>
                  <span className="truncate">{title || `Élément ${index + 1}`}</span>
                </button>
              )
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

