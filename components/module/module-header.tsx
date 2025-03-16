"use client"

import { Button } from "@/components/ui/button"
import {
  Clock,
  ArrowLeft,
  Pause,
  Play,
  List,
  Maximize2,
  Minimize2,
  Settings,
  BookOpen,
  CheckCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ModuleHeaderProps {
  courseId: string
  title: string
  duration: string
  currentStep: "content" | "quiz"
  setCurrentStep: (step: "content" | "quiz") => void
  isFullscreen: boolean
  toggleFullscreen: () => void
  isAutoScrolling: boolean
  toggleAutoScroll: () => void
  openTableOfContents: () => void
}

export function ModuleHeader({
  courseId,
  title,
  duration,
  currentStep,
  setCurrentStep,
  isFullscreen,
  toggleFullscreen,
  isAutoScrolling,
  toggleAutoScroll,
  openTableOfContents,
}: ModuleHeaderProps) {
  const router = useRouter()

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => router.push(`/learn/courses/${courseId}`)} className="hover:bg-white/10">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au cours
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white/70">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>

          <TooltipProvider>
            <div className="flex items-center gap-2">
              {currentStep === "content" && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={toggleAutoScroll}
                        className="h-8 w-8 rounded-full hover:bg-white/10"
                      >
                        {isAutoScrolling ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isAutoScrolling ? "Pause lecture automatique" : "Lecture automatique"}
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={openTableOfContents}
                        className="h-8 w-8 rounded-full hover:bg-white/10"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Table des matières</TooltipContent>
                  </Tooltip>
                </>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={toggleFullscreen}
                    className="h-8 w-8 rounded-full hover:bg-white/10"
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isFullscreen ? "Quitter le plein écran" : "Mode plein écran"}</TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-white/10">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-navy-900 border-white/10">
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => setCurrentStep("content")}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Contenu du module
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentStep("quiz")}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Quiz de validation
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => window.print()}>Imprimer le module</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TooltipProvider>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
    </>
  )
}

