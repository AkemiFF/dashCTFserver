"use client"

import type React from "react"

import Layout from "@/components/admin/layout"
import { RichTextEditor } from "@/components/admin/RichTextEditor"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { authFetchAdmin } from "@/lib/api"
import { getAdminAuthHeader, getAdminAuthHeaderFormData } from "@/lib/auth"
import { ADMIN_NAME, BASE_URL } from "@/lib/host"
import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    FileText,
    Image,
    Link,
    Sparkles,
    Trash2,
    Type,
    Video,
    Wand2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Course = {
    id: string
    title: string
    slug: string
    description: string
    level: string
    category: string
    duration: string
    instructor: string
    image: string
    students: number
    rating: string
    progress: number
}

type ReferenceData = {
    courses: Course[]
    levels: string[]
    categories: string[]
    tags: string[]
}

type ContentItem =
    | { type: "text"; content: string }
    | { type: "image"; file: File | null; position: "left" | "center" | "right" }
    | { type: "video"; url: string; file: File | null; platform: "youtube" | "vimeo" | "local" | "upload" }
    | { type: "file"; file: File | null; description: string }
    | { type: "link"; url: string; description: string }

export default function GenerateModulePage() {
    const router = useRouter()
    const [currentData, setCurrentData] = useState({
        courseId: "",
        title: "",
        duration: "",
        content: [] as ContentItem[],
    })
    const [error, setError] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [aiPrompt, setAiPrompt] = useState("")
    const [showJsonDialog, setShowJsonDialog] = useState(false)
    const [jsonData, setJsonData] = useState("")
    const [isJsonValid, setIsJsonValid] = useState(true)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCurrentData((prev) => ({ ...prev, [name]: value }))
    }

    const [referenceData, setReferenceData] = useState<ReferenceData>({
        courses: [],
        levels: [],
        categories: [],
        tags: [],
    })

    const handleSelectChange = (name: string, value: string) => {
        const selectedCourse = referenceData.courses.find((course) => course.id === value);

        setCurrentData((prev) => ({ ...prev, [name]: value }));
        setCurrentData((prev) => ({ ...prev, title: selectedCourse?.title || "" }));
        setCurrentData((prev) => ({ ...prev, duration: selectedCourse?.duration || "" }));
    }

    useEffect(() => {
        const fetchReferenceData = async () => {
            try {
                const response = await authFetchAdmin(`${BASE_URL}/api/learn/admin/reference-data/`)

                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des données de référence")
                }

                const data = await response.json()
                setReferenceData({
                    courses: data.courses,
                    levels: data.levels,
                    categories: data.categories,
                    tags: data.tags,
                })
            } catch (error) {
                setError((error as Error).message)
            }
        }

        fetchReferenceData()
    }, [])

    const addContentItem = (type: ContentItem["type"]) => {
        let newItem: ContentItem

        switch (type) {
            case "text":
                newItem = { type: "text", content: "" }
                break
            case "image":
                newItem = { type: "image", file: null, position: "center" }
                break
            case "video":
                newItem = { type: "video", url: "", file: null, platform: "upload" }
                break
            case "file":
                newItem = { type: "file", file: null, description: "" }
                break
            case "link":
                newItem = { type: "link", url: "", description: "" }
                break
            default:
                newItem = { type: "text", content: "" }
        }

        setCurrentData((prevState) => {
            return {
                ...prevState,
                content: [...prevState.content, newItem],
            }
        })
    }

    const updateContentItem = (index: number, updatedItem: ContentItem) => {
        setCurrentData((prev) => ({
            ...prev,
            content: prev.content.map((item, i) => (i === index ? updatedItem : item)),
        }))
    }

    const moveContentItem = (index: number, direction: "up" | "down") => {
        if ((direction === "up" && index === 0) || (direction === "down" && index === currentData.content.length - 1)) {
            return
        }
        const newIndex = direction === "up" ? index - 1 : index + 1
        const newContent = [...currentData.content]
            ;[newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]]
        setCurrentData((prev) => ({ ...prev, content: newContent }))
    }

    const removeContentItem = (index: number) => {
        setCurrentData((prev) => ({
            ...prev,
            content: prev.content.filter((_, i) => i !== index),
        }))
    }
    const handleGenerateWithAI = async () => {
        if (!currentData.courseId || !aiPrompt) {
            setError("Veuillez sélectionner un cours et fournir une description pour la génération.");
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            const requestData = {
                course_id: currentData.courseId,
                prompt: aiPrompt,
            };

            const response = await fetch(`${BASE_URL}/api/chat/generate-module/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(await getAdminAuthHeader()),
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
            }

            // Attendre la réponse complète
            const completeResponse = await response.json();
            console.log(completeResponse)
            // Valider la structure de la réponse
            if (!completeResponse.content) {
                throw new Error("Réponse du serveur invalide");
            }

            // Parser le contenu JSON final
            const parsedData = typeof completeResponse === "string"
                ? JSON.parse(completeResponse)
                : completeResponse;
            console.log("Parsed ", parsedData);

            // Mettre à jour l'état directement avec les données finales
            setCurrentData(prev => ({
                ...prev,
                title: parsedData.title || prev.title,
                duration: parsedData.duration || prev.duration,
                content: parsedData.content || prev.content,
            }));

            // Mettre à jour l'affichage JSON
            setJsonData(JSON.stringify(parsedData, null, 2));

            // Afficher la dialog si contenu valide
            if (parsedData.content?.length > 0) {
                setShowJsonDialog(true);
            } else {
                setError("La génération n'a pas produit de contenu valide.");
            }

        } catch (error) {
            setError(`Erreur lors de la génération: ${(error as Error).message}`);
            console.error("Erreur complète:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleImportJson = () => {
        try {
            const parsedData = JSON.parse(jsonData)

            if (!parsedData.title || !parsedData.content || !Array.isArray(parsedData.content)) {
                throw new Error("Format JSON invalide. Le JSON doit contenir au moins un titre et un tableau de contenu.")
            }

            setCurrentData((prev) => ({
                ...prev,
                title: parsedData.title || prev.title,
                duration: parsedData.duration || prev.duration,
                content: parsedData.content || prev.content,
            }))

            setShowJsonDialog(false)
            setIsJsonValid(true)
        } catch (error) {
            setIsJsonValid(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!currentData.courseId || !currentData.title || currentData.content.length === 0) {
            setError("Veuillez remplir tous les champs obligatoires et ajouter du contenu.")
            return
        }

        try {
            // Créer un objet pour la requête
            const modulePayload: { course: string; title: string; duration: string; points: number } = {
                course: currentData.courseId,
                title: currentData.title,
                duration: currentData.duration,
                points: 10, // Valeur par défaut
            }

            // Créer le module
            const moduleResponse = await fetch(`${BASE_URL}/api/learn/admin/modules/`, {
                method: "POST",
                headers: {
                    ...(await getAdminAuthHeader()),
                },
                body: JSON.stringify(modulePayload),
            })

            if (!moduleResponse.ok) {
                const errorData = await moduleResponse.json()
                throw new Error(errorData.error || "Erreur lors de la création du module")
            }

            const moduleData = await moduleResponse.json()
            const moduleId = moduleData.id

            // Ajouter les éléments de contenu
            for (let i = 0; i < currentData.content.length; i++) {
                const item = currentData.content[i]
                const formData = new FormData()

                formData.append("type", item.type)
                formData.append("order", i.toString())

                if (item.type === "text") {
                    formData.append("content", item.content)
                } else if (item.type === "image") {
                    if (item.file) {
                        formData.append("image", item.file)
                    }
                    formData.append("image_position", item.position)
                } else if (item.type === "video") {
                    if (item.platform === "upload" && item.file) {
                        formData.append("video_file", item.file)
                        formData.append("video_platform", "upload")
                    } else {
                        formData.append("video_url", item.url)
                        formData.append("video_platform", item.platform)
                    }
                } else if (item.type === "file") {
                    if (item.file) {
                        formData.append("file", item.file)
                    }
                    formData.append("file_description", item.description)
                } else if (item.type === "link") {
                    formData.append("link_url", item.url)
                    formData.append("link_description", item.description)
                }

                const contentResponse = await fetch(`${BASE_URL}/api/learn/admin/modules/${moduleId}/add_content/`, {
                    method: "POST",
                    headers: {
                        ...(await getAdminAuthHeaderFormData()),
                    },
                    body: formData,
                })

                if (!contentResponse.ok) {
                    const errorData = await contentResponse.json()
                    throw new Error(errorData.error || `Erreur lors de l'ajout du contenu ${i + 1}`)
                }
            }

            // Rediriger vers la liste des modules
            router.push(`${ADMIN_NAME}/learn`)
        } catch (error) {
            setError((error as Error).message)
        }
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                    Générer un module avec l'IA
                </h1>
                <Card className="border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle className="text-2xl">Détails du module</CardTitle>
                            <CardDescription className="text-white/70">
                                Générez un module de cours avec l'aide de l'IA, puis modifiez-le selon vos besoins.
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="courseId">Cours</Label>
                                    <Select
                                        onValueChange={(value) => {
                                            handleSelectChange("courseId", value);
                                        }}
                                        required
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue>
                                                {currentData.courseId
                                                    ? referenceData.courses.find((course) => course.id === currentData.courseId)?.title || "Cours N°" + currentData.courseId
                                                    : "Sélectionnez un cours"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className="bg-navy-900 border-white/10 text-white">
                                            {referenceData.courses.map((course) => (
                                                <SelectItem key={course.id} value={course.id}>
                                                    {course.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="title">Titre du module</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={currentData.title}
                                        onChange={handleInputChange}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                                        placeholder="Sera généré par l'IA ou saisissez manuellement"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration">Durée du module</Label>
                                <Input
                                    id="duration"
                                    name="duration"
                                    value={currentData.duration}
                                    onChange={handleInputChange}
                                    placeholder="Sera estimée par l'IA ou saisissez manuellement"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="aiPrompt">Description pour l'IA</Label>
                                <Textarea
                                    id="aiPrompt"
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="Décrivez le module que vous souhaitez générer. Par exemple: 'Un module sur les bases de la programmation Python pour débutants, couvrant les variables, les boucles et les fonctions.'"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 min-h-[100px]"
                                />
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    type="button"
                                    onClick={handleGenerateWithAI}
                                    disabled={isGenerating || !currentData.courseId || !aiPrompt}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all"
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                            Génération en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="mr-2 h-4 w-4" /> Générer avec l'IA
                                        </>
                                    )}
                                </Button>
                            </div>

                            {currentData.content.length > 0 && (
                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-lg font-medium">Contenu du module</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowJsonDialog(true)}
                                            className="border-white/10 text-white hover:bg-white/10"
                                        >
                                            <FileText className="mr-2 h-4 w-4" /> Voir/Modifier JSON
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {currentData.content.map((item, index) => (
                                            <Card
                                                key={index}
                                                className="relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
                                            >
                                                <CardContent className="pt-6">
                                                    {item.type === "text" && (
                                                        <RichTextEditor
                                                            value={item.content}
                                                            onChange={(value) => updateContentItem(index, { ...item, content: value })}
                                                        />
                                                    )}
                                                    {item.type === "image" && (
                                                        <div className="space-y-2">
                                                            <Input
                                                                type="file"
                                                                accept="image/*"
                                                                className="bg-white/5 border-white/10 text-white"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0] || null
                                                                    if (file) {
                                                                        updateContentItem(index, { ...item, file })
                                                                    }
                                                                }}
                                                            />
                                                            <Select
                                                                value={item.position}
                                                                onValueChange={(value) =>
                                                                    updateContentItem(index, { ...item, position: value as "left" | "center" | "right" })
                                                                }
                                                            >
                                                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                                    <SelectValue placeholder="Position de l'image" />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-navy-900 border-white/10 text-white">
                                                                    <SelectItem value="left">Gauche</SelectItem>
                                                                    <SelectItem value="center">Centre</SelectItem>
                                                                    <SelectItem value="right">Droite</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            {item.file && (
                                                                <div className="mt-2 max-w-xs mx-auto">
                                                                    <img
                                                                        src={URL.createObjectURL(item.file) || "/placeholder.svg"}
                                                                        alt="Preview"
                                                                        className="rounded-md max-h-40 object-contain"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {item.type === "video" && (
                                                        <div className="space-y-2">
                                                            <Select
                                                                value={item.platform}
                                                                onValueChange={(value) =>
                                                                    updateContentItem(index, {
                                                                        ...item,
                                                                        platform: value as "youtube" | "vimeo" | "local" | "upload",
                                                                    })
                                                                }
                                                            >
                                                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                                    <SelectValue placeholder="Type de vidéo" />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-navy-900 border-white/10 text-white">
                                                                    <SelectItem value="youtube">YouTube</SelectItem>
                                                                    <SelectItem value="vimeo">Vimeo</SelectItem>
                                                                    <SelectItem value="local">Locale</SelectItem>
                                                                    <SelectItem value="upload">Télécharger</SelectItem>
                                                                </SelectContent>
                                                            </Select>

                                                            {item.platform === "upload" ? (
                                                                <div className="space-y-2">
                                                                    <Input
                                                                        type="file"
                                                                        accept="video/*"
                                                                        className="bg-white/5 border-white/10 text-white"
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0] || null
                                                                            if (file) {
                                                                                updateContentItem(index, { ...item, file })
                                                                            }
                                                                        }}
                                                                    />
                                                                    {item.file && (
                                                                        <div className="mt-2 aspect-video bg-black/20 rounded-md flex items-center justify-center">
                                                                            <video
                                                                                controls
                                                                                className="rounded-md max-h-[300px] max-w-full"
                                                                                src={URL.createObjectURL(item.file)}
                                                                            >
                                                                                Votre navigateur ne supporte pas la lecture de vidéos.
                                                                            </video>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-2">
                                                                    <Input
                                                                        placeholder="URL de la vidéo"
                                                                        value={item.url}
                                                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                                                                        onChange={(e) => updateContentItem(index, { ...item, url: e.target.value })}
                                                                    />
                                                                    {item.url && item.platform === "youtube" && (
                                                                        <div className="mt-2 aspect-video bg-black/20 rounded-md flex items-center justify-center">
                                                                            <iframe
                                                                                width="100%"
                                                                                height="100%"
                                                                                src={`https://www.youtube.com/embed/${item.url.split("v=")[1]?.split("&")[0] || item.url}`}
                                                                                title="YouTube video player"
                                                                                frameBorder="0"
                                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                allowFullScreen
                                                                                className="rounded-md aspect-video"
                                                                            ></iframe>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {item.type === "file" && (
                                                        <div className="space-y-2">
                                                            <Input
                                                                type="file"
                                                                className="bg-white/5 border-white/10 text-white"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0] || null
                                                                    if (file) {
                                                                        updateContentItem(index, { ...item, file })
                                                                    }
                                                                }}
                                                            />
                                                            <Input
                                                                placeholder="Description du fichier"
                                                                value={item.description}
                                                                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                                                                onChange={(e) => updateContentItem(index, { ...item, description: e.target.value })}
                                                            />
                                                            {item.file && (
                                                                <div className="mt-2 p-3 bg-white/5 rounded-md flex items-center gap-2">
                                                                    <FileText className="h-5 w-5 text-white/70" />
                                                                    <div>
                                                                        <p className="text-sm font-medium">{item.file.name}</p>
                                                                        <p className="text-xs text-white/70">{(item.file.size / 1024).toFixed(2)} KB</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {item.type === "link" && (
                                                        <div className="space-y-2">
                                                            <Input
                                                                placeholder="URL du lien"
                                                                value={item.url}
                                                                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                                                                onChange={(e) => updateContentItem(index, { ...item, url: e.target.value })}
                                                            />
                                                            <Input
                                                                placeholder="Description du lien"
                                                                value={item.description}
                                                                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                                                                onChange={(e) => updateContentItem(index, { ...item, description: e.target.value })}
                                                            />
                                                            {item.url && (
                                                                <div className="mt-2 p-3 bg-white/5 rounded-md flex items-center gap-2">
                                                                    <Link className="h-5 w-5 text-white/70" />
                                                                    <a
                                                                        href={item.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-sm text-blue-400 hover:underline"
                                                                    >
                                                                        {item.description || item.url}
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </CardContent>
                                                <div className="absolute top-2 right-2 flex space-x-2">
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => moveContentItem(index, "up")}
                                                        disabled={index === 0}
                                                        className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                                                    >
                                                        <ArrowUp className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => moveContentItem(index, "down")}
                                                        disabled={index === currentData.content.length - 1}
                                                        className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                                                    >
                                                        <ArrowDown className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => removeContentItem(index)}
                                                        className="h-8 w-8 text-white/70 hover:text-red-400 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-2 justify-center">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => addContentItem("text")}
                                            className="border-white/10 text-white hover:bg-white/10"
                                        >
                                            <Type className="mr-2 h-4 w-4" /> Texte
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => addContentItem("image")}
                                            className="border-white/10 text-white hover:bg-white/10"
                                        >
                                            <Image className="mr-2 h-4 w-4" /> Image
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => addContentItem("video")}
                                            className="border-white/10 text-white hover:bg-white/10"
                                        >
                                            <Video className="mr-2 h-4 w-4" /> Vidéo
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => addContentItem("file")}
                                            className="border-white/10 text-white hover:bg-white/10"
                                        >
                                            <FileText className="mr-2 h-4 w-4" /> Fichier
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => addContentItem("link")}
                                            className="border-white/10 text-white hover:bg-white/10"
                                        >
                                            <Link className="mr-2 h-4 w-4" /> Lien
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        {currentData.content.length > 0 && (
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                                >
                                    <Sparkles className="mr-2 h-4 w-4" /> Enregistrer le module
                                </Button>
                            </CardFooter>
                        )}
                    </form>
                </Card>
            </div>

            {/* Dialogue pour afficher et modifier le JSON */}
            <Dialog open={showJsonDialog} onOpenChange={setShowJsonDialog}>
                <DialogContent className="bg-navy-900 border border-white/10 text-white max-w-4xl max-h-[80vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Données JSON du module</DialogTitle>
                        <DialogDescription className="text-white/70">
                            Vous pouvez visualiser et modifier directement les données JSON du module.
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="view" className="w-full">
                        <TabsList className="grid w-[200px] grid-cols-2 mb-4">
                            <TabsTrigger value="view">Visualiser</TabsTrigger>
                            <TabsTrigger value="edit">Modifier</TabsTrigger>
                        </TabsList>

                        <TabsContent value="view" className="p-0">
                            <pre className="bg-black/30 p-4 rounded-md overflow-auto max-h-[50vh] text-sm">
                                {JSON.stringify(currentData, null, 2)}
                            </pre>
                        </TabsContent>

                        <TabsContent value="edit" className="p-0">
                            <Textarea
                                value={jsonData}
                                onChange={(e) => {
                                    setJsonData(e.target.value)
                                    try {
                                        JSON.parse(e.target.value)
                                        setIsJsonValid(true)
                                    } catch {
                                        setIsJsonValid(false)
                                    }
                                }}
                                className="font-mono text-sm bg-black/30 p-4 rounded-md min-h-[50vh] border-white/10"
                            />
                            {!isJsonValid && (
                                <p className="text-red-400 text-sm mt-2">Format JSON invalide. Veuillez corriger avant d'importer.</p>
                            )}
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowJsonDialog(false)}
                            className="border-white/10 text-white hover:bg-white/10"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="button"
                            onClick={handleImportJson}
                            disabled={!isJsonValid}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600"
                        >
                            Importer les modifications
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    )
}

