"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Image, Smile, MapPin, Calendar, Send } from "lucide-react"

export function CreatePostCard() {
  const [postContent, setPostContent] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFocus = () => {
    setIsExpanded(true)
  }

  const handleBlur = () => {
    if (!postContent) {
      setIsExpanded(false)
    }
  }

  return (
    <motion.div
      layout
      transition={{ duration: 0.3 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4"
    >
      <div className="flex space-x-3">
        <Avatar className="h-10 w-10 border border-white/10">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@user" />
          <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">JD</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Quoi de neuf ?"
            className="min-h-[60px] bg-white/5 border-white/10 text-white placeholder:text-white/50 resize-none"
          />

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex justify-between items-center mt-3"
            >
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 text-white/70 hover:text-pink-500 hover:bg-white/5"
                >
                  <Image className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 text-white/70 hover:text-pink-500 hover:bg-white/5"
                >
                  <Smile className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 text-white/70 hover:text-pink-500 hover:bg-white/5"
                >
                  <MapPin className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 text-white/70 hover:text-pink-500 hover:bg-white/5"
                >
                  <Calendar className="h-5 w-5" />
                </Button>
              </div>
              <Button
                disabled={!postContent.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Publier
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

