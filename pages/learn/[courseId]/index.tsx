"use client"

import { CourseModule } from "@/components/course-module"
import Layout from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Course } from "@/types/course"
import { useParams } from "next/navigation"
import { useState } from "react"

// This would typically come from an API call
const mockCourse: Course = {
  id: "1",
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
        {
          type: "text",
          content: "Les principes fondamentaux incluent la confidentialité, l'intégrité et la disponibilité...",
        },
      ],
    },
    {
      id: "m2",
      title: "Comprendre les menaces courantes",
      content: [
        { type: "text", content: "Il existe de nombreuses menaces dans le monde numérique, notamment..." },
        { type: "video", content: "/videos/common-threats.mp4", position: "left" },
        {
          type: "text",
          content:
            "Parmi les menaces les plus courantes, on trouve les malwares, le phishing, et les attaques par déni de service...",
        },
      ],
    },
    // Add more modules as needed
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
      // Add more questions as needed
    ],
  },
}

export default function CoursePage() {
  const params = useParams()
  // const courseId = params.courseId as string
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])

  // In a real application, you would fetch the course data based on the courseId
  const course = mockCourse

  const handleNextModule = () => {
    if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1)
    } else {
      setShowQuiz(true)
    }
  }

  const handlePreviousModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1)
    }
  }

  const handleQuizSubmit = () => {
    // Here you would typically send the answers to your backend for validation
    console.log("Quiz submitted with answers:", quizAnswers)
    // For now, we'll just show an alert
    alert("Quiz submitted successfully!")
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-muted-foreground mb-6">{course.description}</p>
        <div className="mb-6">
          <Progress value={((currentModuleIndex + 1) / course.modules.length) * 100} className="w-full" />
        </div>
        {!showQuiz ? (
          <>
            <CourseModule module={course.modules[currentModuleIndex]} />
            <div className="flex justify-between mt-6">
              <Button onClick={handlePreviousModule} disabled={currentModuleIndex === 0}>
                Module précédent
              </Button>
              <Button onClick={handleNextModule}>
                {currentModuleIndex < course.modules.length - 1 ? "Module suivant" : "Passer au quiz"}
              </Button>
            </div>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Quiz de validation</CardTitle>
              <CardDescription>Répondez aux questions suivantes pour valider vos connaissances.</CardDescription>
            </CardHeader>
            <CardContent>
              {course.quiz.questions.map((question, index) => (
                <div key={question.id} className="mb-6">
                  <h3 className="font-semibold mb-2">{question.question}</h3>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={`q${index}_${optionIndex}`}
                        name={`question_${index}`}
                        value={optionIndex}
                        checked={quizAnswers[index] === optionIndex}
                        onChange={() => {
                          const newAnswers = [...quizAnswers]
                          newAnswers[index] = optionIndex
                          setQuizAnswers(newAnswers)
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`q${index}_${optionIndex}`}>{option}</label>
                    </div>
                  ))}
                </div>
              ))}
              <Button onClick={handleQuizSubmit} className="mt-4">
                Soumettre le quiz
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}

