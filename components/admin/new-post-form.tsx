"use client"

import { EmojiPicker } from "@/components/admin/emoji-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { FileImage } from "lucide-react"
import { useRef, useState } from "react"
import ReactMarkdown from "react-markdown"

interface NewPostFormProps {
  onSubmit: (post: { author: string; content: string; timestamp: string; image?: string }) => void
}

export function NewPostForm({ onSubmit }: NewPostFormProps) {
  const [content, setContent] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit({
        author: "Admin",
        content,
        timestamp: new Date().toISOString(),
        image: image || undefined,
      })
      setContent("")
      setImage(null)
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setContent((prevContent) => prevContent + emoji)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="write" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="write">Écrire</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
        </TabsList>
        <TabsContent value="write">
          <Textarea
            placeholder="Que voulez-vous partager ? (Markdown supporté)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px]"
          />
        </TabsContent>
        <TabsContent value="preview">
          <Card>
            <CardContent className="pt-6">
              <ReactMarkdown>{content}</ReactMarkdown>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="flex items-center space-x-2">
        <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
          <FileImage className="h-4 w-4" />
        </Button>
        <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={fileInputRef} />
        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        <Button type="submit">Publier</Button>
      </div>
      {image && (
        <div className="mt-4">
          <Label>Image téléchargée :</Label>
          <img src={image || "/placeholder.svg"} alt="Uploaded" className="mt-2 max-w-full h-auto rounded-lg" />
        </div>
      )}
    </form>
  )
}

