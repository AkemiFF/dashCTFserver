"use client"

import type React from "react"

import { RichTextEditor } from "@/components/admin/RichTextEditor"
import { DockerPorts } from "@/components/admin/docker-ports"
import { EnvironmentVariables } from "@/components/admin/environment-variables"
import { FileList } from "@/components/admin/file-list"
import { FileUploadZone } from "@/components/admin/file-upload-zone"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Importer authFetchAdmin et BASE_URL
import { authFetchAdmin } from "@/lib/api"
import { ADMIN_NAME, BASE_URL } from "@/lib/host"

// Modifier l'interface DockerTemplate pour correspondre à la structure de l'API
interface DockerTemplate {
  id: number
  challenge_type: {
    id: number
    name: string
    slug: string
    validation_type: string
    icon: string
  }
  dockerfile: string
  default_ports: string[] // Changé de Record<string, number | null> à string[]
  common_commands: string[]
}

interface ChallengeType {
  id: number
  name: string
  slug: string
  validation_type: string
  icon: string
}

interface Category {
  id: number
  name: string
  description: string
}

interface TemplateData {
  challenge_types: ChallengeType[]
  docker_templates: DockerTemplate[]
  categories: Category[]
  difficulty_levels: Record<string, string>
}

export default function AddChallengePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [templateData, setTemplateData] = useState<TemplateData | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<DockerTemplate | null>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [challengeTypeId, setChallengeTypeId] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [description, setDescription] = useState("")
  const [points, setPoints] = useState("100")
  const [dockerImage, setDockerImage] = useState("")
  const [dockerPorts, setDockerPorts] = useState<Record<string, number | null>>({})
  const [environmentVars, setEnvironmentVars] = useState<Record<string, string>>({})
  const [startupCommand, setStartupCommand] = useState("")
  const [staticFlag, setStaticFlag] = useState("")
  const [flagGenerationScript, setFlagGenerationScript] = useState("")
  const [validationScript, setValidationScript] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [dockerfile, setDockerfile] = useState("")
  const [dockerContext, setDockerContext] = useState<{
    files: Record<string, { content: string; type: string }>
    args: Record<string, string>
  }>({
    files: {},
    args: {},
  })
  const [setupSSH, setSetupSSH] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Docker build arguments UI state
  const [newArgKey, setNewArgKey] = useState("")
  const [newArgValue, setNewArgValue] = useState("")

  // Modifier la fonction fetchReferenceData pour mieux gérer les données
  const fetchReferenceData = async () => {
    try {
      setLoading(true)
      console.log("Récupération des données de référence...")

      // Récupérer les données des templates Docker
      const templatesResponse = await authFetchAdmin(`${BASE_URL}/api/ctf/docker-templates/`)
      if (!templatesResponse.ok) {
        throw new Error("Erreur lors de la récupération des modèles Docker")
      }

      const templatesData = await templatesResponse.json()
      console.log("Données reçues:", templatesData)

      // Mettre à jour l'état avec toutes les données reçues
      setTemplateData({
        challenge_types: templatesData.challenge_types || [],
        docker_templates: templatesData.docker_templates || [],
        categories: templatesData.categories || [],
        difficulty_levels: templatesData.difficulty_levels || {},
      })
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error)
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Remplacer l'useEffect existant par celui-ci
  useEffect(() => {
    fetchReferenceData()
  }, [])

  // Modifier la fonction useEffect qui gère le changement de type de défi
  useEffect(() => {
    if (challengeTypeId && templateData) {
      console.log("Recherche du template pour le type de défi:", challengeTypeId)
      console.log("Templates disponibles:", templateData.docker_templates)

      // Trouver le template correspondant au type de défi sélectionné
      const template = templateData.docker_templates.find(
        (t) => t.challenge_type.id === Number.parseInt(challengeTypeId),
      )

      if (template) {
        console.log("Template trouvé:", template)
        setSelectedTemplate(template)
        setDockerfile(template.dockerfile)

        // Convertir le tableau de ports en objet
        const portsObject: Record<string, number | null> = {}
        template.default_ports.forEach((port) => {
          portsObject[port] = null
        })
        setDockerPorts(portsObject)

        // Définir la commande de démarrage si disponible
        if (template.common_commands && template.common_commands.length > 0) {
          setStartupCommand(template.common_commands[0])
        }

        // Définir l'image Docker et la configuration SSH en fonction du type de défi
        const challengeType = templateData.challenge_types.find((t) => t.id === Number.parseInt(challengeTypeId))
        if (challengeType) {
          if (challengeType.slug === "ssh") {
            setDockerImage("alpine:latest")
            setSetupSSH(true)
          } else if (challengeType.slug === "web") {
            setDockerImage("nginx:alpine")
            setSetupSSH(false)
          } else {
            // Pour les autres types, utiliser une image par défaut
            setDockerImage("alpine:latest")
            setSetupSSH(false)
          }
        }
      } else {
        console.log("Aucun template trouvé pour le type de défi:", challengeTypeId)
        setSelectedTemplate(null)
      }
    }
  }, [challengeTypeId, templateData])

  const handleAddContextArg = () => {
    if (newArgKey && newArgValue) {
      setDockerContext((prev) => ({
        ...prev,
        args: {
          ...prev.args,
          [newArgKey]: newArgValue,
        },
      }))
      setNewArgKey("")
      setNewArgValue("")
    }
  }

  const handleRemoveContextArg = (key: string) => {
    setDockerContext((prev) => {
      const newArgs = { ...prev.args }
      delete newArgs[key]
      return {
        ...prev,
        args: newArgs,
      }
    })
  }

  const handleFilesAdded = (files: { name: string; content: string; type: string }[]) => {
    setDockerContext((prev) => {
      const newFiles = { ...prev.files }

      files.forEach((file) => {
        newFiles[file.name] = {
          content: file.content,
          type: file.type,
        }
      })

      return {
        ...prev,
        files: newFiles,
      }
    })
  }

  const handleRemoveFile = (filename: string) => {
    setDockerContext((prev) => {
      const newFiles = { ...prev.files }
      delete newFiles[filename]
      return {
        ...prev,
        files: newFiles,
      }
    })
  }

  // Remplacer la fonction handleSubmit pour utiliser authFetchAdmin
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !challengeTypeId || !difficulty || !description || !points) {
      setError("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Convertir le format des fichiers pour l'API
      const apiFiles: Record<string, string> = {}
      Object.entries(dockerContext.files).forEach(([filename, { content }]) => {
        apiFiles[filename] = content
      })

      const challengeData = {
        title,
        challenge_type_id: Number.parseInt(challengeTypeId),
        difficulty,
        description,
        points: Number.parseInt(points),
        docker_image: dockerImage,
        docker_ports: dockerPorts,
        environment_vars: environmentVars,
        startup_command: startupCommand,
        static_flag: staticFlag,
        flag_generation_script: flagGenerationScript,
        validation_script: validationScript,
        is_active: isActive,
        dockerfile,
        docker_context: {
          files: apiFiles,
          args: dockerContext.args,
        },
        setup_ssh: setupSSH,
        category_ids: selectedCategories.map((id) => Number.parseInt(id)),
      }

      const response = await authFetchAdmin(`${BASE_URL}/api/ctf/challenges/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(challengeData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la création du défi")
      }

      const data = await response.json()

      setSuccess("Défi créé avec succès !")
      toast({
        title: "Succès !",
        description: "Le défi a été créé avec succès.",
        variant: "default",
      })

      // Redirect to the challenge list after a short delay
      setTimeout(() => {
        router.push("/admin/challenges")
      }, 2000)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Une erreur inconnue s'est produite")
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Une erreur inconnue s'est produite",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading && !templateData) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Please wait while we load the necessary data.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-10">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Modifier la couleur de fond principale
  return (
    <div className="container mx-auto py-10">
      <Card className="bg-[#0f1729]">
        <CardHeader className="bg-gray-900 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-white">Add New Challenge</CardTitle>
              <CardDescription className="text-gray-300">
                Create a new CTF challenge with Docker configuration
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/challenges")}
              className="border-gray-700 text-gray-200 hover:bg-gray-800"
            >
              Back to Challenges
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-5 mb-8 bg-gray-900">
                <TabsTrigger value="basic" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white">
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="docker" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white">
                  Docker Config
                </TabsTrigger>
                <TabsTrigger value="flags" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white">
                  Flags & Validation
                </TabsTrigger>
                <TabsTrigger value="files" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white">
                  Context Files
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
                >
                  Advanced
                </TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}

              <TabsContent value="basic" className="bg-gray-900 p-6 rounded-md shadow-sm">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-gray-200">
                        Challenge Title *
                      </Label>
                      <Input
                        id="title"
                        placeholder="Enter challenge title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="challenge-type" className="text-gray-200">
                        Challenge Type *
                      </Label>
                      <Select value={challengeTypeId} onValueChange={setChallengeTypeId}>
                        <SelectTrigger id="challenge-type" className="bg-gray-800 border-gray-700 text-gray-200">
                          <SelectValue placeholder="Select challenge type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                          {templateData?.challenge_types.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-200">Difficulty Level *</Label>
                    <RadioGroup value={difficulty} onValueChange={setDifficulty} className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="easy" id="easy" />
                        <Label htmlFor="easy" className="cursor-pointer text-gray-200">
                          <Badge
                            variant="outline"
                            className="bg-green-900/50 text-green-400 hover:bg-green-800 border-green-700"
                          >
                            Easy
                          </Badge>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium" className="cursor-pointer text-gray-200">
                          <Badge
                            variant="outline"
                            className="bg-yellow-900/50 text-yellow-400 hover:bg-yellow-800 border-yellow-700"
                          >
                            Medium
                          </Badge>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hard" id="hard" />
                        <Label htmlFor="hard" className="cursor-pointer text-gray-200">
                          <Badge
                            variant="outline"
                            className="bg-red-900/50 text-red-400 hover:bg-red-800 border-red-700"
                          >
                            Hard
                          </Badge>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="points" className="text-gray-200">
                      Points *
                    </Label>
                    <Input
                      id="points"
                      type="number"
                      min="10"
                      step="10"
                      placeholder="100"
                      value={points}
                      onChange={(e) => setPoints(e.target.value)}
                      required
                      className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
                    />
                    <p className="text-sm text-gray-400">
                      Recommended: Easy (50-100), Medium (150-300), Hard (350-500)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-200">
                      Description *
                    </Label>
                    <div className="bg-gray-800 rounded-md border border-gray-700">
                      <RichTextEditor
                        value={description}
                        onChange={setDescription}
                        placeholder="Enter challenge description, instructions, and hints..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categories" className="text-gray-200">
                      Categories
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {templateData?.categories.map((category) => (
                        <Badge
                          key={category.id}
                          variant={selectedCategories.includes(category.id.toString()) ? "default" : "outline"}
                          className={`cursor-pointer ${selectedCategories.includes(category.id.toString())
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                            }`}
                          onClick={() => {
                            if (selectedCategories.includes(category.id.toString())) {
                              setSelectedCategories(selectedCategories.filter((id) => id !== category.id.toString()))
                            } else {
                              setSelectedCategories([...selectedCategories, category.id.toString()])
                            }
                          }}
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="is-active" checked={isActive} onCheckedChange={setIsActive} />
                    <Label htmlFor="is-active" className="text-gray-200">
                      Active
                    </Label>
                  </div>
                </div>
              </TabsContent>

              {/* Docker Config Tab */}

              <TabsContent value="docker" className="bg-gray-900 p-6 rounded-md shadow-sm">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="docker-image" className="text-gray-200">
                        Docker Base Image *
                      </Label>
                      <Input
                        id="docker-image"
                        placeholder="e.g., alpine:latest"
                        value={dockerImage}
                        onChange={(e) => setDockerImage(e.target.value)}
                        required
                        className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
                      />
                      <p className="text-sm text-gray-400">The base Docker image to use</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startup-command" className="text-gray-200">
                        Startup Command
                      </Label>
                      <Input
                        id="startup-command"
                        placeholder="e.g., /usr/sbin/sshd -D"
                        value={startupCommand}
                        onChange={(e) => setStartupCommand(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <DockerPorts
                    ports={dockerPorts}
                    onAddPort={(key, value) => {
                      setDockerPorts((prev) => ({
                        ...prev,
                        [key]: value,
                      }))
                    }}
                    onRemovePort={(key) => {
                      setDockerPorts((prev) => {
                        const newPorts = { ...prev }
                        delete newPorts[key]
                        return newPorts
                      })
                    }}
                  />

                  <EnvironmentVariables
                    variables={environmentVars}
                    onAddVariable={(key, value) => {
                      setEnvironmentVars((prev) => ({
                        ...prev,
                        [key]: value,
                      }))
                    }}
                    onRemoveVariable={(key) => {
                      setEnvironmentVars((prev) => {
                        const newVars = { ...prev }
                        delete newVars[key]
                        return newVars
                      })
                    }}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="dockerfile" className="text-gray-200">
                      Dockerfile
                    </Label>
                    <Textarea
                      id="dockerfile"
                      placeholder="FROM alpine:latest..."
                      className="font-mono h-64 bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
                      value={dockerfile}
                      onChange={(e) => setDockerfile(e.target.value)}
                    />
                    <p className="text-sm text-gray-400">
                      Define your custom Dockerfile. Leave empty to use the default template.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="setup-ssh" checked={setupSSH} onCheckedChange={setSetupSSH} />
                    <Label htmlFor="setup-ssh" className="text-gray-200">
                      Setup SSH Access
                    </Label>
                    <span className="text-sm text-gray-400 ml-2">
                      (Automatically configure SSH access for SSH challenges)
                    </span>
                  </div>
                </div>
              </TabsContent>

              {/* Flags & Validation Tab */}
              <TabsContent value="flags" className="bg-gray-900 p-6 rounded-md shadow-sm">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="static-flag" className="text-gray-200">
                      Static Flag
                    </Label>
                    <Input
                      id="static-flag"
                      placeholder="e.g., FLAG{th1s_1s_4_fl4g}"
                      value={staticFlag}
                      onChange={(e) => setStaticFlag(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
                    />
                    <p className="text-sm text-gray-400">
                      The flag that users need to find. For static validation type.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flag-generation" className="text-gray-200">
                      Flag Generation Script
                    </Label>
                    <Textarea
                      id="flag-generation"
                      placeholder="Python or shell script to generate dynamic flags..."
                      className="font-mono h-32 bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
                      value={flagGenerationScript}
                      onChange={(e) => setFlagGenerationScript(e.target.value)}
                    />
                    <p className="text-sm text-gray-400">
                      Optional script to generate dynamic flags. Leave empty for static flags.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validation-script" className="text-gray-200">
                      Validation Script
                    </Label>
                    <Textarea
                      id="validation-script"
                      placeholder="Script to validate user submissions..."
                      className="font-mono h-32 bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
                      value={validationScript}
                      onChange={(e) => setValidationScript(e.target.value)}
                    />
                    <p className="text-sm text-gray-400">
                      Optional script to validate user submissions. Leave empty for exact match validation.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Context Files Tab */}
              <TabsContent value="files" className="bg-gray-900 p-6 rounded-md shadow-sm">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-200">Docker Context Files</Label>
                    <p className="text-sm text-gray-400">
                      Add files that will be included in the Docker build context.
                    </p>

                    <FileUploadZone onFilesAdded={handleFilesAdded} />

                    <FileList files={dockerContext.files} onRemoveFile={handleRemoveFile} />
                  </div>
                </div>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="bg-gray-900 p-6 rounded-md shadow-sm">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-200">Docker Build Arguments</Label>
                    <p className="text-sm text-gray-400">
                      Add build arguments that will be passed to the Docker build process.
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-2">
                      <Input
                        placeholder="Argument name"
                        value={newArgKey}
                        onChange={(e) => setNewArgKey(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
                      />
                      <Input
                        placeholder="Argument value"
                        value={newArgValue}
                        onChange={(e) => setNewArgValue(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
                      />
                      <Button
                        type="button"
                        onClick={handleAddContextArg}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Add Argument
                      </Button>
                    </div>

                    {Object.keys(dockerContext.args).length > 0 && (
                      <div className="border border-gray-700 rounded-md p-4 mt-2 bg-gray-800/50">
                        <h4 className="text-sm font-medium mb-2 text-gray-200">Build Arguments:</h4>
                        <div className="space-y-2">
                          {Object.entries(dockerContext.args).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between bg-gray-900 p-2 rounded border border-gray-700"
                            >
                              <div className="text-gray-200">
                                <span className="font-mono">{key}</span> =
                                <span className="font-mono ml-2">{value}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveContextArg(key)}
                                className="text-red-400 hover:text-red-300 hover:bg-gray-800"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`${ADMIN_NAME}/challenges`)}
                disabled={loading}
                className="border-gray-700 text-gray-200 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {loading ? "Creating..." : "Create Challenge"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

