"use client"

import Layout from "@/components/admin/layout"
import { ModuleCard } from "@/components/admin/module-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseApiService } from "@/services/course-api-service"
import { AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface ModuleWithQuiz {
    id: string
    title: string
    courseId?: string
    courseName?: string
    questionCount: number
    duration: string
}

export default function ModuleListPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [modules, setModules] = useState<ModuleWithQuiz[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [courseFilter, setCourseFilter] = useState<string>("all")
    const [courses, setCourses] = useState<{ id: string; title: string }[]>([])
    const [activeTab, setActiveTab] = useState<string>("all")

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                // Fetch courses
                const coursesData = await CourseApiService.getAllCoursesAdmin()
                setCourses(coursesData.map((course) => ({ id: course.id, title: course.title })))

                // Fetch all modules
                const modulesData = await CourseApiService.getAllModules()

                // Transform modules data to include quiz question count
                const modulesWithQuiz: ModuleWithQuiz[] = modulesData.map((module: any) => {
                    // Find the course this module belongs to
                    const course = coursesData.find((c) => c.modules?.some((m: any) => m.id.toString() === module.id.toString()))

                    return {
                        id: module.id.toString(),
                        title: module.title,
                        courseId: course?.id,
                        courseName: course?.title,
                        questionCount: module.quiz_questions?.length || 0,
                        duration: module.duration || "N/A",
                    }
                })

                setModules(modulesWithQuiz)
            } catch (err) {
                console.error("Error fetching data:", err)
                setError("Une erreur est survenue lors du chargement des modules. Veuillez réessayer.")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const filteredModules = modules.filter((module) => {
        const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCourse = courseFilter === "all" || module.courseId === courseFilter
        const matchesTab =
            activeTab === "all" ||
            (activeTab === "with-quiz" && module.questionCount > 0) ||
            (activeTab === "without-quiz" && module.questionCount === 0)

        return matchesSearch && matchesCourse && matchesTab
    })

    const modulesWithQuiz = modules.filter((m) => m.questionCount > 0).length
    const modulesWithoutQuiz = modules.filter((m) => m.questionCount === 0).length

    return (
        <Layout>
            <div className="space-y-6 max-w-[1200px] mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Gestion des Quiz</h1>
                    {/* <Link href={ADMIN_NAME + "/quiz/create"}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Créer un nouveau quiz
                        </Button>
                    </Link> */}
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        <TabsList>
                            <TabsTrigger value="all">Tous les modules ({modules.length})</TabsTrigger>
                            <TabsTrigger value="with-quiz">Avec quiz ({modulesWithQuiz})</TabsTrigger>
                            <TabsTrigger value="without-quiz">Sans quiz ({modulesWithoutQuiz})</TabsTrigger>
                        </TabsList>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                                placeholder="Rechercher un module..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-[200px]"
                            />

                            <Select value={courseFilter} onValueChange={setCourseFilter}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Filtrer par cours" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les cours</SelectItem>
                                    {courses.map((course) => (
                                        <SelectItem key={course.id} value={course.id}>
                                            {course.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <TabsContent value="all" className="mt-0">
                        {renderModuleGrid()}
                    </TabsContent>

                    <TabsContent value="with-quiz" className="mt-0">
                        {renderModuleGrid()}
                    </TabsContent>

                    <TabsContent value="without-quiz" className="mt-0">
                        {renderModuleGrid()}
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    )

    function renderModuleGrid() {
        if (loading) {
            return (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-[180px] w-full rounded-lg" />
                        </div>
                    ))}
                </div>
            )
        }

        if (filteredModules.length === 0) {
            return (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Aucun module trouvé.</p>
                    {modules.length > 0 && <p className="mt-2">Essayez de modifier vos critères de recherche.</p>}
                </div>
            )
        }

        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredModules.map((module) => (
                    <ModuleCard
                        key={module.id}
                        module={{
                            id: module.id,
                            title: module.title,
                            courseName: module.courseName,
                            questionCount: module.questionCount,
                            duration: module.duration,
                        }}
                    />
                ))}
            </div>
        )
    }
}

