"use client"

import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import EmojiPicker, { Theme } from "emoji-picker-react";
import { AnimatePresence, motion } from "framer-motion";
import { ImageIcon, Smile, Video, X } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useCallback, useRef, useState } from "react";
// const MDEditor = dynamic(
//   () => {
//     return import("@uiw/react-md-editor")
//   },
//   {
//     ssr: false,
//     loading: () => <div className="h-[200px] w-full bg-gray-700 animate-pulse rounded-md"></div>,
//   },
// )
export function PostCreator() {
  const [content, setContent] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEmojiClick = (emojiObject: any) => {
    setContent((prevContent) => prevContent + emojiObject.emoji)
    setShowEmojiPicker(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setMediaFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files as FileList)])
    }
  }

  const handleRemoveFile = (index: number) => {
    setMediaFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle post submission logic here
    console.log("Submitting post:", content)
    console.log("Attached files:", mediaFiles)
    setContent("")
    setMediaFiles([])
    // Removed unused applyMarkdown function
    const prefix = ""; // Define your prefix here
    const suffix = ""; // Define your suffix here
    setContent((prevContent) => `${prevContent}${prefix}${suffix}`)
  }

  const renderMediaPreviews = useCallback(() => {
    return mediaFiles.map((file, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative"
      >
        {file.type.startsWith("image/") ? (
          <Image
            src={URL.createObjectURL(file) || "/placeholder.svg"}
            alt={`Uploaded image ${index + 1}`}
            width={100}
            height={100}
            className="rounded-md object-cover"
          />
        ) : (
          <video src={URL.createObjectURL(file)} className="w-[100px] h-[100px] rounded-md object-cover" />
        )}
        <button
          onClick={() => handleRemoveFile(index)}
          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </motion.div>
    ))
  }, [mediaFiles, handleRemoveFile]) // Added handleRemoveFile to dependencies

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg border border-green-500 shadow-lg shadow-green-500/20 p-4 mb-6"
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* <MDEditor
          value={content}
          onChange={(value: any) => setContent(value || "")}
          preview="edit"
          className="mb-4"
          height={200}
        /> */}
        <AnimatePresence>
          {mediaFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              {renderMediaPreviews()}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex space-x-2">
            <motion.button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-400 hover:text-green-500 transition-colors p-2 rounded-md hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ImageIcon className="w-6 h-6" />
            </motion.button>
            <motion.button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-400 hover:text-green-500 transition-colors p-2 rounded-md hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Video className="w-6 h-6" />
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-400 hover:text-green-500 transition-colors p-2 rounded-md hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Smile className="w-6 h-6" />
            </motion.button>
          </div>
          <motion.button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-mono w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Execute
          </motion.button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*,video/*"
          className="hidden"
          multiple
        />
      </form>
      {showEmojiPicker && (
        <div className="mt-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.DARK} />
        </div>
      )}
    </motion.div>
  )
}

