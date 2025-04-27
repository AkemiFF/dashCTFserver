"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CTFChallenge, DownloadableFile } from "@/services/types/ctf"
import { motion } from "framer-motion"
import { Download, FileDown, FileText, Lightbulb } from "lucide-react"
import { useState } from "react"

interface ChallengeDescriptionProps {
  challenge: CTFChallenge
  onDownloadFile: (file: DownloadableFile) => void
  onUnlockHint: (hintId: number) => void
}

export function ChallengeDescription({ challenge, onDownloadFile, onUnlockHint }: ChallengeDescriptionProps) {
  const [activeTab, setActiveTab] = useState("description")

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <Tabs defaultValue="description" onValueChange={setActiveTab}>
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="description" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-2" />
            Description
          </TabsTrigger>

          {challenge.downloadable_files && challenge.downloadable_files.length > 0 && (
            <TabsTrigger value="files" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileDown className="h-4 w-4 mr-2" />
              Fichiers ({challenge.downloadable_files.length})
            </TabsTrigger>
          )}

          {challenge.hints && challenge.hints.length > 0 && (
            <TabsTrigger value="hints" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Lightbulb className="h-4 w-4 mr-2" />
              Indices ({challenge.hints.length})
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="description" className="mt-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: challenge.description }}
          />
        </TabsContent>

        {challenge.downloadable_files && challenge.downloadable_files.length > 0 && (
          <TabsContent value="files" className="mt-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <h3 className="text-lg font-medium text-white mb-2">Fichiers à télécharger</h3>

              <div className="grid gap-3">
                {challenge.downloadable_files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-900/30 rounded mr-3">
                        <FileDown className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{file.name}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(file.size || 1)}</p>
                      </div>
                    </div>

                    <Button size="sm" onClick={() => onDownloadFile(file)} className="bg-blue-600 hover:bg-blue-700">
                      <Download className="h-4 w-4 mr-1" />
                      Télécharger
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        )}

        {challenge.hints && challenge.hints.length > 0 && (
          <TabsContent value="hints" className="mt-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium text-white mb-2">Indices disponibles</h3>

              <div className="grid gap-4">
                {challenge.hints.map((hint) => (
                  <div key={hint.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    {hint.is_unlocked ? (
                      <div className="prose prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: hint.content }} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Lightbulb className="h-5 w-5 text-yellow-400 mr-2" />
                          <span className="text-gray-300">Indice verrouillé (coût: {hint.cost} points)</span>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => onUnlockHint(hint.id)}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          Débloquer
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

