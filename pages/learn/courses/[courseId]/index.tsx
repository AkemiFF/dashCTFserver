"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { BookOpen, CheckCircle2, Clock, Download, FileText, MessageSquare, Play, Star } from "lucide-react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
// Remplacer l'import du CourseService
import { CourseApiService } from "@/services/course-api-service"
import type { Course } from "@/services/types/course"
import dynamic from "next/dynamic"
// Ajouter l'import pour ProtectedRoute
const ProtectedRoute = dynamic(() => import("@/components/protected-route"), {
  ssr: false, // Désactiver le SSR pour cette page
});

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const router = useRouter()
  const [id, setId] = useState<string | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [activeTab, setActiveTab] = useState("modules")
  const [loading, setLoading] = useState(true)
  // Ajouter un état pour les erreurs
  const [error, setError] = useState<string | null>(null)
  // Ajouter ces états au début du composant
  const [enrolling, setEnrolling] = useState(false)
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false)
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null)


  // Remplacer la fonction useEffect qui charge le cours
  useEffect(() => {
    const courseId = params?.courseId || (router.query.courseId as string)
    setId(courseId)
    if (!courseId) {
      console.error("Course ID or Module ID is undefined")
      return
    }
    const fetchCourse = async () => {
      try {
        setLoading(true)
        const courseData = await CourseApiService.getCourseById(courseId)
        console.log(courseData);

        if (courseData) {
          setCourse(courseData)
        } else {
          // Rediriger si le cours n'existe pas
          // router.push("/learn")
        }
      } catch (error) {
        console.error("Error fetching course:", error)
        setError("Impossible de charger le cours. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [router.isReady, router.query.courseId, router.query.moduleId, params])

  const handleStartModule = (moduleId: string) => {
    router.push(`/learn/courses/${id}/modules/${moduleId}`)
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

  // Ajouter une fonction pour s'inscrire à un cours
  const handleEnrollCourse = async () => {
    try {
      setEnrolling(true)
      await CourseApiService.enrollInCourse(id || "")
      // Recharger les données du cours après l'inscription
      const updatedCourse = await CourseApiService.getCourseById(id || "")
      setCourse(updatedCourse)
      setEnrollmentSuccess(true)
    } catch (error) {
      console.error("Error enrolling in course:", error)
      setEnrollmentError("Impossible de s'inscrire au cours. Veuillez réessayer plus tard.")
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Cours non trouvé</h2>
          <p className="text-white/70 mb-4">Le cours que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button onClick={() => router.push("/learn")}>Retour aux formations</Button>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-navy-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.push("/learn")} className="mb-6 hover:bg-white/10">
            ← Retour aux formations
          </Button>

          {/* En-tête du cours */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="relative rounded-xl overflow-hidden">
                <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {course.tags?.map((tag) => (
                        <Badge key={tag} className="bg-white/10 hover:bg-white/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5">
                        <img
                          src="/placeholder.svg?height=32&width=32"
                          alt={course.instructor}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm">{course.instructor}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm">{course.rating}</span>
                        <span className="text-white/60 text-sm">({course.students} étudiants)</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-white/60" />
                        <span className="text-sm">{course.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="border border-white/10 bg-white/5 backdrop-blur-sm h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">
                      {course.progress > 0 ? `${course.progress}% Complété` : "Prêt à commencer ?"}
                    </div>
                    {course.progress > 0 ? (
                      <Progress value={course.progress} className="h-2 mb-4" />
                    ) : (
                      <p className="text-white/70 mb-4">Inscrivez-vous maintenant pour suivre votre progression</p>
                    )}
                  </div>

                  {/* Modifier le bouton d'inscription pour utiliser la nouvelle fonction */}
                  <Button
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    onClick={handleEnrollCourse}
                    disabled={enrolling}
                  >
                    {enrolling ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Traitement en cours...
                      </div>
                    ) : course.progress > 0 ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Continuer l'apprentissage
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4 mr-2" />
                        S'inscrire au cours
                      </>
                    )}
                  </Button>

                  {/* Ajouter un message de succès après l'inscription */}
                  {enrollmentSuccess && (
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
                      <p className="text-sm">Inscription réussie ! Vous pouvez maintenant commencer à apprendre.</p>
                    </div>
                  )}

                  {/* Ajouter un message d'erreur en cas d'échec */}
                  {enrollmentError && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                      <p className="text-sm">{enrollmentError}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Niveau:</span>
                      <span>{translateLevel(course.level)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Modules:</span>
                      <span>{course.modules.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Prérequis:</span>
                      <span>{course.prerequisites}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Certificat:</span>
                      <span>Oui, à la fin du cours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Onglets de contenu du cours */}
          <Tabs defaultValue="modules" value={activeTab} onValueChange={setActiveTab} className="w-full mt-8">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="modules" className="data-[state=active]:bg-white/10">
                <BookOpen className="h-4 w-4 mr-2" />
                Modules
              </TabsTrigger>
              <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
                <FileText className="h-4 w-4 mr-2" />
                Aperçu
              </TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-white/10">
                <Download className="h-4 w-4 mr-2" />
                Ressources
              </TabsTrigger>
              <TabsTrigger value="discussions" className="data-[state=active]:bg-white/10">
                <MessageSquare className="h-4 w-4 mr-2" />
                Discussions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="modules" className="mt-6">
              <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <h3 className="text-xl font-semibold">Modules du cours</h3>
                  <p className="text-white/70 text-sm">
                    {course.modules.length} modules •{" "}
                    {course.progress > 0 ? `${course.progress}% complété` : "Pas commencé"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.modules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`p-4 rounded-lg border ${module.completed
                        ? "border-green-500/20 bg-green-500/5"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                        } transition-colors cursor-pointer`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${module.completed ? "bg-green-500/20 text-green-500" : "bg-white/10 text-white/70"
                            }`}
                        >
                          {module.completed ? <CheckCircle2 className="h-4 w-4" /> : <span>{index + 1}</span>}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{module.title}</h4>
                            <span className="text-white/60 text-sm">{module.duration}</span>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-3 text-xs bg-white/5 hover:bg-white/10"
                              onClick={() => handleStartModule(module.id)}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              {module.completed ? "Revoir" : "Commencer"}
                            </Button>

                            {module.completed && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                                Complété
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overview" className="mt-6">
              <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">À propos de ce cours</h3>
                  <p className="text-white/80 mb-6 leading-relaxed">
                    {course.description}
                    {
                      " Ce cours complet est conçu pour vous donner une compréhension approfondie du sujet à travers des exemples pratiques et des exercices concrets. À la fin de ce cours, vous aurez les compétences et les connaissances nécessaires pour appliquer ces concepts dans des scénarios réels."
                    }
                  </p>

                  <h4 className="text-lg font-medium mb-3">Ce que vous allez apprendre</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Maîtriser les concepts et principes fondamentaux</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Construire des projets pratiques pour renforcer votre apprentissage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Comprendre les meilleures pratiques et les normes de l'industrie</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Résoudre des problèmes complexes avec des solutions efficaces</span>
                    </li>
                  </ul>

                  <h4 className="text-lg font-medium mb-3">Prérequis</h4>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-white/60 mt-2.5"></div>
                      <span>{course.prerequisites}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-white/60 mt-2.5"></div>
                      <span>Un ordinateur avec accès à Internet</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-white/60 mt-2.5"></div>
                      <span>Enthousiasme pour apprendre et pratiquer</span>
                    </li>
                  </ul>

                  <h4 className="text-lg font-medium mb-3">Instructeur</h4>
                  <div className="flex items-start gap-4">
                    <img
                      src="/placeholder.svg?height=80&width=80"
                      alt={course.instructor}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="font-medium">{course.instructor}</h5>
                      <p className="text-white/70 text-sm mb-2">Expert en {course.tags?.[0] || "cybersécurité"}</p>
                      <p className="text-white/80 text-sm">
                        Un instructeur expérimenté avec plus de 10 ans d'expérience dans l'industrie. Passionné par
                        l'enseignement et l'aide aux étudiants pour atteindre leurs objectifs d'apprentissage.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="mt-6">
              <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Ressources du cours</h3>
                  <div className="space-y-3">
                    <div className="p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-white/70" />
                        <div>
                          <h4 className="font-medium">Programme du cours</h4>
                          <p className="text-white/60 text-sm">PDF, 2.3 MB</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="h-8 px-3">
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
                    </div>

                    <div className="p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-white/70" />
                        <div>
                          <h4 className="font-medium">Fichiers d'exercices</h4>
                          <p className="text-white/60 text-sm">ZIP, 15.7 MB</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="h-8 px-3">
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discussions" className="mt-6">
              <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Discussions du cours</h3>
                  <p className="text-white/70 mb-4">
                    Rejoignez la conversation avec d'autres étudiants et l'instructeur.
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                      <div className="flex items-start gap-3">
                        <img
                          src="/placeholder.svg?height=40&width=40"
                          alt="Avatar utilisateur"
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">Marie Laurent</h4>
                              <p className="text-white/60 text-xs">Il y a 2 jours</p>
                            </div>
                            <Badge variant="outline" className="bg-white/5">
                              Module 3
                            </Badge>
                          </div>
                          <p className="mt-2 text-white/80">
                            J'ai du mal à comprendre le concept dans le module 3. Quelqu'un pourrait-il l'expliquer en
                            termes plus simples ?
                          </p>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Répondre
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-white/10 rounded-lg bg-white/5 ml-8">
                      <div className="flex items-start gap-3">
                        <img
                          src="/placeholder.svg?height=40&width=40"
                          alt="Avatar instructeur"
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{course.instructor}</h4>
                              <p className="text-white/60 text-xs">Il y a 1 jour</p>
                            </div>
                            <Badge className="bg-gradient-to-r from-pink-500 to-purple-600">Instructeur</Badge>
                          </div>
                          <p className="mt-2 text-white/80">
                            Bonjour Marie ! Pensez-y comme ceci : [explication simplifiée]. Est-ce que cela clarifie les
                            choses ?
                          </p>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Répondre
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-white/10 hover:bg-white/20">Voir toutes les discussions</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}

