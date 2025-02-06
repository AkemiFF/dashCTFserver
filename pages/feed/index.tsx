"use client"

import { NewPostForm } from "@/components/new-post-form"
import { PostCard } from "@/components/post-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Layout from "@/components/layout"
import { useState } from "react"

interface Post {
  id: string
  author: string
  content: string
  timestamp: string
  likes: number
  comments: Comment[]
  image?: string
}

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
}

const initialPosts: Post[] = [
  {
    id: "1",
    author: "Alice",
    content: "Je viens de résoudre le défi Web Exploitation 101 ! C'était vraiment intéressant. 🎉",
    timestamp: "2023-05-15T10:30:00Z",
    likes: 15,
    comments: [
      {
        id: "c1",
        author: "Bob",
        content: "Bien joué ! J'ai trouvé ce défi particulièrement difficile. 💪",
        timestamp: "2023-05-15T11:00:00Z",
      },
    ],
    image: "https://picsum.photos/seed/picsum/800/400",
  },
  {
    id: "2",
    author: "Charlie",
    content:
      "Quelqu'un a-t-il des conseils pour le défi de cryptographie ? 🤔\n\n```python\nfrom Crypto.Cipher import AES\n# ...\n```",
    timestamp: "2023-05-14T16:45:00Z",
    likes: 8,
    comments: [],
  },
]

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [filter, setFilter] = useState<"all" | "images">("all")

  const addPost = (newPost: Omit<Post, "id" | "likes" | "comments">) => {
    setPosts([
      {
        ...newPost,
        id: Date.now().toString(),
        likes: 0,
        comments: [],
      },
      ...posts,
    ])
  }

  const addComment = (postId: string, newComment: Omit<Comment, "id">) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
            ...post,
            comments: [...post.comments, { ...newComment, id: Date.now().toString() }],
          }
          : post,
      ),
    )
  }

  const deletePost = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId))
  }

  const deleteComment = (postId: string, commentId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
            ...post,
            comments: post.comments.filter((comment) => comment.id !== commentId),
          }
          : post,
      ),
    )
  }

  const filteredPosts = filter === "all" ? posts : posts.filter((post) => post.image)

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Fil d'actualité</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Nouvelle publication</CardTitle>
              </CardHeader>
              <CardContent>
                <NewPostForm onSubmit={addPost} />
              </CardContent>
            </Card>
            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setFilter("all")}>
                  Tous
                </TabsTrigger>
                <TabsTrigger value="images" onClick={() => setFilter("images")}>
                  Images
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <ScrollArea className="h-[800px] pr-4">
              <div className="space-y-8">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onAddComment={addComment}
                    onDeletePost={deletePost}
                    onDeleteComment={deleteComment}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Statistiques du fil</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Nombre total de publications : {posts.length}</p>
                <p>Nombre total de commentaires : {posts.reduce((sum, post) => sum + post.comments.length, 0)}</p>
                <p>Publications avec images : {posts.filter((post) => post.image).length}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

