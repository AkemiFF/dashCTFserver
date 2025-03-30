"use client"

import { Button } from "@/components/ui/button"
import { FileIcon, ImageIcon, FileTextIcon, XIcon } from "lucide-react"
import { useState } from "react"

interface FileListProps {
  files: Record<string, { content: string; type: string }>
  onRemoveFile: (filename: string) => void
}

export function FileList({ files, onRemoveFile }: FileListProps) {
  const [expandedFile, setExpandedFile] = useState<string | null>(null)

  if (Object.keys(files).length === 0) {
    return null
  }

  const getFileIcon = (filename: string, type: string) => {
    if (type === "image" || filename.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i)) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />
    } else if (type === "text" || filename.match(/\.(txt|md|js|jsx|ts|tsx|html|css|json|yml|yaml|xml)$/i)) {
      return <FileTextIcon className="h-4 w-4 text-green-500" />
    } else {
      return <FileIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const renderFileContent = (content: string, type: string, filename: string) => {
    // Pour les images en base64
    if (content.startsWith("data:image/")) {
      return <img src={content || "/placeholder.svg"} alt={filename} className="max-h-32 max-w-full rounded" />
    }

    // Pour les fichiers binaires
    if (type === "binary" || !type) {
      return (
        <div className="text-xs text-gray-500 italic">
          Binary file - {content.length > 100 ? content.substring(0, 100) + "..." : content}
        </div>
      )
    }

    // Pour les fichiers texte
    return (
      <pre className="text-xs overflow-auto max-h-32 whitespace-pre-wrap">
        {content.length > 500 ? content.substring(0, 500) + "..." : content}
      </pre>
    )
  }

  // Modifier les couleurs pour le fond sombre
  return (
    <div className="border border-gray-700 rounded-md p-4 mt-4 bg-gray-800/50">
      <h4 className="text-sm font-medium mb-2 text-gray-200">Context Files:</h4>
      <div className="space-y-4">
        {Object.entries(files).map(([filename, { content, type }]) => (
          <div key={filename} className="bg-gray-800 p-3 rounded border border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getFileIcon(filename, type)}
                <span className="font-mono text-sm font-medium text-gray-200">{filename}</span>
                <span className="text-xs text-gray-400">({(content.length / 1024).toFixed(1)} KB)</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedFile(expandedFile === filename ? null : filename)}
                  className="text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                >
                  {expandedFile === filename ? "Collapse" : "Expand"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(filename)}
                  className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div
              className={`bg-gray-900 p-2 rounded border border-gray-700 font-mono ${expandedFile === filename ? "max-h-96" : "max-h-24"} overflow-auto`}
            >
              {renderFileContent(content, type, filename)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

