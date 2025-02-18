"use client"

import Layout from "@/components/admin/layout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"
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
  })
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCourseData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setCourseData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (Object.values(courseData).some((value) => value.trim() === "")) {
      setError("Veuillez remplir tous les champs.")
      return
    }

    // Here you would typically send this data to your backend
    console.log("Course data submitted:", courseData)

    // Redirect to the courses page after submission
    router.push("/learn")
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Ajouter un nouveau cours</h1>
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Détails du cours</CardTitle>
              <CardDescription>Remplissez les informations pour créer un nouveau cours.</CardDescription>
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
                  required
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Niveau</Label>
                  <Select onValueChange={(value) => handleSelectChange("level", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debutant">Débutant</SelectItem>
                      <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                      <SelectItem value="avance">Avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select onValueChange={(value) => handleSelectChange("category", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reseaux">Réseaux</SelectItem>
                      <SelectItem value="web">Web</SelectItem>
                      <SelectItem value="exploitation">Exploitation</SelectItem>
                      <SelectItem value="forensic">Forensic</SelectItem>
                      <SelectItem value="cryptographie">Cryptographie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée estimée</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={courseData.duration}
                  onChange={handleInputChange}
                  placeholder="Ex: 2h30"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prerequisites">Prérequis</Label>
                <Input
                  id="prerequisites"
                  name="prerequisites"
                  value={courseData.prerequisites}
                  onChange={handleInputChange}
                  placeholder="Ex: Connaissances de base en Linux"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Ajouter le cours
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  )
}

