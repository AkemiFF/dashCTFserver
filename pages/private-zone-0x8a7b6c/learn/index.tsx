import { CourseCard } from "@/components/admin/course-card"
import Layout from "@/components/admin/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Course } from "@/types/course"
import { BookOpen, PlusCircle } from "lucide-react"
import Link from "next/link"

const courses: Course[] = [
  {
    id: "1",
    title: "Introduction à la Cybersécurité",
    description: "Un cours complet pour débutants en cybersécurité",
    level: "Débutant",
    duration: "4 semaines",
    modules: [
      { id: "m1", title: "Les bases de la sécurité informatique", content: [] },
      { id: "m2", title: "Comprendre les menaces courantes", content: [] },
      // Add more modules
    ],
    quiz: { id: "q1", questions: [] }, // Quiz details would be populated here
  },
  {
    id: "2",
    title: "Sécurité des Applications Web",
    description: "Apprenez à sécuriser vos applications web",
    level: "Intermédiaire",
    duration: "6 semaines",
    modules: [
      { id: "m1", title: "Vulnérabilités OWASP Top 10", content: [] },
      { id: "m2", title: "Sécurisation des API", content: [] },
      // Add more modules
    ],
    quiz: { id: "q2", questions: [] },
  },
  // Add more courses as needed
]

export default function LearnPage() {
  return (
    <Layout>
      <div className="space-y-6 max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Apprentissage</h1>
          <div className="space-x-4">
            <Link href="/learn/add-course">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un cours
              </Button>
            </Link>
            <Link href="/learn/add-module">
              <Button variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Ajouter un module
              </Button>
            </Link>
          </div>
        </div>
        <Card className="bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Cours disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="beginner">Débutant</TabsTrigger>
                <TabsTrigger value="intermediate">Intermédiaire</TabsTrigger>
                <TabsTrigger value="advanced">Avancé</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </TabsContent>
              {/* Add similar TabsContent for other levels */}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

