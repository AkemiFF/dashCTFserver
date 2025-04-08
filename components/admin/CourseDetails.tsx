import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Course } from "@/services/types/course"
import Link from "next/link"

interface CourseDetailsProps {
  course: Course
}

export default function CourseDetails({ course }: CourseDetailsProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Détails du cours</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{course.description}</p>
          <div className="flex items-center space-x-4 mb-4">
            <Badge>{course.level}</Badge>
            <span>{course.duration}</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Modules</h2>
          <ul className="list-disc pl-5 mb-4">
            {course.modules.map((module) => (
              <li key={module.id}>{module.title}</li>
            ))}
          </ul>
          <h2 className="text-xl font-semibold mb-2">Quiz</h2>
          <p>{course.quiz.questions.length} questions</p>
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Link href="/learn">
          <Button variant="outline">Retour aux cours</Button>
        </Link>
        <Button>Commencer le cours</Button>
      </div>
    </div>
  )
}

