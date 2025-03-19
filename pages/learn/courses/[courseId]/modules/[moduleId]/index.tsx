"use client"

import { AIExplainButton } from "@/components/ai/ai-explain-button"
import { AISidePanel } from "@/components/ai/ai-side-panel"
import { ContentViewer } from "@/components/module/content-viewer"
import { KeyboardShortcuts } from "@/components/module/keyboard-shortcuts"
import { ModuleHeader } from "@/components/module/module-header"
import QuizSection from "@/components/module/quiz-section"
import { TableOfContents } from "@/components/module/table-of-contents"
import { TextContentItem } from "@/components/module/text-content-item"
import { TextSelectionProvider } from "@/components/module/text-selection-context"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CourseApiService } from "@/services/course-api-service"
import type { ContentItem, Module } from "@/types/course"
import { ArrowLeft } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

// Constantes pour la configuration
const ITEMS_PER_PAGE = 4
const AUTO_SCROLL_INTERVAL = 30000 // 30 secondes par page en mode lecture automatique

const adaptContentItem = (item: any): ContentItem => {
  console.log("Adapting content item:", item)

  const baseItem = {
    id: item.id?.toString() || Math.random().toString(36).substring(7),
    type: item.type || "text",
  }
  if (!item) {
    console.error("Content item is null or undefined")
    return {
      ...baseItem,
      type: "text",
      content: "",
    }
  }
  switch (item.type) {
    case "text":
      return {
        ...baseItem,
        type: "text",
        content: item.text_content?.content || item.content || "",
      }
    case "image":
      return {
        ...baseItem,
        type: "image",
        url: item.image_content?.image || item.url || "",
        position: item.image_content?.position || item.position || "center",
      }
    case "video":
      return {
        ...baseItem,
        type: "video",
        url: item.video_content?.url || item.url || "",
        platform: item.video_content?.platform || item.platform || "youtube",
      }
    case "file":
      return {
        ...baseItem,
        type: "file",
        url: item.file_content?.url || item.url || "",
        filename: item.file_content?.filename || item.filename || "Fichier",
        description: item.file_content?.description || item.description || "",
        fileSize: item.file_content?.size || item.fileSize || 0,
      }
    case "link":
      return {
        ...baseItem,
        type: "link",
        url: item.link_content?.url || item.url || "",
        description: item.link_content?.description || item.description || "",
      }
    default:
      console.warn(`Unknown content type: ${item.type}`)
      return {
        ...baseItem,
        type: "text",
        content: "Contenu non pris en charge",
      }
  }
}

