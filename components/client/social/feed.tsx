"use client"

import { useState } from "react"
import { Post } from "./post"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Send } from "lucide-react"

export function SocialFeed() {
  const [newPost, setNewPost] = useState("")

  const posts = [
    {
      user: {
        name: "Alice Security",
        username: "alicesec",
        avatar: "/placeholder.svg",
      },
      content:
        "Just completed the Advanced SQL Injection course! Here are some key takeaways on preventing SQL injection attacks in your applications... 🔒",
      likes: 42,
      comments: 12,
      timestamp: "2h ago",
    },
    {
      user: {
        name: "Bob Hacker",
        username: "ethicalbob",
        avatar: "/placeholder.svg",
      },
      content: "Working on a new CTF challenge. Who wants to team up for the upcoming competition? 🏆",
      image: "/placeholder.svg",
      likes: 89,
      comments: 24,
      timestamp: "4h ago",
    },
    // Add more posts as needed
  ]

  return (
    <div className="space-y-6">
      <div className="bg-[#1A1A2E] rounded-lg p-4 border border-purple-500/20">
        <Textarea
          placeholder="Share your security knowledge..."
          className="bg-transparent border-gray-800 text-white mb-4"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <div className="flex justify-between items-center">
          <Button variant="ghost" className="text-gray-400 hover:text-purple-500">
            <ImagePlus className="h-5 w-5" />
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Send className="h-4 w-4 mr-2" />
            Post
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map((post, index) => (
          <Post key={index} {...post} />
        ))}
      </div>
    </div>
  )
}

