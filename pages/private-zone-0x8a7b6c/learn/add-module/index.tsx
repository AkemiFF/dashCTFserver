"use client"

import Layout from "@/components/admin/layout"
import { RichTextEditor } from "@/components/admin/RichTextEditor"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowDown, ArrowUp, FileText, Image, Link, Plus, Trash2, Type, Video } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

type ContentItem =
  | { type: "text"; content: string }
  | { type: "image"; file: File; position: "left" | "center" | "right" }
  | { type: "video"; url: string; platform: "youtube" | "vimeo" | "local" }
  | { type: "file"; file: File; description: string }
  | { type: "link"; url: string; description: string }

export default function AddModulePage() {
  const router = useRouter()
  const [moduleData, setModuleData] = useState({
    courseId: "",
    title: "",
    content: [] as ContentItem[],
  })
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setModuleData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setModuleData((prev) => ({ ...prev, [name]: value }))
  }

  const addContentItem = (type: ContentItem["type"]) => {
    let newItem: ContentItem
    switch (type) {
      case "text":
        newItem = { type: "text", content: "" }
        break
      case "image":
        newItem = { type: "image", file: new File([], ""), position: "center" }
        break
      case "video":
        newItem = { type: "video", url: "", platform: "youtube" }
        break
      case "file":
        newItem = { type: "file", file: new File([], ""), description: "" }
        break
      case "link":
        newItem = { type: "link", url: "", description: "" }
        break
    }
    setModuleData((prev) => ({
      ...prev,
      content: [...prev.content, newItem],
    }))
  }

  const updateContentItem = (index: number, updatedItem: ContentItem) => {
    setModuleData((prev) => ({
      ...prev,
      content: prev.content.map((item, i) => (i === index ? updatedItem : item)),
    }))
  }

  const moveContentItem = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === moduleData.content.length - 1)) {
      return
    }
    const newIndex = direction === "up" ? index - 1 : index + 1
    const newContent = [...moduleData.content]
      ;[newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]]
    setModuleData((prev) => ({ ...prev, content: newContent }))
  }

  const removeContentItem = (index: number) => {
    setModuleData((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!moduleData.courseId || !moduleData.title || moduleData.content.length === 0) {
      setError("Veuillez remplir tous les champs obligatoires et ajouter du contenu.")
      return
    }

    // Here you would typically send this data to your backend
    console.log("Module data submitted:", moduleData)

    // Redirect to the courses page after submission
    router.push("/learn")
  }

  // This would typically come from your API or state management
  const mockCourses = [
    { id: "1", title: "Introduction à la Cybersécurité" },
    { id: "2", title: "Sécurité des Applications Web" },
    { id: "3", title: "Cryptographie Avancée" },
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Ajouter un nouveau module</h1>
        <Card className="transition-all duration-300 hover:shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-2xl">Détails du module</CardTitle>
              <CardDescription>Créez un nouveau module de cours avec du contenu riche et varié.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="courseId">Cours</Label>
                  <Select onValueChange={(value) => handleSelectChange("courseId", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un cours" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du module</Label>
                  <Input id="title" name="title" value={moduleData.title} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="space-y-4">
                <Label>Contenu du module</Label>
                <div className="space-y-4">
                  {moduleData.content.map((item, index) => (
                    <Card key={index} className="relative overflow-hidden transition-all duration-300 hover:shadow-md">
                      <CardContent className="pt-6">
                        {item.type === "text" && (
                          <RichTextEditor
                            value={item.content}
                            onChange={(value) => updateContentItem(index, { ...item, content: value })}
                          />
                        )}
                        {item.type === "image" && (
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  updateContentItem(index, { ...item, file })
                                }
                              }}
                            />
                            <Select
                              value={item.position}
                              onValueChange={(value) =>
                                updateContentItem(index, { ...item, position: value as "left" | "center" | "right" })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Position de l'image" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="left">Gauche</SelectItem>
                                <SelectItem value="center">Centre</SelectItem>
                                <SelectItem value="right">Droite</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        {item.type === "video" && (
                          <div className="space-y-2">
                            <Input
                              placeholder="URL de la vidéo"
                              value={item.url}
                              onChange={(e) => updateContentItem(index, { ...item, url: e.target.value })}
                            />
                            <Select
                              value={item.platform}
                              onValueChange={(value) =>
                                updateContentItem(index, { ...item, platform: value as "youtube" | "vimeo" | "local" })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Plateforme vidéo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="youtube">YouTube</SelectItem>
                                <SelectItem value="vimeo">Vimeo</SelectItem>
                                <SelectItem value="local">Locale</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        {item.type === "file" && (
                          <div className="space-y-2">
                            <Input
                              type="file"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  updateContentItem(index, { ...item, file })
                                }
                              }}
                            />
                            <Input
                              placeholder="Description du fichier"
                              value={item.description}
                              onChange={(e) => updateContentItem(index, { ...item, description: e.target.value })}
                            />
                          </div>
                        )}
                        {item.type === "link" && (
                          <div className="space-y-2">
                            <Input
                              placeholder="URL du lien"
                              value={item.url}
                              onChange={(e) => updateContentItem(index, { ...item, url: e.target.value })}
                            />
                            <Input
                              placeholder="Description du lien"
                              value={item.description}
                              onChange={(e) => updateContentItem(index, { ...item, description: e.target.value })}
                            />
                          </div>
                        )}
                      </CardContent>
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => moveContentItem(index, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => moveContentItem(index, "down")}
                          disabled={index === moduleData.content.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button type="button" size="icon" variant="ghost" onClick={() => removeContentItem(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button type="button" variant="outline" onClick={() => addContentItem("text")}>
                    <Type className="mr-2 h-4 w-4" /> Texte
                  </Button>
                  <Button type="button" variant="outline" onClick={() => addContentItem("image")}>
                    <Image className="mr-2 h-4 w-4" /> Image
                  </Button>
                  <Button type="button" variant="outline" onClick={() => addContentItem("video")}>
                    <Video className="mr-2 h-4 w-4" /> Vidéo
                  </Button>
                  <Button type="button" variant="outline" onClick={() => addContentItem("file")}>
                    <FileText className="mr-2 h-4 w-4" /> Fichier
                  </Button>
                  <Button type="button" variant="outline" onClick={() => addContentItem("link")}>
                    <Link className="mr-2 h-4 w-4" /> Lien
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Ajouter le module
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  )
}

