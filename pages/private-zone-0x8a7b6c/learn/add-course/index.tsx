"use client"

import type React from "react"

import Layout from "@/components/admin/layout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AddCoursePage() {
  const router = useRouter()
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    level: "",
    category: "",
    duration: "",
    prerequisites: "",
    instructor: "",
    image: null as File | null,
    tags: [] as string[],
  })
  const [error, setError] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCourseData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setCourseData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setCourseData((prev) => ({ ...prev, image: file }))
  }

  const addTag = () => {
    if (tagInput.trim() && !courseData.tags.includes(tagInput.trim())) {
      setCourseData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setCourseData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!courseData.title || !courseData.description || !courseData.level || !courseData.category) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }

    // Here you would typically send this data to your backend
    console.log("Course data submitted:", courseData)

    // Redirect to the courses page after submission
    router.push("/admin/courses")
  }

  // Map French level names to English for compatibility with the courses page
  const levelMapping: Record<string, string> = {
    debutant: "Beginner",
    intermediaire: "Intermediate",
    avance: "Advanced",
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
          Ajouter un nouveau cours
        </h1>
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Détails du cours</CardTitle>
              <CardDescription className="text-white/70">
                Remplissez les informations pour créer un nouveau cours.
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
              <div className="space-y-2">
                <Label htmlFor="title">Titre du cours</Label>
                <Input
                  id="title"
                  name="title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: Introduction aux réseaux sécurisés"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  placeholder="Résumé du contenu du cours"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  required
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Niveau</Label>
                  <Select onValueChange={(value) => handleSelectChange("level", value)} required>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Sélectionnez un niveau" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-900 border-white/10 text-white">
                      <SelectItem value="debutant">Débutant</SelectItem>
                      <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                      <SelectItem value="avance">Avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select onValueChange={(value) => handleSelectChange("category", value)} required>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-900 border-white/10 text-white">
                      <SelectItem value="reseaux">Réseaux</SelectItem>
                      <SelectItem value="web">Web</SelectItem>
                      <SelectItem value="exploitation">Exploitation</SelectItem>
                      <SelectItem value="forensic">Forensic</SelectItem>
                      <SelectItem value="cryptographie">Cryptographie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée estimée</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={courseData.duration}
                    onChange={handleInputChange}
                    placeholder="Ex: 8 weeks"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructeur</Label>
                  <Input
                    id="instructor"
                    name="instructor"
                    value={courseData.instructor}
                    onChange={handleInputChange}
                    placeholder="Ex: Dr. Sophie Martin"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prerequisites">Prérequis</Label>
                <Input
                  id="prerequisites"
                  name="prerequisites"
                  value={courseData.prerequisites}
                  onChange={handleInputChange}
                  placeholder="Ex: Connaissances de base en Linux"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image du cours</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  {courseData.image && (
                    <div className="h-10 w-10 rounded overflow-hidden bg-white/5">
                      <img
                        src={URL.createObjectURL(courseData.image) || "/placeholder.svg"}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Ex: Cybersecurity"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/10"
                  >
                    Ajouter
                  </Button>
                </div>
                {courseData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {courseData.tags.map((tag) => (
                      <div
                        key={tag}
                        className="bg-white/10 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-white/70 hover:text-white">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Upload className="mr-2 h-4 w-4" />
                Ajouter le cours
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  )
}

