"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, CheckCircle2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

interface PostCardProps {
  post: {
    id: number
    user: {
      name: string
      avatar: string
      verified?: boolean
    }
    content: string
    image?: string
    likes: number
    comments: number
    shares: number
    timeAgo: string
  }
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden",
        featured && "transform-gpu rotate-0 hover:rotate-0",
      )}
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className={cn("border-2", featured ? "border-pink-500" : "border-white/10")}>
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              {post.user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <span className="font-semibold text-white">{post.user.name}</span>
              {post.user.verified && (
                <Badge className="ml-1 h-4 w-4 p-0 bg-pink-500 flex items-center justify-center">
                  <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                </Badge>
              )}
            </div>
            <div className="text-xs text-white/60">{post.timeAgo}</div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-navy-950/90 backdrop-blur-xl border-white/10 text-white">
            <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">Masquer ce post</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">Suivre {post.user.name}</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="hover:bg-white/5 cursor-pointer text-pink-500">Signaler</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-white/90 whitespace-pre-line">{post.content}</p>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className={cn("relative", featured ? "aspect-video" : "aspect-square")}>
          <Image src={post.image || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-white/70 hover:text-white hover:bg-white/5"
            onClick={handleLike}
          >
            <Heart className={cn("h-5 w-5", liked && "fill-pink-500 text-pink-500")} />
            <span>{likeCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-white/70 hover:text-white hover:bg-white/5"
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-white/70 hover:text-white hover:bg-white/5"
          >
            <Share2 className="h-5 w-5" />
            <span>{post.shares}</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full h-8 w-8",
            bookmarked ? "text-pink-500" : "text-white/70 hover:text-white hover:bg-white/10",
          )}
          onClick={() => setBookmarked(!bookmarked)}
        >
          <Bookmark className={cn("h-5 w-5", bookmarked && "fill-pink-500")} />
        </Button>
      </div>
    </motion.div>
  )
}