export default function ModulePage() {
  const router = useRouter()
  const params = useParams()

  // Récupération des paramètres d'URL
  const [courseId, setCourseId] = useState<string | null>(null)
  const [moduleId, setModuleId] = useState<string | null>(null)
  const [paramsLoaded, setParamsLoaded] = useState(false)

  const [moduleData, setModuleData] = useState<any>(null)
  const [module, setModule] = useState<Module | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState<"content" | "quiz">("content")
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [debugMode, setDebugMode] = useState(process.env.NODE_ENV === "development")

  // États pour la pagination du contenu
  const [contentSets, setContentSets] = useState<ContentItem[][]>([])
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isTableOfContentsOpen, setIsTableOfContentsOpen] = useState(false)

  // États pour les erreurs
  const [error, setError] = useState<string | null>(null)
  const [completeError, setCompleteError] = useState<string | null>(null)
  const [completingModule, setCompletingModule] = useState(false)

  // Effet pour extraire les paramètres d'URL
  useEffect(() => {
    if (params) {
      const courseIdParam = params.courseId as string
      const moduleIdParam = params.moduleId as string

      if (courseIdParam && moduleIdParam) {
        console.log(`URL params extracted: courseId=${courseIdParam}, moduleId=${moduleIdParam}`)
        setCourseId(courseIdParam)
        setModuleId(moduleIdParam)
        setParamsLoaded(true)
      } else {
        console.error("Course ID or Module ID is missing from URL params")
        setError("Identifiants de cours ou de module manquants dans l'URL")
      }
    }
  }, [params])

  // Effet pour charger le module une fois les paramètres extraits
  useEffect(() => {
    if (!paramsLoaded || !courseId || !moduleId) return

    const fetchModule = async () => {
      try {
        setLoading(true)
        console.log(`Fetching module: courseId=${courseId}, moduleId=${moduleId}`)

        const data = await CourseApiService.getModuleById(courseId, moduleId)
        console.log("Raw API response:", data)

        if (data) {
          setModuleData(data)

          // Adapter directement les données ici pour éviter les problèmes de timing
          try {
            const adaptedModule: Module = {
              id: data.id?.toString() || moduleId,
              courseId: data.course_id?.toString() || courseId,
              course_id: data.course_id?.toString() || courseId,
              title: data.title || "Module sans titre",
              duration: data.duration?.toString() || "0 min",
              content: Array.isArray(data.content_items)
                ? data.content_items.map(adaptContentItem).filter(Boolean)
                : [],
              quiz: Array.isArray(data.quiz_questions)
                ? data.quiz_questions.map((q: any) => {
                  // Trouver la(les) bonne(s) réponse(s)
                  const correctAnswers = q.options
                    .filter((opt: any) => opt.is_correct)
                    .map((opt: any) => opt.id.toString());

                  return {
                    id: q.id?.toString() || Math.random().toString(36).substring(7),
                    question: q.question || "",
                    type: q.type || "multiple-choice",
                    options: q.options.map((opt: any) => ({
                      id: opt.id.toString(),
                      text: opt.text,
                    })),
                    correctAnswer: correctAnswers.length === 1 ? correctAnswers[0] : correctAnswers,
                  };
                })
                : [],
              completed: data.completed || false,
            }

            console.log("Adapted module:", adaptedModule)
            console.log("Base data:", data)
            setModule(adaptedModule)

            // Diviser le contenu en groupes de ITEMS_PER_PAGE pour la pagination
            if (adaptedModule.content && adaptedModule.content.length > 0) {
              const contentGroups = []
              for (let i = 0; i < adaptedModule.content.length; i += ITEMS_PER_PAGE) {
                contentGroups.push(adaptedModule.content.slice(i, i + ITEMS_PER_PAGE))
              }
              setContentSets(contentGroups)
            }

            setDebugInfo({
              originalData: data,
              adaptedData: adaptedModule,
              contentLength: adaptedModule.content?.length || 0,
              quizLength: adaptedModule.quiz?.length || 0,
            })
          } catch (err) {
            console.error("Error adapting module data:", err)
            setError("Erreur lors de l'adaptation des données du module")
          }
        } else {
          // Rediriger si le module n'existe pas
          setError("Module non trouvé")
          setTimeout(() => {
            router.push(`/learn/courses/${courseId}`)
          }, 2000)
        }
      } catch (error) {
        console.error("Error fetching module:", error)
        setError("Impossible de charger le module. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchModule()
  }, [courseId, moduleId, paramsLoaded, router])

  // Effet pour gérer les raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ne pas traiter les raccourcis si l'utilisateur est en train de taper dans un champ de texte
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case "ArrowLeft":
          if (currentStep === "content" && currentContentIndex > 0) {
            setCurrentContentIndex(currentContentIndex - 1)
          }
          break
        case "ArrowRight":
          if (currentStep === "content" && currentContentIndex < contentSets.length - 1) {
            setCurrentContentIndex(currentContentIndex + 1)
          }
          break
        case "f":
          toggleFullscreen()
          break
        case "Escape":
          if (isFullscreen) setIsFullscreen(false)
          break
        case " ": // Espace
          if (currentStep === "content") {
            toggleAutoScroll()
            e.preventDefault() // Empêcher le défilement de la page
          }
          break
        case "q":
          if (currentStep === "content") {
            setCurrentStep("quiz")
          } else {
            setCurrentStep("content")
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentStep, currentContentIndex, isFullscreen, isAutoScrolling, contentSets.length])

  // Effet pour gérer le défilement automatique
  useEffect(() => {
    if (isAutoScrolling && currentStep === "content") {
      autoScrollTimerRef.current = setInterval(() => {
        if (currentContentIndex < contentSets.length - 1) {
          setCurrentContentIndex((prev) => prev + 1)
        } else {
          // Arrêter le défilement automatique à la fin du contenu
          setIsAutoScrolling(false)
        }
      }, AUTO_SCROLL_INTERVAL)
    }

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current)
        autoScrollTimerRef.current = null
      }
    }
  }, [isAutoScrolling, currentContentIndex, contentSets.length, currentStep])

  // Fonction pour basculer en mode plein écran
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Fonction pour basculer le défilement automatique
  const toggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling)
  }

  // Fonction pour marquer le module comme terminé
  const handleCompleteModule = async (timeSpent: number) => {
    if (!courseId || !moduleId) return

    try {
      setCompletingModule(true)
      await CourseApiService.completeModule(courseId, moduleId, timeSpent)
      router.push(`/learn/courses/${courseId}`)
    } catch (error) {
      console.error("Error completing module:", error)
      setCompleteError("Impossible de marquer le module comme terminé. Veuillez réessayer plus tard.")
    } finally {
      setCompletingModule(false)
    }
  }

  // Affichage de l'état de chargement initial (avant extraction des paramètres)
  if (!paramsLoaded) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white/70">Chargement des paramètres...</p>
        </div>
      </div>
    )
  }

  // Affichage de l'état de chargement du module
  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white/70">Chargement du module...</p>
          <p className="text-xs text-white/50 mt-2">
            Cours: {courseId}, Module: {moduleId}
          </p>
        </div>
      </div>
    )
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-500/20 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Erreur</h2>
          <p className="text-white/70 mb-4">{error}</p>
          {courseId && <Button onClick={() => router.push(`/learn/courses/${courseId}`)}>Retour au cours</Button>}
        </div>
      </div>
    )
  }

  // Affichage si le module n'est pas trouvé
  if (!module) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Module non trouvé</h2>
          <p className="text-white/70 mb-4">Le module que vous recherchez n'existe pas ou a été supprimé.</p>
          {courseId && <Button onClick={() => router.push(`/learn/courses/${courseId}`)}>Retour au cours</Button>}
        </div>
      </div>
    )
  }

  // Afficher les informations de débogage si nécessaire
  if (debugInfo && process.env.NODE_ENV === "development") {
    console.log("Debug info:", debugInfo)
  }

  const currentContent = contentSets[currentContentIndex]?.[0] || null

  return (
    <ProtectedRoute>
      <TextSelectionProvider>
        <div
          className={`min-h-screen bg-gradient-to-b from-gray-900 to-black text-white ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
        >
          {debugMode && (
            <div className="bg-red-900/50 p-2 text-xs">
              <div className="container mx-auto">
                <details>
                  <summary className="cursor-pointer font-mono">Debug Info</summary>
                  <pre className="mt-2 p-2 bg-black/50 rounded overflow-auto max-h-96">
                    {JSON.stringify(
                      {
                        params,
                        courseId,
                        moduleId,
                        moduleData: moduleData ? "(data available)" : null,
                        module: module ? "(module available)" : null,
                        error,
                        loading,
                        contentLength: module?.content?.length || 0,
                        quizLength: module?.quiz?.length || 0,
                        contentSets: contentSets.length,
                        currentContentIndex,
                      },
                      null,
                      2,
                    )}
                  </pre>
                </details>
              </div>
            </div>
          )}

          <div className="container mx-auto px-4 py-8">
            {/* En-tête du module */}
            <ModuleHeader
              courseId={courseId || ""}
              title={module.title}
              duration={module.duration}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              isFullscreen={isFullscreen}
              toggleFullscreen={toggleFullscreen}
              isAutoScrolling={isAutoScrolling}
              toggleAutoScroll={toggleAutoScroll}
              openTableOfContents={() => setIsTableOfContentsOpen(true)}
            />

            <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="pt-6">
                {currentStep === "content" ? (
                  <>
                    <ContentViewer
                      contentSets={contentSets}
                      currentContentIndex={currentContentIndex}
                      setCurrentContentIndex={setCurrentContentIndex}
                      totalItems={module.content?.length || 0}
                      setCurrentStep={setCurrentStep}
                    />
                    <TextContentItem content={currentContent?.type === "text" ? currentContent.content : ""} />
                  </>
                ) : (
                  <QuizSection
                    questions={module.quiz || []}
                    setCurrentStep={setCurrentStep}
                    onCompleteModule={handleCompleteModule}
                    moduleId={moduleId}
                  />
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {currentStep === "content" ? (
                  <></>
                ) : (
                  <div className="w-full flex justify-start">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("content")}
                      className="border-white/10 hover:bg-white/10"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour au contenu
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Table des matières */}
          <TableOfContents
            isOpen={isTableOfContentsOpen}
            setIsOpen={setIsTableOfContentsOpen}
            content={module.content || []}
            currentContentIndex={currentContentIndex}
            setCurrentContentIndex={setCurrentContentIndex}
            itemsPerPage={ITEMS_PER_PAGE}
          />

          {/* Raccourcis clavier */}
          <KeyboardShortcuts isFullscreen={isFullscreen} />
          <AIExplainButton />

          {/* Panneau latéral IA */}
          <AISidePanel />
        </div>
      </TextSelectionProvider>
    </ProtectedRoute>
  )
}

