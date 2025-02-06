"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Layout from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { Course } from "@/types/course"

// This would typically come from an API call
const mockFetchCourse = async (id: string): Promise<Course> => {
  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    id,
    title: "Introduction à la Cybersécurité",
    description: "Un cours complet pour débutants en cybersécurité",
    level: "Débutant",
    duration: "4 semaines",
    modules: [
      {
        id: "m1",
        title: "Les bases de la sécurité informatique",
        content: [
          { type: "text", content: "La cybersécurité est un domaine crucial dans notre ère numérique..." },
          { type: "image", content: "/images/cybersecurity-basics.jpg", position: "center" },
        ],
      },
      {
        id: "m2",
        title: "Comprendre les menaces courantes",
        content: [
          { type: "text", content: "Il existe de nombreuses menaces dans le monde numérique, notamment..." },
          { type: "video", content: "/videos/common-threats.mp4", position: "left" },
        ],
      },
    ],
    quiz: {
      id: "q1",
      questions: [
        {
          id: "q1_1",
          question:
            "Quel est le principe de base de la cybersécurité qui garantit que les données ne sont accessibles qu'aux personnes autorisées ?",
          options: ["Intégrité", "Disponibilité", "Confidentialité", "Authenticité"],
          correctAnswer: 2,
        },
        {
          id: "q1_2",
          question:
            "Quelle technique est utilisée par les attaquants pour tromper les utilisateurs et les inciter à révéler des informations sensibles ?",
          options: ["Malware", "Phishing", "Cryptage", "Pare-feu"],
          correctAnswer: 1,
        },
      ],
    },
  }
}

export default function CourseDetailsPage() {
  const params = useParams()
  const courseId = params.id as string
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const fetchedCourse = await mockFetchCourse(courseId)
        setCourse(fetchedCourse)
      } catch (error) {
        console.error("Error fetching course:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  const handleSave = () => {
    // Here you would typically send the updated course data to your backend
    console.log("Saving course:", course)
    alert("Cours sauvegardé avec succès!")
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">Chargement...</div>
      </Layout>
    )
  }

  if (!course) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">Cours non trouvé</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Détails du cours</h1>
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre du cours</Label>
                <Input
                  id="title"
                  value={course.title}
                  onChange={(e) => setCourse({ ...course, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={course.description}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="level">Niveau</Label>
                <Input
                  id="level"
                  value={course.level}
                  onChange={(e) => setCourse({ ...course, level: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="duration">Durée</Label>
                <Input
                  id="duration"
                  value={course.duration}
                  onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Modules</CardTitle>
          </CardHeader>
          <CardContent>
            {course.modules.map((module, index) => (
              <div key={module.id} className="mb-4 p-4 border rounded">
                <h3 className="text-lg font-semibold mb-2">
                  Module {index + 1}: {module.title}
                </h3>
                <Button variant="outline" className="mb-2">
                  Éditer le contenu
                </Button>
                <Button variant="outline" className="ml-2 mb-2">
                  Supprimer le module
                </Button>
              </div>
            ))}
            <Button>Ajouter un nouveau module</Button>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{course.quiz.questions.length} questions</p>
            <Button variant="outline" className="mt-2">
              Éditer le quiz
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave}>Sauvegarder les modifications</Button>
        </div>
      </div>
    </Layout>
  )
}

