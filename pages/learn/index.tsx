"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDebounce } from "@/hooks/use-debounce"
import type { Course } from "@/types/course"
import { motion } from "framer-motion"
import { BookOpen, Clock, Plus, Search, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
// Ajouter l'import pour ProtectedRoute
import ProtectedRoute from "@/components/protected-route"
// Ajouter l'import pour useApi
import { useApi } from "@/hooks/use-api"

// Remplacer les états et useEffect par useApi
export default function LearnPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("all")
    const debouncedSearchTerm = useDebounce(searchTerm, 300)

    // Utiliser useApi pour charger les cours
    const { results: courses = [], isLoading, isError } = useApi<Course[]>("/learn/courses")


    // Ajouter après la déclaration de useApi pour les cours
    // console.log("API Response:", { courses, isLoading, isError })

    // Utiliser useApi pour les cours filtrés en fonction de l'onglet actif
    const { results: filteredCourses = [] } = useApi<Course[]>(
        activeTab === "popular" && !debouncedSearchTerm
            ? "/learn/courses/popular"
            : activeTab === "newest" && !debouncedSearchTerm
                ? "/learn/courses/recent"
                : activeTab === "enrolled" && !debouncedSearchTerm
                    ? "/learn/user/courses"
                    : null,
        {
            fallbackData: courses,
        },
    )

    // Utiliser useApi pour la recherche
    const { results: searchResults = [] } = useApi<Course[]>(
        debouncedSearchTerm ? `/courses/search?q=${encodeURIComponent(debouncedSearchTerm)}` : null,
        {
            fallbackData: [],
        },
    )

    // Déterminer les cours à afficher
    const coursesToDisplay = debouncedSearchTerm
        ? searchResults
        : activeTab === "all" && !debouncedSearchTerm
            ? courses
            : filteredCourses

    // Filtrer les cours côté client si nécessaire
    const displayedCourses = useMemo(() => {
        if (debouncedSearchTerm) {
            return searchResults
        }

        if (activeTab === "all") {
            return courses
        }

        if (activeTab === "popular" && debouncedSearchTerm) {
            return courses
                .filter(
                    (course: { title: string; description: string; tags: any[] }) =>
                        course.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                        course.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                        course.tags.some((tag: string) => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase())),
                )
                .sort((a: { students: number }, b: { students: number }) => b.students - a.students)
        }

        if (activeTab === "newest" && debouncedSearchTerm) {
            return courses
                .filter(
                    (course: { title: string; description: string; tags: any[] }) =>
                        course.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                        course.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                        course.tags.some((tag: string) => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase())),
                )
                .sort((a: { id: any }, b: { id: string }) => b.id.localeCompare(a.id))
        }

        if (activeTab === "enrolled" && debouncedSearchTerm) {
            return courses.filter(
                (course: { progress: number; title: string; description: string; tags: any[] }) =>
                    course.progress > 0 &&
                    (course.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                        course.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                        course.tags.some((tag: string) => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))),
            )
        }

        return filteredCourses
    }, [activeTab, courses, debouncedSearchTerm, filteredCourses, searchResults])

    const handleCourseClick = (course: Course) => {
        router.push(`/learn/courses/${course.id}`)
    }

    // Fonction pour traduire le niveau
    const translateLevel = (level: string) => {
        const levels: Record<string, string> = {
            debutant: "Débutant",
            intermediaire: "Intermédiaire",
            avance: "Avancé",
        }
        return levels[level] || level
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen mt-16 bg-navy-950 text-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                                    Formations
                                </h1>
                                <p className="text-white/70 mt-1">Développez vos compétences avec nos formations complètes</p>
                            </div>

                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                                <Input
                                    placeholder="Rechercher des formations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                                />
                            </div>
                        </div>

                        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="bg-white/5 border border-white/10">
                                <TabsTrigger value="all" className="results-[state=active]:bg-white/10">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Toutes les formations
                                </TabsTrigger>
                                <TabsTrigger value="popular" className="results-[state=active]:bg-white/10">
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                    Populaires
                                </TabsTrigger>
                                <TabsTrigger value="newest" className="results-[state=active]:bg-white/10">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Récentes
                                </TabsTrigger>
                                <TabsTrigger value="enrolled" className="results-[state=active]:bg-white/10">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Mes formations
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="all" className="mt-6">
                                {/* Afficher un indicateur de chargement */}
                                {isLoading && (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                                    </div>
                                )}

                                {/* Afficher un message d'erreur */}
                                {isError && (
                                    <div className="text-center py-12">
                                        <h3 className="text-xl font-medium text-white/70">Erreur de chargement</h3>
                                        <p className="text-white/50 mt-2">
                                            Impossible de charger les cours. Veuillez vérifier la connexion à l'API.
                                        </p>
                                        <div className="mt-2 p-4 bg-white/5 rounded text-left overflow-auto max-h-40 text-xs">
                                            <pre>
                                                {JSON.stringify({ url: `${process.env.NEXT_PUBLIC_API_URL}/courses`, error: isError }, null, 2)}
                                            </pre>
                                        </div>
                                        <Button
                                            className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                                            onClick={() => window.location.reload()}
                                        >
                                            Réessayer
                                        </Button>
                                    </div>
                                )}

                                {/* Afficher les cours */}
                                {!isLoading && !isError && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {displayedCourses.map((course: Course, index: number) => (
                                            <CourseCard
                                                key={course.id}
                                                course={course}
                                                index={index}
                                                onClick={() => handleCourseClick(course)}
                                                translateLevel={translateLevel}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Afficher un message si aucun cours n'est trouvé */}
                                {!isLoading && !isError && displayedCourses.length === 0 && (
                                    <div className="text-center py-12">
                                        <h3 className="text-xl font-medium text-white/70">Aucune formation trouvée</h3>
                                        <p className="text-white/50 mt-2">Essayez d'ajuster votre recherche ou vos filtres</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="popular" className="mt-6">
                                {/* Afficher un indicateur de chargement */}
                                {isLoading && (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                                    </div>
                                )}

                                {/* Afficher un message d'erreur */}
                                {isError && (
                                    <div className="text-center py-12">
                                        <h3 className="text-xl font-medium text-white/70">Erreur de chargement</h3>
                                        <p className="text-white/50 mt-2">
                                            Impossible de charger les cours. Veuillez vérifier la connexion à l'API.
                                        </p>
                                        <div className="mt-2 p-4 bg-white/5 rounded text-left overflow-auto max-h-40 text-xs">
                                            <pre>
                                                {JSON.stringify({ url: `${process.env.NEXT_PUBLIC_API_URL}/courses`, error: isError }, null, 2)}
                                            </pre>
                                        </div>
                                        <Button
                                            className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                                            onClick={() => window.location.reload()}
                                        >
                                            Réessayer
                                        </Button>
                                    </div>
                                )}

                                {/* Afficher les cours */}
                                {!isLoading && !isError && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {displayedCourses.map((course: Course, index: number) => (
                                            <CourseCard
                                                key={course.id}
                                                course={course}
                                                index={index}
                                                onClick={() => handleCourseClick(course)}
                                                translateLevel={translateLevel}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Afficher un message si aucun cours n'est trouvé */}
                                {!isLoading && !isError && displayedCourses.length === 0 && (
                                    <div className="text-center py-12">
                                        <h3 className="text-xl font-medium text-white/70">Aucune formation trouvée</h3>
                                        <p className="text-white/50 mt-2">Essayez d'ajuster votre recherche ou vos filtres</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="newest" className="mt-6">
                                {/* Afficher un indicateur de chargement */}
                                {isLoading && (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                                    </div>
                                )}

                                {/* Afficher un message d'erreur */}
                                {isError && (
                                    <div className="text-center py-12">
                                        <h3 className="text-xl font-medium text-white/70">Erreur de chargement</h3>
                                        <p className="text-white/50 mt-2">
                                            Impossible de charger les cours. Veuillez vérifier la connexion à l'API.
                                        </p>
                                        <div className="mt-2 p-4 bg-white/5 rounded text-left overflow-auto max-h-40 text-xs">
                                            <pre>
                                                {JSON.stringify({ url: `${process.env.NEXT_PUBLIC_API_URL}/courses`, error: isError }, null, 2)}
                                            </pre>
                                        </div>
                                        <Button
                                            className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                                            onClick={() => window.location.reload()}
                                        >
                                            Réessayer
                                        </Button>
                                    </div>
                                )}

                                {/* Afficher les cours */}
                                {!isLoading && !isError && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {displayedCourses.map((course: Course, index: number) => (
                                            <CourseCard
                                                key={course.id}
                                                course={course}
                                                index={index}
                                                onClick={() => handleCourseClick(course)}
                                                translateLevel={translateLevel}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Afficher un message si aucun cours n'est trouvé */}
                                {!isLoading && !isError && displayedCourses.length === 0 && (
                                    <div className="text-center py-12">
                                        <h3 className="text-xl font-medium text-white/70">Aucune formation trouvée</h3>
                                        <p className="text-white/50 mt-2">Essayez d'ajuster votre recherche ou vos filtres</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="enrolled" className="mt-6">
                                {/* Afficher un indicateur de chargement */}
                                {isLoading && (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                                    </div>
                                )}

                                {/* Afficher un message d'erreur */}
                                {isError && (
                                    <div className="text-center py-12">
                                        <h3 className="text-xl font-medium text-white/70">Erreur de chargement</h3>
                                        <p className="text-white/50 mt-2">
                                            Impossible de charger les cours. Veuillez vérifier la connexion à l'API.
                                        </p>
                                        <div className="mt-2 p-4 bg-white/5 rounded text-left overflow-auto max-h-40 text-xs">
                                            <pre>
                                                {JSON.stringify({ url: `${process.env.NEXT_PUBLIC_API_URL}/courses`, error: isError }, null, 2)}
                                            </pre>
                                        </div>
                                        <Button
                                            className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                                            onClick={() => window.location.reload()}
                                        >
                                            Réessayer
                                        </Button>
                                    </div>
                                )}

                                {/* Afficher les cours */}
                                {!isLoading && !isError && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {displayedCourses.map((course: Course, index: number) => (
                                            <CourseCard
                                                key={course.id}
                                                course={course}
                                                index={index}
                                                onClick={() => handleCourseClick(course)}
                                                translateLevel={translateLevel}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Afficher un message si aucun cours n'est trouvé */}
                                {!isLoading && !isError && displayedCourses.length === 0 && (
                                    <div className="text-center py-12">
                                        <h3 className="text-xl font-medium text-white/70">Aucune formation trouvée</h3>
                                        <p className="text-white/50 mt-2">Essayez d'ajuster votre recherche ou vos filtres</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}

// Composant de carte de cours
function CourseCard({
    course,
    index,
    onClick,
    translateLevel,
}: {
    course: Course
    index: number
    onClick: () => void
    translateLevel: (level: string) => string
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="h-full"
        >
            <Card
                className="overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer h-full flex flex-col"
                onClick={onClick}
            >
                <div className="relative">
                    <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-48 object-cover" />
                    {course.progress > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-2">
                            <div className="flex justify-between items-center text-sm">
                                <span>Progression: {course.progress}%</span>
                                <Badge className="bg-gradient-to-r from-pink-500 to-purple-600">En cours</Badge>
                            </div>
                            <div className="w-full bg-white/20 h-1 mt-1 rounded-full overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-1 rounded-full"
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {course.tags?.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="bg-white/5 text-white/70 border-white/10">
                                    {tag}
                                </Badge>
                            ))}
                            {course.tags?.length > 2 && (
                                <Badge variant="outline" className="bg-white/5 text-white/70 border-white/10">
                                    +{course.tags.length - 2}
                                </Badge>
                            )}
                        </div>

                        <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                        <p className="text-white/70 text-sm line-clamp-2 mb-3">{course.description}</p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                            <img src="/placeholder.svg?height=24&width=24" alt={course.instructor} className="w-6 h-6 rounded-full" />
                            <span className="text-sm text-white/70">{course.instructor}</span>
                        </div>

                        <div className="flex items-center">
                            <div className="flex items-center mr-3">
                                <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                                <span className="ml-1 text-sm">{course.rating}</span>
                            </div>
                            <span className="text-sm text-white/70">{translateLevel(course.level)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

