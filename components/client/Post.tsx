"use client"

import { useState } from "react"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { motion } from "framer-motion"

interface PostProps {
  author: string
  avatar: string
  content: string
  image?: string
  video?: string
  likes: number
  comments: number
  shares: number
}

export function Post({ author, avatar, content, image, video, likes, comments, shares }: PostProps) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg border border-green-500 shadow-lg shadow-green-500/20 p-4 mb-6"
    >
      <div className="flex items-center mb-4">
        <Image
          src={avatar || "/placeholder.svg"}
          alt={author}
          width={40}
          height={40}
          className="rounded-full mr-3 border-2 border-green-500"
        />
        <span className="font-semibold text-green-400">{author}</span>
      </div>
      <div className="mb-4 text-gray-300 font-mono">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      {image && (
        <div className="mb-4">
          <Image
            src={image || "/placeholder.svg"}
            alt="Post image"
            width={500}
            height={300}
            className="rounded-lg border border-green-500"
          />
        </div>
      )}
      {video && (
        <div className="mb-4">
          <video src={video} controls className="w-full rounded-lg border border-green-500" />
        </div>
      )}
      <div className="flex items-center justify-between text-gray-400">
        <button
          className={`flex items-center space-x-1 ${isLiked ? "text-red-500" : ""}`}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className="w-5 h-5" />
          <span>{likes}</span>
        </button>
        <button className="flex items-center space-x-1">
          <MessageCircle className="w-5 h-5" />
          <span>{comments}</span>
        </button>
        <button className="flex items-center space-x-1">
          <Share2 className="w-5 h-5" />
          <span>{shares}</span>
        </button>
      </div>
    </motion.div>
  )
}

