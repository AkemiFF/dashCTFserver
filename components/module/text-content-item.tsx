"use client"

import { cn } from "@/lib/utils"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTextSelection } from "./text-selection-context"

interface TextContentItemProps {
  content: string
}

export function TextContentItem({ content }: TextContentItemProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { setSelectedText, setSelectionPosition, isRequestPending } = useTextSelection()
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedContent, setProcessedContent] = useState("")

  // Traiter le contenu HTML pour améliorer le rendu
  useEffect(() => {
    if (!content) {
      setProcessedContent("")
      return
    }

    // Fonction pour traiter le contenu HTML
    const processContent = (html: string) => {
      // Créer un élément temporaire pour manipuler le HTML
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = html

      // Traiter les blocs de code
      const codeBlocks = tempDiv.querySelectorAll("code")
      codeBlocks.forEach((codeBlock) => {
        // Ajouter des classes pour le style
        codeBlock.classList.add("bg-gray-800", "text-gray-100", "px-1.5", "py-0.5", "rounded", "font-mono", "text-sm")

        // Si le code est dans un bloc pre, ajouter des styles supplémentaires
        if (codeBlock.parentElement?.tagName === "PRE") {
          codeBlock.classList.add("block", "p-4", "my-4", "overflow-x-auto")
          codeBlock.parentElement.classList.add("bg-transparent", "p-0", "m-0")
        }
      })

      // Traiter les titres
      const headings = tempDiv.querySelectorAll("h1, h2, h3")
      headings.forEach((heading) => {
        heading.classList.add("font-bold", "text-white")

        if (heading.tagName === "H1") {
          heading.classList.add("text-2xl", "mt-6", "mb-4")
        } else if (heading.tagName === "H2") {
          heading.classList.add("text-xl", "mt-5", "mb-3")
        } else if (heading.tagName === "H3") {
          heading.classList.add("text-lg", "mt-4", "mb-2")
        }
      })

      // Traiter les listes
      const lists = tempDiv.querySelectorAll("ul, ol")
      lists.forEach((list) => {
        list.classList.add("my-4", "pl-5")

        if (list.tagName === "UL") {
          list.classList.add("list-disc")
        } else {
          list.classList.add("list-decimal")
        }

        // Traiter les éléments de liste
        const items = list.querySelectorAll("li")
        items.forEach((item) => {
          item.classList.add("mb-1")
        })
      })

      // Traiter les citations
      const blockquotes = tempDiv.querySelectorAll("blockquote")
      blockquotes.forEach((quote) => {
        quote.classList.add("border-l-4", "border-blue-500", "pl-4", "py-1", "my-4", "italic", "text-gray-300")
      })

      // Traiter les liens
      const links = tempDiv.querySelectorAll("a")
      links.forEach((link) => {
        link.classList.add("text-blue-400", "hover:text-blue-300", "underline", "transition-colors")
        // Ajouter des attributs de sécurité pour les liens externes
        if (link.href && link.href.startsWith("http")) {
          link.setAttribute("target", "_blank")
          link.setAttribute("rel", "noopener noreferrer")
        }
      })

      // Traiter les images
      const images = tempDiv.querySelectorAll("img")
      images.forEach((img) => {
        img.classList.add("max-w-full", "h-auto", "rounded-md", "my-4")
        // S'assurer que les images ont un attribut alt
        if (!img.alt) {
          img.alt = "Image"
        }
      })

      return tempDiv.innerHTML
    }

    setProcessedContent(processContent(content))
  }, [content])

  const handleSelection = useCallback(() => {
    // Si une requête est en cours, ne pas traiter de nouvelles sélections
    if (isProcessing || isRequestPending) return

    const selection = window.getSelection()
    if (!selection) return

    const text = selection.toString().trim()

    if (!text || text.length < 3) {
      // Texte trop court ou vide
      setSelectedText(null)
      setSelectionPosition(null)
      return
    }

    if (!contentRef.current) return

    try {
      setIsProcessing(true)
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      // Vérifier la position
      const componentRect = contentRef.current?.getBoundingClientRect()
      if (!componentRect || !isWithinBounds(rect, componentRect)) return

      setSelectedText(text)
      setSelectionPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      })
    } finally {
      setIsProcessing(false)
    }
  }, [isProcessing, isRequestPending, setSelectedText, setSelectionPosition])

  useEffect(() => {
    const currentRef = contentRef.current
    if (!currentRef) return

    // Utiliser mouseup uniquement sur ce composant spécifique
    currentRef.addEventListener("mouseup", handleSelection)
    currentRef.addEventListener("touchend", handleSelection)

    return () => {
      currentRef.removeEventListener("mouseup", handleSelection)
      currentRef.removeEventListener("touchend", handleSelection)
    }
  }, [handleSelection])

  const isWithinBounds = (rect: DOMRect, container: DOMRect) => {
    return (
      rect.top >= container.top &&
      rect.bottom <= container.bottom &&
      rect.left >= container.left &&
      rect.right <= container.right
    )
  }

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className={cn(
          "prose prose-invert max-w-none",
          // Styles supplémentaires pour améliorer le rendu
          "prose-headings:text-white prose-headings:font-bold",
          "prose-p:text-gray-200 prose-p:leading-relaxed",
          "prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300",
          "prose-code:bg-gray-800 prose-code:text-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm",
          "prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-md",
          "prose-img:rounded-md prose-img:max-w-full prose-img:h-auto",
          "prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:italic prose-blockquote:text-gray-300",
          "prose-ul:list-disc prose-ol:list-decimal prose-li:mb-1",
        )}
        dangerouslySetInnerHTML={{ __html: processedContent || "" }}
      />
    </div>
  )
}

