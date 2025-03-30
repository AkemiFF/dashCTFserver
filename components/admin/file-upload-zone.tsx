"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useState, useRef, useCallback } from "react"

interface FileUploadZoneProps {
  onFilesAdded: (files: { name: string; content: string; type: string }[]) => void
  className?: string
}

export function FileUploadZone({ onFilesAdded, className = "" }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        const fileType = getFileType(file.name)

        if (isTextFile(file.name)) {
          // Lire comme texte pour les fichiers texte
          reader.onload = (e) => {
            if (e.target?.result) {
              onFilesAdded([
                {
                  name: file.name,
                  content: e.target.result as string,
                  type: "text",
                },
              ])
            }
          }
          reader.readAsText(file)
        } else {
          // Lire comme base64 pour les fichiers binaires
          reader.onload = (e) => {
            if (e.target?.result) {
              onFilesAdded([
                {
                  name: file.name,
                  content: e.target.result as string,
                  type: "binary",
                },
              ])
            }
          }
          reader.readAsDataURL(file)
        }
      })
    },
    [onFilesAdded],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        processFiles(files)
      }
    },
    [processFiles],
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        processFiles(files)
      }
    },
    [processFiles],
  )

  const handlePasteFromClipboard = useCallback(() => {
    navigator.clipboard.readText().then((text) => {
      if (text) {
        const filename = prompt("Enter filename for pasted content:", "pasted-file.txt")
        if (filename) {
          onFilesAdded([
            {
              name: filename,
              content: text,
              type: "text",
            },
          ])
        }
      }
    })
  }, [onFilesAdded])

  return (
    <div
      className={`border-2 border-dashed rounded-md p-6 transition-colors ${
        isDragging ? "border-blue-500 bg-blue-900/20" : "border-gray-600 bg-gray-800/50"
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-300 justify-center">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none"
            >
              <span>Upload files</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                ref={fileInputRef}
                onChange={handleFileInputChange}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-400">Any file type up to 10MB</p>
        </div>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-800 hover:bg-gray-700 border-gray-600 text-gray-200"
          >
            Select Files
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handlePasteFromClipboard}
            className="bg-gray-800 hover:bg-gray-700 border-gray-600 text-gray-200"
          >
            Paste from Clipboard
          </Button>
        </div>
      </div>
    </div>
  )
}

// Fonction pour déterminer si un fichier est un fichier texte
function isTextFile(filename: string): boolean {
  const textExtensions = [
    ".txt",
    ".md",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".html",
    ".css",
    ".scss",
    ".json",
    ".yml",
    ".yaml",
    ".xml",
    ".csv",
    ".sh",
    ".bash",
    ".py",
    ".rb",
    ".java",
    ".c",
    ".cpp",
    ".h",
    ".php",
    ".go",
    ".rs",
    ".swift",
    ".kt",
    ".conf",
    ".ini",
    ".cfg",
  ]

  const ext = filename.substring(filename.lastIndexOf(".")).toLowerCase()
  return textExtensions.includes(ext)
}

// Fonction pour obtenir le type de fichier
function getFileType(filename: string): string {
  const ext = filename.substring(filename.lastIndexOf(".")).toLowerCase()

  if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"].includes(ext)) {
    return "image"
  } else if ([".mp4", ".webm", ".avi", ".mov"].includes(ext)) {
    return "video"
  } else if ([".mp3", ".wav", ".ogg", ".flac"].includes(ext)) {
    return "audio"
  } else if ([".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"].includes(ext)) {
    return "document"
  } else if (isTextFile(filename)) {
    return "text"
  } else {
    return "binary"
  }
}

