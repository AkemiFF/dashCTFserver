"use client"

import type React from "react"

import { RichTextEditor } from "@/components/admin/RichTextEditor"
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
  default_ports: Record<string, number | null>
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

interface DockerContextFile {
  name: string
  content: string
}

interface FormData {
  docker_context_files: DockerContextFile[]
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
  const [dockerContext, setDockerContext] = useState<{ files: Record<string, string>; args: Record<string, string> }>({
    files: {},
    args: {},
  })
  const [setupSSH, setSetupSSH] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Environment variables UI state
  const [newEnvKey, setNewEnvKey] = useState("")
  const [newEnvValue, setNewEnvValue] = useState("")

  // Docker context files UI state
  const [newFileName, setNewFileName] = useState("")
  const [newFileContent, setNewFileContent] = useState("")

  // Docker ports UI state
  const [newPortKey, setNewPortKey] = useState("")
  const [newPortValue, setNewPortValue] = useState<string>("")

  const [formData, setFormData] = useState<FormData>({
    docker_context_files: [{ name: "", content: "" }],
  })

  // Docker build arguments UI state
  const [newArgKey, setNewArgKey] = useState("")
  const [newArgValue, setNewArgValue] = useState("")

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/ctf/docker-templates/")
        if (!response.ok) {
          throw new Error("Failed to fetch template data")
        }
        const data = await response.json()
        setTemplateData(data)
      } catch (err) {
        setError("Failed to load template data. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplateData()
  }, [])

  useEffect(() => {
    if (challengeTypeId && templateData) {
      const template = templateData.docker_templates.find(
        (t) => t.challenge_type.id === Number.parseInt(challengeTypeId),
      )

      if (template) {
        setSelectedTemplate(template)
        setDockerfile(template.dockerfile)
        setDockerPorts(template.default_ports)

        // Set default Docker image based on challenge type
        const challengeType = templateData.challenge_types.find((t) => t.id === Number.parseInt(challengeTypeId))
        if (challengeType) {
          if (challengeType.slug === "ssh") {
            setDockerImage("alpine:latest")
            setSetupSSH(true)
          } else if (challengeType.slug === "web") {
            setDockerImage("nginx:alpine")
          }
        }
      } else {
        setSelectedTemplate(null)
      }
    }
  }, [challengeTypeId, templateData])

  const handleAddEnvironmentVar = () => {
    if (newEnvKey && newEnvValue) {
      setEnvironmentVars((prev) => ({
        ...prev,
        [newEnvKey]: newEnvValue,
      }))
      setNewEnvKey("")
      setNewEnvValue("")
    }
  }

  const handleRemoveEnvironmentVar = (key: string) => {
    setEnvironmentVars((prev) => {
      const newVars = { ...prev }
      delete newVars[key]
      return newVars
    })
  }

  const handleAddContextFile = () => {
    if (newFileName && newFileContent) {
      setDockerContext((prev) => ({
        ...prev,
        files: {
          ...prev.files,
          [newFileName]: newFileContent,
        },
      }))
      setNewFileName("")
      setNewFileContent("")
    }
  }

  const handleRemoveContextFile = (filename: string) => {
    setDockerContext((prev) => {
      const newFiles = { ...prev.files }
      delete newFiles[filename]
      return {
        ...prev,
        files: newFiles,
      }
    })
  }

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

  const handleAddPort = () => {
    if (newPortKey) {
      setDockerPorts((prev) => ({
        ...prev,
        [newPortKey]: newPortValue ? Number.parseInt(newPortValue) : null,
      }))
      setNewPortKey("")
      setNewPortValue("")
    }
  }

  const handleRemovePort = (key: string) => {
    setDockerPorts((prev) => {
      const newPorts = { ...prev }
      delete newPorts[key]
      return newPorts
    })
  }

  // Remplacer la fonction handleChallengeTypeChange par celle-ci pour corriger le problème de sélection
  const handleChallengeTypeChange = (typeId: string) => {
    console.log("Type ID sélectionné:", typeId)

    // Mettre à jour le type de défi dans le state
    // setFormData((prev) => ({ ...prev, challenge_type: typeId }));

    // Trouver le template Docker correspondant au type de défi
    // const template = dockerTemplates.find((t) => t.challenge_type === typeId);
    // if (template) {
    //   console.log("Template trouvé:", template);
    //   // Mettre à jour la configuration Docker basée sur le template
    //   setFormData((prev) => ({
    //     ...prev,
    //     dockerfile: template.dockerfile,
    //     docker_ports: template.default_ports.map((port) => ({
    //       containerPort: port,
    //       hostPort: null,
    //     })),
    //     startup_command: template.common_commands[0] || "",
    //   }));
    // }
  }

  // Ajouter ces fonctions pour l'importation de fichiers
  // Ajouter après la fonction removeContextFile

  // Fonction pour gérer l'importation de fichiers
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Mettre à jour le nom du fichier
    handleContextFileChange(index, "name", file.name)

    // Lire le contenu du fichier
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      handleContextFileChange(index, "content", content)
    }
    reader.readAsText(file)
  }

  // Fonction pour importer un fichier binaire (comme une image)
  const handleBinaryFileImport = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Mettre à jour le nom du fichier
    handleContextFileChange(index, "name", file.name)

    // Lire le contenu du fichier en base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      // Stocker le contenu en base64
      handleContextFileChange(index, "content", content)
    }
    reader.readAsDataURL(file)
  }

  const addContextFile = () => {
    setFormData((prev) => ({
      ...prev,
      docker_context_files: [...prev.docker_context_files, { name: "", content: "" }],
    }))
  }

  const removeContextFile = (index: number) => {
    setFormData((prev) => {
      const newFiles = [...prev.docker_context_files]
      newFiles.splice(index, 1)
      return { ...prev, docker_context_files: newFiles }
    })
  }

  const handleContextFileChange = (index: number, field: "name" | "content", value: string) => {
    setFormData((prev) => {
      const newFiles = [...prev.docker_context_files]
      newFiles[index] = { ...newFiles[index], [field]: value }
      return { ...prev, docker_context_files: newFiles }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !challengeTypeId || !difficulty || !description || !points) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      setError(null)

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
        docker_context: dockerContext,
        setup_ssh: setupSSH,
        category_ids: selectedCategories.map((id) => Number.parseInt(id)),
      }

      const response = await fetch("/api/ctf/challenges/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(challengeData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create challenge")
      }

      const data = await response.json()

      setSuccess("Challenge created successfully!")
      toast({
        title: "Success!",
        description: "Challenge created successfully.",
        variant: "default",
      })

      // Redirect to the challenge list after a short delay
      setTimeout(() => {
        router.push("/admin/challenges")
      }, 2000)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unknown error occurred",
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

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Add New Challenge</CardTitle>
              <CardDescription>Create a new CTF challenge with Docker configuration</CardDescription>
            </div>
            <Button variant="outline" onClick={() => router.push("/admin/challenges")}>
              Back to Challenges
            </Button>
          </div>
        </CardHeader>

        <CardContent>
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
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="docker">Docker Config</TabsTrigger>
                <TabsTrigger value="flags">Flags & Validation</TabsTrigger>
                <TabsTrigger value="files">Context Files</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Challenge Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter challenge title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="challenge-type">Challenge Type *</Label>
                      <Select value={challengeTypeId} onValueChange={setChallengeTypeId}>
                        <SelectTrigger id="challenge-type">
                          <SelectValue placeholder="Select challenge type" />
                        </SelectTrigger>
                        <SelectContent>
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
                    <Label>Difficulty Level *</Label>
                    <RadioGroup value={difficulty} onValueChange={setDifficulty} className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="easy" id="easy" />
                        <Label htmlFor="easy" className="cursor-pointer">
                          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                            Easy
                          </Badge>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium" className="cursor-pointer">
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100">
                            Medium
                          </Badge>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hard" id="hard" />
                        <Label htmlFor="hard" className="cursor-pointer">
                          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">
                            Hard
                          </Badge>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="points">Points *</Label>
                    <Input
                      id="points"
                      type="number"
                      min="10"
                      step="10"
                      placeholder="100"
                      value={points}
                      onChange={(e) => setPoints(e.target.value)}
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Recommended: Easy (50-100), Medium (150-300), Hard (350-500)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <RichTextEditor
                      value={description}
                      onChange={setDescription}
                      placeholder="Enter challenge description, instructions, and hints..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categories">Categories</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {templateData?.categories.map((category) => (
                        <Badge
                          key={category.id}
                          variant={selectedCategories.includes(category.id.toString()) ? "default" : "outline"}
                          className="cursor-pointer"
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
                    <Label htmlFor="is-active">Active</Label>
                  </div>
                </div>
              </TabsContent>

              {/* Docker Config Tab */}
              <TabsContent value="docker">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="docker-image">Docker Base Image *</Label>
                      <Input
                        id="docker-image"
                        placeholder="e.g., alpine:latest"
                        value={dockerImage}
                        onChange={(e) => setDockerImage(e.target.value)}
                        required
                      />
                      <p className="text-sm text-gray-500">The base Docker image to use</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startup-command">Startup Command</Label>
                      <Input
                        id="startup-command"
                        placeholder="e.g., /usr/sbin/sshd -D"
                        value={startupCommand}
                        onChange={(e) => setStartupCommand(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Docker Ports</Label>
                    <div className="grid grid-cols-3 gap-4 mb-2">
                      <Input
                        placeholder="Port (e.g., 22/tcp)"
                        value={newPortKey}
                        onChange={(e) => setNewPortKey(e.target.value)}
                      />
                      <Input
                        placeholder="Host Port (empty for random)"
                        value={newPortValue}
                        onChange={(e) => setNewPortValue(e.target.value)}
                      />
                      <Button type="button" onClick={handleAddPort}>
                        Add Port
                      </Button>
                    </div>

                    {Object.keys(dockerPorts).length > 0 && (
                      <div className="border rounded-md p-4 mt-2">
                        <h4 className="text-sm font-medium mb-2">Configured Ports:</h4>
                        <div className="space-y-2">
                          {Object.entries(dockerPorts).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div>
                                <span className="font-mono">{key}</span> →
                                <span className="font-mono ml-2">{value === null ? "random" : value}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePort(key)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Environment Variables</Label>
                    <div className="grid grid-cols-3 gap-4 mb-2">
                      <Input placeholder="Key" value={newEnvKey} onChange={(e) => setNewEnvKey(e.target.value)} />
                      <Input placeholder="Value" value={newEnvValue} onChange={(e) => setNewEnvValue(e.target.value)} />
                      <Button type="button" onClick={handleAddEnvironmentVar}>
                        Add Variable
                      </Button>
                    </div>

                    {Object.keys(environmentVars).length > 0 && (
                      <div className="border rounded-md p-4 mt-2">
                        <h4 className="text-sm font-medium mb-2">Environment Variables:</h4>
                        <div className="space-y-2">
                          {Object.entries(environmentVars).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div>
                                <span className="font-mono">{key}</span> =
                                <span className="font-mono ml-2">{value}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveEnvironmentVar(key)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dockerfile">Dockerfile</Label>
                    <Textarea
                      id="dockerfile"
                      placeholder="FROM alpine:latest..."
                      className="font-mono h-64"
                      value={dockerfile}
                      onChange={(e) => setDockerfile(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      Define your custom Dockerfile. Leave empty to use the default template.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="setup-ssh" checked={setupSSH} onCheckedChange={setSetupSSH} />
                    <Label htmlFor="setup-ssh">Setup SSH Access</Label>
                    <span className="text-sm text-gray-500 ml-2">
                      (Automatically configure SSH access for SSH challenges)
                    </span>
                  </div>
                </div>
              </TabsContent>

              {/* Flags & Validation Tab */}
              <TabsContent value="flags">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="static-flag">Static Flag</Label>
                    <Input
                      id="static-flag"
                      placeholder="e.g., FLAG{th1s_1s_4_fl4g}"
                      value={staticFlag}
                      onChange={(e) => setStaticFlag(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      The flag that users need to find. For static validation type.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flag-generation">Flag Generation Script</Label>
                    <Textarea
                      id="flag-generation"
                      placeholder="Python or shell script to generate dynamic flags..."
                      className="font-mono h-32"
                      value={flagGenerationScript}
                      onChange={(e) => setFlagGenerationScript(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      Optional script to generate dynamic flags. Leave empty for static flags.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validation-script">Validation Script</Label>
                    <Textarea
                      id="validation-script"
                      placeholder="Script to validate user submissions..."
                      className="font-mono h-32"
                      value={validationScript}
                      onChange={(e) => setValidationScript(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      Optional script to validate user submissions. Leave empty for exact match validation.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Context Files Tab */}
              <TabsContent value="files">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Docker Context Files</Label>
                    <p className="text-sm text-gray-500">
                      Add files that will be included in the Docker build context.
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-2">
                      <Input
                        placeholder="File path (e.g., app/config.json)"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                      />
                      <Textarea
                        placeholder="File content"
                        className="h-10"
                        value={newFileContent}
                        onChange={(e) => setNewFileContent(e.target.value)}
                      />
                      <Button type="button" onClick={handleAddContextFile}>
                        Add File
                      </Button>
                    </div>

                    {Object.keys(dockerContext.files).length > 0 && (
                      <div className="border rounded-md p-4 mt-2">
                        <h4 className="text-sm font-medium mb-2">Context Files:</h4>
                        <div className="space-y-4">
                          {Object.entries(dockerContext.files).map(([filename, content]) => (
                            <div key={filename} className="bg-gray-50 p-3 rounded">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-mono text-sm font-medium">{filename}</div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveContextFile(filename)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </Button>
                              </div>
                              <div className="bg-white p-2 rounded border font-mono text-xs overflow-auto max-h-24">
                                {content}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Docker Build Arguments</Label>
                    <p className="text-sm text-gray-500">
                      Add build arguments that will be passed to the Docker build process.
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-2">
                      <Input
                        placeholder="Argument name"
                        value={newArgKey}
                        onChange={(e) => setNewArgKey(e.target.value)}
                      />
                      <Input
                        placeholder="Argument value"
                        value={newArgValue}
                        onChange={(e) => setNewArgValue(e.target.value)}
                      />
                      <Button type="button" onClick={handleAddContextArg}>
                        Add Argument
                      </Button>
                    </div>

                    {Object.keys(dockerContext.args).length > 0 && (
                      <div className="border rounded-md p-4 mt-2">
                        <h4 className="text-sm font-medium mb-2">Build Arguments:</h4>
                        <div className="space-y-2">
                          {Object.entries(dockerContext.args).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div>
                                <span className="font-mono">{key}</span> =
                                <span className="font-mono ml-2">{value}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveContextArg(key)}
                                className="text-red-500 hover:text-red-700"
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
                onClick={() => router.push("/admin/challenges")}
                disabled={loading}
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

