"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, Share2, BookmarkPlus, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface PostProps {
  user: {
    name: string
    username: string
    avatar: string
  }
  content: string
  image?: string
  likes: number
  comments: number
  timestamp: string
}

export function Post({ user, content, image, likes, comments, timestamp }: PostProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  return (
    <Card className="bg-[#1A1A2E] border-purple-500/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border border-purple-500/20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-white">{user.name}</div>
            <div className="text-sm text-gray-400">@{user.username}</div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1A1A2E] border-purple-500/20">
            <DropdownMenuItem className="text-gray-400 hover:text-white">Copy link</DropdownMenuItem>
            <DropdownMenuItem className="text-gray-400 hover:text-white">Report post</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pt-3">
        <p className="text-gray-200 mb-4">{content}</p>
        {image && (
          <div className="relative rounded-lg overflow-hidden">
            <img src={image || "/placeholder.svg"} alt="Post content" className="w-full h-auto" />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-purple-500/20 pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-6">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-500" onClick={handleLike}>
              <Heart className={`h-5 w-5 mr-1 ${isLiked ? "fill-purple-500 text-purple-500" : ""}`} />
              <span>{likesCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-500">
              <MessageCircle className="h-5 w-5 mr-1" />
              <span>{comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-500" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-yellow-500">
            <BookmarkPlus className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

