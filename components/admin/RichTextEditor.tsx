"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  Link,
  List,
  ListOrdered,
  Palette,
  Quote,
  Underline,
  X,
} from "lucide-react"
import { useRef, useState } from "react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  maxHeight?: string
}

type FormatType =
  | "bold"
  | "italic"
  | "underline"
  | "h1"
  | "h2"
  | "h3"
  | "ul"
  | "ol"
  | "quote"
  | "code"
  | "left"
  | "center"
  | "right"
  | "link"
  | "image"

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Entrez votre texte ici...",
  minHeight = "200px",
  maxHeight = "500px",
}: RichTextEditorProps) {
  const [selection, setSelection] = useState<{ start: number; end: number; text: string } | null>(null)
  const [activeFormats, setActiveFormats] = useState<FormatType[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [textColor, setTextColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("")

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Mettre à jour la sélection lorsque l'utilisateur sélectionne du texte
  const handleSelect = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const text = value.substring(start, end)

      setSelection({ start, end, text })

      // Analyser les formats actifs dans la sélection
      const selectedText = value.substring(start, end)
      const activeFormats: FormatType[] = []

      if (selectedText.match(/<strong>.*<\/strong>/)) activeFormats.push("bold")
      if (selectedText.match(/<em>.*<\/em>/)) activeFormats.push("italic")
      if (selectedText.match(/<u>.*<\/u>/)) activeFormats.push("underline")
      // Ajouter d'autres détections de format ici

      setActiveFormats(activeFormats)
    }
  }

  // Appliquer un format au texte sélectionné
  const applyFormat = (format: FormatType) => {
    if (!selection || selection.start === selection.end) return

    const before = value.substring(0, selection.start)
    const selected = selection.text
    const after = value.substring(selection.end)
    let formattedText = ""

    switch (format) {
      case "bold":
        formattedText = `<strong>${selected}</strong>`
        break
      case "italic":
        formattedText = `<em>${selected}</em>`
        break
      case "underline":
        formattedText = `<u>${selected}</u>`
        break
      case "h1":
        formattedText = `<h1>${selected}</h1>`
        break
      case "h2":
        formattedText = `<h2>${selected}</h2>`
        break
      case "h3":
        formattedText = `<h3>${selected}</h3>`
        break
      case "ul":
        formattedText = `<ul>\n  <li>${selected.split("\n").join("</li>\n  <li>")}</li>\n</ul>`
        break
      case "ol":
        formattedText = `<ol>\n  <li>${selected.split("\n").join("</li>\n  <li>")}</li>\n</ol>`
        break
      case "quote":
        formattedText = `<blockquote>${selected}</blockquote>`
        break
      case "code":
        formattedText = `<code>${selected}</code>`
        break
      case "left":
        formattedText = `<div style="text-align: left">${selected}</div>`
        break
      case "center":
        formattedText = `<div style="text-align: center">${selected}</div>`
        break
      case "right":
        formattedText = `<div style="text-align: right">${selected}</div>`
        break
      default:
        formattedText = selected
    }

    const newValue = before + formattedText + after
    onChange(newValue)

    // Restaurer la sélection après le formatage
    setTimeout(() => {
      if (textareaRef.current) {
        const newSelectionStart = before.length
        const newSelectionEnd = before.length + formattedText.length
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(newSelectionStart, newSelectionEnd)
        handleSelect()
      }
    }, 0)
  }

  // Insérer un lien
  const insertLink = () => {
    if (!selection || !linkUrl) return

    const before = value.substring(0, selection.start)
    const selected = selection.text || "Lien"
    const after = value.substring(selection.end)

    const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${selected}</a>`
    const newValue = before + linkHtml + after

    onChange(newValue)
    setLinkUrl("")

    // Restaurer la sélection
    setTimeout(() => {
      if (textareaRef.current) {
        const newSelectionStart = before.length
        const newSelectionEnd = before.length + linkHtml.length
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(newSelectionStart, newSelectionEnd)
      }
    }, 0)
  }

  // Insérer une image
  const insertImage = () => {
    if (!imageUrl) return

    const before = value.substring(0, selection?.start || value.length)
    const after = value.substring(selection?.end || value.length)

    const imageHtml = `<img src="${imageUrl}" alt="${imageAlt}" class="max-w-full h-auto rounded-md my-2" />`
    const newValue = before + imageHtml + after

    onChange(newValue)
    setImageUrl("")
    setImageAlt("")
  }

  // Appliquer une couleur de texte
  const applyTextColor = () => {
    if (!selection || selection.start === selection.end) return

    const before = value.substring(0, selection.start)
    const selected = selection.text
    const after = value.substring(selection.end)

    const coloredText = `<span style="color: ${textColor}">${selected}</span>`
    const newValue = before + coloredText + after

    onChange(newValue)
  }

  // Appliquer une couleur de fond
  const applyBgColor = () => {
    if (!selection || selection.start === selection.end || !bgColor) return

    const before = value.substring(0, selection.start)
    const selected = selection.text
    const after = value.substring(selection.end)

    const highlightedText = `<span style="background-color: ${bgColor}">${selected}</span>`
    const newValue = before + highlightedText + after

    onChange(newValue)
  }

  // Rendu HTML pour la prévisualisation
  const renderHtml = () => {
    return { __html: value }
  }

  return (
    <div className="border rounded-md shadow-sm bg-gray-950">
      <Tabs defaultValue="edit" className="w-full">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="edit">Éditer</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="p-0">
          <TooltipProvider>
            <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/40">
              {/* Formatage de texte basique */}
              <div className="flex items-center mr-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applyFormat("bold")}
                      className={cn("h-8 w-8 p-0", activeFormats.includes("bold") && "bg-muted")}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Gras</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applyFormat("italic")}
                      className={cn("h-8 w-8 p-0", activeFormats.includes("italic") && "bg-muted")}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Italique</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applyFormat("underline")}
                      className={cn("h-8 w-8 p-0", activeFormats.includes("underline") && "bg-muted")}
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Souligné</TooltipContent>
                </Tooltip>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* Titres */}
              <div className="flex items-center mr-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applyFormat("h1")}
                      className="h-8 w-8 p-0"
                    >
                      <Heading1 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Titre 1</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applyFormat("h2")}
                      className="h-8 w-8 p-0"
                    >
                      <Heading2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Titre 2</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applyFormat("h3")}
                      className="h-8 w-8 p-0"
                    >
                      <Heading3 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Titre 3</TooltipContent>
                </Tooltip>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* Listes */}
              <div className="flex items-center mr-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applyFormat("ul")}
                      className="h-8 w-8 p-0"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Liste à puces</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applyFormat("ol")}
                      className="h-8 w-8 p-0"
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Liste numérotée</TooltipContent>
                </Tooltip>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* Alignement */}
              <div className="flex items-center mr-2">
                <ToggleGroup type="single" variant="outline" size="sm">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ToggleGroupItem value="left" onClick={() => applyFormat("left")}>
                        <AlignLeft className="h-4 w-4" />
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>Aligner à gauche</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ToggleGroupItem value="center" onClick={() => applyFormat("center")}>
                        <AlignCenter className="h-4 w-4" />
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>Centrer</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ToggleGroupItem value="right" onClick={() => applyFormat("right")}>
                        <AlignRight className="h-4 w-4" />
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>Aligner à droite</TooltipContent>
                  </Tooltip>
                </ToggleGroup>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* Autres formats */}
              <div className="flex items-center mr-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applyFormat("quote")}
                      className="h-8 w-8 p-0"
                    >
                      <Quote className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Citation</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applyFormat("code")}
                      className="h-8 w-8 p-0"
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Code</TooltipContent>
                </Tooltip>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* Liens et images */}
              <div className="flex items-center mr-2">
                <Popover>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={!selection || selection.start === selection.end}
                        >
                          <Link className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Insérer un lien</TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Insérer un lien</h4>
                      <div className="space-y-2">
                        <Label htmlFor="link-url">URL</Label>
                        <Input
                          id="link-url"
                          placeholder="https://exemple.com"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setLinkUrl("")}>
                          <X className="h-4 w-4 mr-1" /> Annuler
                        </Button>
                        <Button type="button" size="sm" onClick={insertLink} disabled={!linkUrl}>
                          <Check className="h-4 w-4 mr-1" /> Insérer
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Insérer une image</TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Insérer une image</h4>
                      <div className="space-y-2">
                        <Label htmlFor="image-url">URL de l'image</Label>
                        <Input
                          id="image-url"
                          placeholder="https://exemple.com/image.jpg"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image-alt">Texte alternatif</Label>
                        <Input
                          id="image-alt"
                          placeholder="Description de l'image"
                          value={imageAlt}
                          onChange={(e) => setImageAlt(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setImageUrl("")
                            setImageAlt("")
                          }}
                        >
                          <X className="h-4 w-4 mr-1" /> Annuler
                        </Button>
                        <Button type="button" size="sm" onClick={insertImage} disabled={!imageUrl}>
                          <Check className="h-4 w-4 mr-1" /> Insérer
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* Couleurs */}
              <div className="flex items-center">
                <Popover>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={!selection || selection.start === selection.end}
                        >
                          <Palette className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Couleur du texte</TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-64">
                    <div className="space-y-4">
                      <h4 className="font-medium">Couleur du texte</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-10 h-10 p-1"
                          />
                          <Input
                            type="text"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                        <div className="grid grid-cols-8 gap-1">
                          {[
                            "#000000",
                            "#FF0000",
                            "#00FF00",
                            "#0000FF",
                            "#FFFF00",
                            "#FF00FF",
                            "#00FFFF",
                            "#FFFFFF",
                            "#FF5733",
                            "#33FF57",
                            "#3357FF",
                            "#F3FF33",
                            "#FF33F3",
                            "#33FFF3",
                            "#888888",
                            "#CCCCCC",
                          ].map((color) => (
                            <button
                              key={color}
                              type="button"
                              className="w-6 h-6 rounded-md border border-gray-300 cursor-pointer"
                              style={{ backgroundColor: color }}
                              onClick={() => setTextColor(color)}
                              aria-label={`Couleur ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                      <Button type="button" size="sm" onClick={applyTextColor} className="w-full">
                        Appliquer
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={!selection || selection.start === selection.end}
                        >
                          <Highlighter className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Surlignage</TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-64">
                    <div className="space-y-4">
                      <h4 className="font-medium">Couleur de surlignage</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={bgColor || "#FFFF00"}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="w-10 h-10 p-1"
                          />
                          <Input
                            type="text"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="flex-1"
                            placeholder="#FFFF00"
                          />
                        </div>
                        <div className="grid grid-cols-8 gap-1">
                          {[
                            "#FFFF00",
                            "#FF9900",
                            "#FF99CC",
                            "#99FF99",
                            "#99CCFF",
                            "#CC99FF",
                            "#FFFFFF",
                            "#FFCCCC",
                            "#CCFFCC",
                            "#CCCCFF",
                            "#FFFFCC",
                            "#FFCCFF",
                            "#CCFFFF",
                            "#EEEEEE",
                            "#DDDDDD",
                            "#CCCCCC",
                          ].map((color) => (
                            <button
                              key={color}
                              type="button"
                              className="w-6 h-6 rounded-md border border-gray-300 cursor-pointer"
                              style={{ backgroundColor: color }}
                              onClick={() => setBgColor(color)}
                              aria-label={`Surlignage ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                      <Button type="button" size="sm" onClick={applyBgColor} className="w-full">
                        Appliquer
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </TooltipProvider>

          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onSelect={handleSelect}
            onClick={handleSelect}
            onKeyUp={handleSelect}
            placeholder={placeholder}
            className={`border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-y`}
            style={{ minHeight, maxHeight }}
          />
        </TabsContent>

        <TabsContent value="preview" className="p-4 prose prose-sm max-w-none dark:prose-invert">
          {value ? (
            <div dangerouslySetInnerHTML={renderHtml()} className="rich-text-preview" />
          ) : (
            <p className="text-muted-foreground italic">Aucun contenu à afficher</p>
          )}
        </TabsContent>
      </Tabs>

      <style >{`
        .rich-text-preview h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        
        .rich-text-preview h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        
        .rich-text-preview h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        
        .rich-text-preview ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .rich-text-preview ol {
          list-style-type: decimal;
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .rich-text-preview li {
          margin-bottom: 0.25rem;
        }
        
        .rich-text-preview blockquote {
          border-left: 3px solid #e2e8f0;
          padding-left: 1rem;
          font-style: italic;
          margin: 1rem 0;
          color: #64748b;
        }
        
        .rich-text-preview code {
          background-color: #f1f5f9;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875em;
          color: #ef4444;
        }
        
        .rich-text-preview a {
          color: #3b82f6;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        .rich-text-preview img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  )
}

