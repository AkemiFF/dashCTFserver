"use client"

import type React from "react"

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
  | { type: "image"; file: File | null; position: "left" | "center" | "right" }
  | { type: "video"; url: string; file: File | null; platform: "youtube" | "vimeo" | "local" | "upload" }
  | { type: "file"; file: File | null; description: string }
  | { type: "link"; url: string; description: string }

export default function AddModulePage() {
  const router = useRouter()
  const [moduleData, setModuleData] = useState({
    courseId: "",
    title: "",
    duration: "",
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

  // Le problème est probablement lié à la façon dont nous gérons les types dans la fonction addContentItem.
  // Remplaçons la fonction addContentItem par cette version corrigée :

  const addContentItem = (type: ContentItem["type"]) => {
    let newItem: ContentItem

    switch (type) {
      case "text":
        newItem = { type: "text", content: "" }
        break
      case "image":
        newItem = { type: "image", file: null, position: "center" }
        break
      case "video":
        newItem = { type: "video", url: "", file: null, platform: "upload" }
        break
      case "file":
        newItem = { type: "file", file: null, description: "" }
        break
      case "link":
        newItem = { type: "link", url: "", description: "" }
        break
      default:
        newItem = { type: "text", content: "" }
    }

    // Utilisons une fonction de mise à jour d'état plus explicite
    setModuleData((prevState) => {
      console.log("Adding content item:", newItem)
      return {
        ...prevState,
        content: [...prevState.content, newItem],
      }
    })
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

    // Redirect to the modules page after submission
    router.push("/admin/modules")
  }

  // This would typically come from your API or state management
  const mockCourses = [
    { id: "1", title: "Introduction à la Cybersécurité" },
    { id: "2", title: "Sécurité des Applications Web" },
    { id: "3", title: "Cryptographie Avancée" },
    { id: "4", title: "Ethical Hacking" },
    { id: "5", title: "Forensic Numérique" },
    { id: "6", title: "Sécurité des Réseaux" },
  ]

  // Ajoutons également un console.log dans le rendu pour déboguer
  // Ajoutez ceci juste avant le return dans le composant principal:

  console.log("Current module data:", moduleData)

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
          Ajouter un nouveau module
        </h1>
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-2xl">Détails du module</CardTitle>
              <CardDescription className="text-white/70">
                Créez un nouveau module de cours avec du contenu riche et varié.
              </CardDescription>
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
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Sélectionnez un cours" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-900 border-white/10 text-white">
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
                  <Input
                    id="title"
                    name="title"
                    value={moduleData.title}
                    onChange={handleInputChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Durée du module</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={moduleData.duration}
                  onChange={handleInputChange}
                  placeholder="Ex: 1h 30min"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>Contenu du module</Label>
                <div className="space-y-4">
                  {moduleData.content.map((item, index) => (
                    <Card
                      key={index}
                      className="relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
                    >
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
                              className="bg-white/5 border-white/10 text-white"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null
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
                              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Position de l'image" />
                              </SelectTrigger>
                              <SelectContent className="bg-navy-900 border-white/10 text-white">
                                <SelectItem value="left">Gauche</SelectItem>
                                <SelectItem value="center">Centre</SelectItem>
                                <SelectItem value="right">Droite</SelectItem>
                              </SelectContent>
                            </Select>
                            {item.file && (
                              <div className="mt-2 max-w-xs mx-auto">
                                <img
                                  src={URL.createObjectURL(item.file) || "/placeholder.svg"}
                                  alt="Preview"
                                  className="rounded-md max-h-40 object-contain"
                                />
                              </div>
                            )}
                          </div>
                        )}
                        {item.type === "video" && (
                          <div className="space-y-2">
                            <Select
                              value={item.platform}
                              onValueChange={(value) =>
                                updateContentItem(index, {
                                  ...item,
                                  platform: value as "youtube" | "vimeo" | "local" | "upload",
                                })
                              }
                            >
                              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Type de vidéo" />
                              </SelectTrigger>
                              <SelectContent className="bg-navy-900 border-white/10 text-white">
                                <SelectItem value="youtube">YouTube</SelectItem>
                                <SelectItem value="vimeo">Vimeo</SelectItem>
                                <SelectItem value="local">Locale</SelectItem>
                                <SelectItem value="upload">Télécharger</SelectItem>
                              </SelectContent>
                            </Select>

                            {item.platform === "upload" ? (
                              <div className="space-y-2">
                                <Input
                                  type="file"
                                  accept="video/*"
                                  className="bg-white/5 border-white/10 text-white"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null
                                    if (file) {
                                      updateContentItem(index, { ...item, file })
                                    }
                                  }}
                                />
                                {item.file && (
                                  <div className="mt-2 aspect-video bg-black/20 rounded-md flex items-center justify-center">
                                    <video
                                      controls
                                      className="rounded-md max-h-[300px] max-w-full"
                                      src={URL.createObjectURL(item.file)}
                                    >
                                      Votre navigateur ne supporte pas la lecture de vidéos.
                                    </video>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Input
                                  placeholder="URL de la vidéo"
                                  value={item.url}
                                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                                  onChange={(e) => updateContentItem(index, { ...item, url: e.target.value })}
                                />
                                {item.url && item.platform === "youtube" && (
                                  <div className="mt-2 aspect-video bg-black/20 rounded-md flex items-center justify-center">
                                    <iframe
                                      width="100%"
                                      height="100%"
                                      src={`https://www.youtube.com/embed/${item.url.split("v=")[1]?.split("&")[0] || item.url}`}
                                      title="YouTube video player"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      className="rounded-md aspect-video"
                                    ></iframe>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {item.type === "file" && (
                          <div className="space-y-2">
                            <Input
                              type="file"
                              className="bg-white/5 border-white/10 text-white"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null
                                if (file) {
                                  updateContentItem(index, { ...item, file })
                                }
                              }}
                            />
                            <Input
                              placeholder="Description du fichier"
                              value={item.description}
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                              onChange={(e) => updateContentItem(index, { ...item, description: e.target.value })}
                            />
                            {item.file && (
                              <div className="mt-2 p-3 bg-white/5 rounded-md flex items-center gap-2">
                                <FileText className="h-5 w-5 text-white/70" />
                                <div>
                                  <p className="text-sm font-medium">{item.file.name}</p>
                                  <p className="text-xs text-white/70">{(item.file.size / 1024).toFixed(2)} KB</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        {item.type === "link" && (
                          <div className="space-y-2">
                            <Input
                              placeholder="URL du lien"
                              value={item.url}
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                              onChange={(e) => updateContentItem(index, { ...item, url: e.target.value })}
                            />
                            <Input
                              placeholder="Description du lien"
                              value={item.description}
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                              onChange={(e) => updateContentItem(index, { ...item, description: e.target.value })}
                            />
                            {item.url && (
                              <div className="mt-2 p-3 bg-white/5 rounded-md flex items-center gap-2">
                                <Link className="h-5 w-5 text-white/70" />
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-400 hover:underline"
                                >
                                  {item.description || item.url}
                                </a>
                              </div>
                            )}
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
                          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => moveContentItem(index, "down")}
                          disabled={index === moduleData.content.length - 1}
                          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeContentItem(index)}
                          className="h-8 w-8 text-white/70 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentItem("text")}
                    className="border-white/10 text-white hover:bg-white/10"
                  >
                    <Type className="mr-2 h-4 w-4" /> Texte
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentItem("image")}
                    className="border-white/10 text-white hover:bg-white/10"
                  >
                    <Image className="mr-2 h-4 w-4" /> Image
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentItem("video")}
                    className="border-white/10 text-white hover:bg-white/10"
                  >
                    <Video className="mr-2 h-4 w-4" /> Vidéo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentItem("file")}
                    className="border-white/10 text-white hover:bg-white/10"
                  >
                    <FileText className="mr-2 h-4 w-4" /> Fichier
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentItem("link")}
                    className="border-white/10 text-white hover:bg-white/10"
                  >
                    <Link className="mr-2 h-4 w-4" /> Lien
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Ajouter le module
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  )
}

