"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
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
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { getAuthHeader, getAuthHeaderFormData } from "@/lib/auth"
import { BASE_URL } from "@/lib/host"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { BriefcaseBusiness, CheckCircle2, ChevronLeft, ChevronRight, Code2, GitBranch, Github, Gitlab, Globe, GraduationCap, Linkedin, MapPin, Plus, Terminal, Trash2, Twitter, User } from 'lucide-react'
import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"

interface ProfileOnboardingProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (data: any) => void
  initialData?: any
}

export function ProfileOnboarding({ open, onOpenChange, onComplete, initialData = {} }: ProfileOnboardingProps) {
  const [step, setStep] = useState(1)
  const [userData, setUserData] = useState({
    name: initialData.name || "",
    bio: initialData.bio || "",
    location: initialData.location || "",
    website: initialData.website || "",
    avatar: initialData.avatar || "/placeholder.svg?height=150&width=150",
    coverImage: initialData.coverImage || "/placeholder.svg?height=400&width=1200",
    github: initialData.github || "",
    gitlab: initialData.gitlab || "",
    twitter: initialData.twitter || "",
    linkedin: initialData.linkedin || "",
    skills: initialData.skills || [],
    user_projects: initialData.user_projects || [],
    education: initialData.education || [],
    experience: initialData.experience || [],
  })

  const [availableSkills, setAvailableSkills] = useState<any[]>([])
  const [isLoadingSkills, setIsLoadingSkills] = useState(false)

  const [newSkill, setNewSkill] = useState({
    name: "",
    slug: "",
    description: "",
    skill_type: null,
    icon: "",
    parent: null,
    related_skills: [],
    level: 50, // Nous gardons level pour l'interface utilisateur
    id: "",
  })

  useEffect(() => {
    if (step === 4) {
      fetchSkills()
    }
  }, [step])

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    link: "",
    language: "",
    image: null as File | null,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalSteps = 5

  useEffect(() => {
    setUserData({
      name: initialData.name ?? "",
      bio: initialData.bio ?? "",
      location: initialData.location ?? "",
      website: initialData.website ?? "",
      avatar: initialData.avatar ?? "/placeholder.svg?height=150&width=150",
      coverImage: initialData.coverImage ?? "/placeholder.svg?height=400&width=1200",
      github: initialData.github ?? "",
      gitlab: initialData.gitlab ?? "",
      twitter: initialData.twitter ?? "",
      linkedin: initialData.linkedin ?? "",
      skills: initialData.skills ?? [],
      user_projects: initialData.user_projects ?? [],
      education: initialData.education ?? [],
      experience: initialData.experience ?? [],
    })
  }, [initialData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const fetchSkills = async () => {
    try {
      setIsLoadingSkills(true)
      const response = await fetch(`${BASE_URL}/api/core/skills/`, {
        headers: {
          ...(await getAuthHeader()),
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Vérifier que data est un tableau, sinon utiliser data.results si c'est une structure paginée
        if (Array.isArray(data)) {
          setAvailableSkills(data)
        } else if (data && data.results && Array.isArray(data.results)) {
          setAvailableSkills(data.results)
        } else {
          console.error("Skills data is not an array:", data)
          setAvailableSkills([])
        }
      } else {
        console.error("Failed to fetch skills")
        setAvailableSkills([])
      }
    } catch (error) {
      console.error("Error fetching skills:", error)
      setAvailableSkills([])
    } finally {
      setIsLoadingSkills(false)
    }
  }

  const handleSkillChange = (skillId: string) => {
    const selectedSkill = availableSkills.find((skill) => skill.id === skillId)
    if (selectedSkill) {
      setNewSkill((prev) => ({
        ...selectedSkill,
        level: prev.level,
        id: selectedSkill.id,
        name: selectedSkill.name,
        description: selectedSkill.description,
        skill_type: selectedSkill.skill_type,
      }))
    }
  }

  const handleSkillLevelChange = (value: number[]) => {
    setNewSkill((prev) => ({ ...prev, level: value[0] }))
  }

  const handleSkillCategoryChange = (value: string) => {
    setNewSkill((prev) => ({ ...prev, category: value }))
  }

  const handleAddSkill = () => {
    if (!newSkill.name) return

    // Vérifier si la compétence existe déjà dans la liste
    const skillExists = userData.skills.some((skill: any) => skill.name === newSkill.name)
    if (skillExists) return

    setUserData((prev) => ({
      ...prev, // Garder toutes les propriétés existantes
      skills: [
        ...prev.skills,
        {
          ...newSkill,
          user_level: newSkill.level, // Stocker le niveau de l'utilisateur séparément
        },
      ],
    }))

    // Réinitialiser newSkill
    setNewSkill({
      name: "",
      slug: "",
      description: "",
      skill_type: null,
      icon: "",
      parent: null,
      related_skills: [],
      level: 50,
      id: "",
    })
  }

  const handleRemoveSkill = (index: number) => {
    setUserData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_: any, i: number) => i !== index),
    }))
  }

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewProject((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];  // Récupère le premier fichier sélectionné
    if (file) {
      const imageUrl = URL.createObjectURL(file);  // Crée une URL temporaire pour l'aperçu
      console.log(imageUrl);

      setNewProject((prev) => ({
        ...prev,
        image: file  // Stocke le fichier dans l'état
      }));
      // Réinitialise l'input pour permettre la sélection du même fichier
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddProject = () => {
    if (newProject.name.trim() === "" || newProject.description.trim() === "") return

    setUserData((prev) => ({
      ...prev,
      user_projects: [
        ...prev.user_projects,
        {
          ...newProject,
          id: Date.now(),
          stars: Math.floor(Math.random() * 300) + 50,
          forks: Math.floor(Math.random() * 100) + 10,
        },
      ],
    }))

    setNewProject({
      name: "",
      description: "",
      link: "",
      language: "",
      image: null as File | null,
    })
  }

  const handleRemoveProject = (index: number) => {
    setUserData((prev) => ({
      ...prev,
      user_projects: prev.user_projects.filter((_: any, i: number) => i !== index),
    }))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = () => {
    handleSendData()
  }
  const handleSendData = async () => {
    try {
      const formData = new FormData();

      // Ajouter les champs simples
      formData.append("name", userData.name);
      formData.append("bio", userData.bio);
      formData.append("location", userData.location);
      formData.append("website", userData.website);
      formData.append("avatar", userData.avatar.file);
      formData.append("coverImage", userData.avatar.file);
      formData.append("github", userData.github);
      formData.append("gitlab", userData.gitlab);
      formData.append("twitter", userData.twitter);
      formData.append("linkedin", userData.linkedin);

      // Ajouter le profil avec les compétences
      formData.append("profile[display_name]", userData.name);
      formData.append("profile[location]", userData.location);

      userData.skills.forEach((skill: { id: string | Blob }, index: any) => {
        formData.append(`profile[skills][${index}]`, skill.id);
      });

      userData.user_projects.forEach((project: {
        image: {
          new(fileBits: BlobPart[],
            fileName: string, options?: FilePropertyBag): File; prototype: File
        }
        name: string | Blob; description: string | Blob; link: string | Blob; language: string | Blob
      }, index: any) => {
        formData.append(`user_projects[${index}][project_name]`, project.name);
        formData.append(`user_projects[${index}][description]`, project.description);
        formData.append(`user_projects[${index}][link]`, project.link);
        formData.append(`user_projects[${index}][language]`, project.language);
        if (project.image instanceof File) {
          formData.append(`user_projects[${index}][image]`, project.image);
        }
      });
      // Ajouter les projets avec les fichiers images
      // for (let i = 0; i < userData.user_projects.length; i++) {
      //   const project = userData.user_projects[i];

      //   // Convertir l'URL blob en File
      //   if (project.image instanceof File) {

      //     formData.append(`projects[${i}][image]`, project.image);
      //   }

      //   // Ajouter les autres champs du projet
      //   formData.append(`user_projects[${i}][name]`, project.name);
      //   formData.append(`user_projects[${i}][description]`, project.description);
      //   formData.append(`user_projects[${i}][link]`, project.link);
      //   formData.append(`user_projects[${i}][language]`, project.language);
      // }

      // Ajouter l'éducation
      for (let i = 0; i < userData.education.length; i++) {
        const education = userData.education[i];
        formData.append(`education[${i}][institution]`, education.institution);
        formData.append(`education[${i}][degree]`, education.degree);
        formData.append(`education[${i}][start_date]`, education.start_date);
        formData.append(`education[${i}][end_date]`, education.end_date);
      }

      // Ajouter l'expérience
      for (let i = 0; i < userData.experience.length; i++) {
        const experience = userData.experience[i];
        formData.append(`experience[${i}][company]`, experience.company);
        formData.append(`experience[${i}][position]`, experience.position);
        formData.append(`experience[${i}][start_date]`, experience.start_date);
        formData.append(`experience[${i}][end_date]`, experience.end_date);
        formData.append(`experience[${i}][description]`, experience.description);
      }

      // Envoyer la requête
      const response = await fetch(`${BASE_URL}/api/accounts/my_profile/`, {
        method: "PATCH",
        headers: {
          ...(await getAuthHeaderFormData()), // Le Content-Type sera automatiquement multipart/form-data
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur lors de la mise à jour:", errorData);
        return;
      }

      const updatedProfile = await response.json();
      onComplete(updatedProfile);
      onOpenChange(false);

    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  };
  const handleSendData2 = async () => {
    try {
      // Formater les données pour l'API
      const payload = {
        ...userData,
        profile: {
          skills: userData.skills.map((skill: any) => (skill.id)),
          display_name: userData.name
        }
      }

      console.log("Sending data to API:", payload);

      const response = await fetch(`${BASE_URL}/api/accounts/my_profile/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(await getAuthHeader())
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur lors de la mise à jour:", errorData);
        // Afficher une notification d'erreur
        return;
      }

      const updatedProfile = await response.json();
      onComplete(updatedProfile); // Transmettre les données mises à jour
      onOpenChange(false); // Fermer le modal

    } catch (error) {
      console.error("Erreur réseau:", error);
      // Afficher une notification d'erreur
    }
  };

  const handleSkip = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return userData.name.trim() !== ""
      case 2:
        return true // All fields are optional in step 2
      case 3:
        return true // All fields are optional in step 3
      case 4:
        return true // Skills are optional
      case 5:
        return true // Projects are optional
      default:
        return true
    }
  }

  const getStepIcon = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return <User className="h-5 w-5" />
      case 2:
        return <MapPin className="h-5 w-5" />
      case 3:
        return <Github className="h-5 w-5" />
      case 4:
        return <Terminal className="h-5 w-5" />
      case 5:
        return <GitBranch className="h-5 w-5" />
      default:
        return <User className="h-5 w-5" />
    }
  }

  const getStepTitle = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return "Basic Information"
      case 2:
        return "Location & Contact"
      case 3:
        return "Social Profiles"
      case 4:
        return "Skills & Expertise"
      case 5:
        return "Projects"
      default:
        return "Profile Setup"
    }
  }

  const getStepDescription = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return "Let's start with your basic profile information"
      case 2:
        return "Where are you located and how can people reach you?"
      case 3:
        return "Connect your social and developer accounts"
      case 4:
        return "What technologies and skills do you have?"
      case 5:
        return "Showcase your user_projects and contributions"
      default:
        return "Complete your profile to get the most out of Hackitech"
    }
  }

  const isStepSkippable = (stepNumber: number) => {
    return stepNumber > 1 // Only the first step is required
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col bg-navy-950 border border-white/10 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
              Complete Your Profile
            </DialogTitle>
            <div className="text-white/70 text-sm">
              Step {step} of {totalSteps}
            </div>
          </div>
          <DialogDescription className="text-white/70">{getStepDescription(step)}</DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-1 rounded-full mt-2">
          <div
            className="bg-gradient-to-r from-pink-500 to-purple-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between px-2 mt-1">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col items-center cursor-pointer transition-all",
                step === index + 1 ? "scale-110" : "opacity-70 hover:opacity-100",
              )}
              onClick={() => {
                // Allow going back to previous steps, but not skipping ahead
                if (index + 1 <= step) {
                  setStep(index + 1)
                }
              }}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  step > index + 1
                    ? "bg-green-500/20 text-green-500"
                    : step === index + 1
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      : "bg-white/10 text-white/50",
                )}
              >
                {step > index + 1 ? <CheckCircle2 className="h-4 w-4" /> : getStepIcon(index + 1)}
              </div>
              <span className="text-xs mt-1 hidden sm:block">{getStepTitle(index + 1).split(" ")[0]}</span>
            </div>
          ))}
        </div>

        <div className="py-2 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border-2 border-white/20 group-hover:border-pink-500 transition-all">
                        <AvatarImage src={userData.avatar.imageUrl} alt={userData.name || "User"} />
                        <AvatarFallback className="text-2xl bg-gradient-to-r from-pink-500 to-purple-500">
                          {userData.name
                            ? userData.name
                              .split(" ")
                              .map((n: any) => n[0])
                              .join("")
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Button size="sm" variant="ghost" className="text-xs" onClick={() => fileInputRef.current?.click()}>
                          Change
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const imageUrl = URL.createObjectURL(file);
                              setUserData((prev) => ({ ...prev, avatar: { file, imageUrl } }));
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-4 flex-1">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={userData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-white">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={userData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/50 min-h-[100px]"
                        />
                        <p className="text-xs text-white/50">
                          Brief description for your profile. URLs are hyperlinked.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Location & Contact */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">
                      Location
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                      <Input
                        id="location"
                        name="location"
                        value={userData.location}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-white">
                      Website
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                      <Input
                        id="website"
                        name="website"
                        value={userData.website}
                        onChange={handleInputChange}
                        placeholder="https://yourwebsite.com"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50 pl-10"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="font-medium text-white mb-2 flex items-center">
                      <BriefcaseBusiness className="h-4 w-4 mr-2 text-pink-500" />
                      Work Experience
                    </h4>
                    <p className="text-white/70 text-sm">
                      You can add your work experience later in your profile settings.
                    </p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="font-medium text-white mb-2 flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2 text-pink-500" />
                      Education
                    </h4>
                    <p className="text-white/70 text-sm">
                      You can add your education details later in your profile settings.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Social Profiles */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="github" className="text-white">
                      GitHub
                    </Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                      <Input
                        id="github"
                        name="github"
                        value={userData.github}
                        onChange={handleInputChange}
                        placeholder="github.com/username"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gitlab" className="text-white">
                      GitLab
                    </Label>
                    <div className="relative">
                      <Gitlab className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                      <Input
                        id="gitlab"
                        name="gitlab"
                        value={userData.gitlab}
                        onChange={handleInputChange}
                        placeholder="gitlab.com/username"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="text-white">
                      Twitter
                    </Label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                      <Input
                        id="twitter"
                        name="twitter"
                        value={userData.twitter}
                        onChange={handleInputChange}
                        placeholder="twitter.com/username"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-white">
                      LinkedIn
                    </Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                      <Input
                        id="linkedin"
                        name="linkedin"
                        value={userData.linkedin}
                        onChange={handleInputChange}
                        placeholder="linkedin.com/in/username"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50 pl-10"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Skills & Expertise */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="font-medium text-white mb-3">Add Your Skills</h4>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="skill-select" className="text-white text-sm">
                          Select Skill
                        </Label>
                        <Select value={newSkill.id} onValueChange={handleSkillChange} disabled={isLoadingSkills}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder={isLoadingSkills ? "Loading skills..." : "Select a skill"} />
                          </SelectTrigger>
                          <SelectContent className="bg-navy-950 border-white/10 text-white max-h-[300px]">
                            {Array.isArray(availableSkills) ? (
                              availableSkills.map((skill) => (
                                <SelectItem key={skill.id} value={skill.id}>
                                  {skill.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-skills">No skills available</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {newSkill.name && (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="skill-level" className="text-white text-sm">
                                Proficiency Level: {newSkill.level}%
                              </Label>
                            </div>
                            <Slider
                              id="skill-level"
                              value={[newSkill.level]}
                              min={0}
                              max={100}
                              step={5}
                              onValueChange={handleSkillLevelChange}
                              className="py-2"
                            />
                            <div className="flex justify-between text-xs text-white/50">
                              <span>Beginner</span>
                              <span>Intermediate</span>
                              <span>Expert</span>
                            </div>
                          </div>

                          {newSkill.description && (
                            <div className="p-3 bg-white/5 rounded-lg text-sm text-white/80">
                              <p>{newSkill.description}</p>
                            </div>
                          )}
                        </>
                      )}

                      <Button
                        onClick={handleAddSkill}
                        disabled={!newSkill.name}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skill
                      </Button>
                    </div>
                  </div>

                  {userData.skills.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-white">Your Skills</h4>
                      <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2">
                        {userData.skills.map((skill: any, index: number) => (
                          <div key={index} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center">
                                  <span className="font-medium">{skill.name}</span>
                                  {skill.skill_type && (
                                    <Badge className="ml-2 bg-white/10 text-white/70 hover:bg-white/20">
                                      {skill.skill_type}
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-sm">{skill.user_level || skill.level}%</span>
                              </div>
                              <div className="w-full bg-white/10 rounded-full h-1.5">
                                <div
                                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-1.5 rounded-full"
                                  style={{ width: `${skill.user_level || skill.level}%` }}
                                ></div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2 text-white/50 hover:text-red-400 hover:bg-red-500/10"
                              onClick={() => handleRemoveSkill(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {userData.skills.length === 0 && (
                    <div className="text-center py-4 text-white/50">
                      <p>No skills added yet. Add your first skill above.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Projects */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="font-medium text-white mb-3">Add Your Projects</h4>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="project-name" className="text-white text-sm">
                          Project Name
                        </Label>
                        <Input
                          id="project-name"
                          name="name"
                          value={newProject.name}
                          onChange={handleProjectChange}
                          placeholder="e.g. SecureAuth"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="project-description" className="text-white text-sm">
                          Description
                        </Label>
                        <Textarea
                          id="project-description"
                          name="description"
                          value={newProject.description}
                          onChange={handleProjectChange}
                          placeholder="Brief description of your project"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/50 min-h-[80px]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="project-link" className="text-white text-sm">
                            Project Link
                          </Label>
                          <Input
                            id="project-link"
                            name="link"
                            value={newProject.link}
                            onChange={handleProjectChange}
                            placeholder="https://github.com/username/project"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="project-language" className="text-white text-sm">
                            Primary Language
                          </Label>
                          <Input
                            id="project-language"
                            name="language"
                            value={newProject.language}
                            onChange={handleProjectChange}
                            placeholder="e.g. TypeScript"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="project-image" className="text-white text-sm">
                          Project Image
                        </Label>
                        <Input
                          type="file"
                          id="project-image"
                          accept="image/*"  // Limite les fichiers aux images
                          onChange={handleImageUpload}  // Déclenche la fonction lors de la sélection d'un fichier
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                          ref={fileInputRef}  // Référence pour réinitialiser l'input
                        />
                      </div>

                      <Button
                        onClick={handleAddProject}
                        disabled={!newProject.name.trim() || !newProject.description.trim()}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </Button>
                    </div>
                  </div>

                  {Array.isArray(userData.user_projects) && userData.user_projects.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-white">Your Projects</h4>
                      <div className="max-h-[200px] overflow-y-auto pr-2 space-y-3">
                        {userData.user_projects.map((project: any, index: number) => (
                          <div key={index} className="bg-white/5 rounded-lg p-3 flex flex-col">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium">{project.name}</h5>
                                <p className="text-sm text-white/70 line-clamp-2 mt-1">{project.description}</p>
                              </div>
                              {project.image && (
                                <img
                                  src={typeof project.image === 'string' ? project.image : URL.createObjectURL(project.image)}
                                  alt="Project preview"
                                  className="mt-2 rounded-lg max-w-full h-32 object-cover border border-white/10 shadow-lg"
                                />
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-white/50 hover:text-red-400 hover:bg-red-500/10"
                                onClick={() => handleRemoveProject(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center mt-2 text-xs text-white/50 space-x-3">
                              {project.language && (
                                <span className="flex items-center">
                                  <Code2 className="h-3 w-3 mr-1" />
                                  {project.language}
                                </span>
                              )}
                              {project.link && (
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center"
                                >
                                  <Globe className="h-3 w-3 mr-1" />
                                  View Project
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!Array.isArray(userData.user_projects) || userData.user_projects.length === 0) && (
                    <div className="text-center py-4 text-white/50">
                      <p>No user_projects added yet. Add your first project above.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <DialogFooter className="flex justify-between sticky bottom-0 bg-navy-950 pt-4 border-t border-white/10 mt-4">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="border-white/10 text-white hover:bg-white/5">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {isStepSkippable(step) && (
              <Button variant="ghost" onClick={handleSkip} className="text-white/70 hover:text-white hover:bg-white/5">
                Skip
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {step === totalSteps ? (
                "Complete"
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}