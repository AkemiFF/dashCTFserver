"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ThumbsUp, MessageCircle, Trash2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
}

interface Post {
  id: string
  author: string
  content: string
  timestamp: string
  likes: number
  comments: Comment[]
  image?: string
}

interface PostCardProps {
  post: Post
  onAddComment: (postId: string, comment: Omit<Comment, "id">) => void
  onDeletePost: (postId: string) => void
  onDeleteComment: (postId: string, commentId: string) => void
}

export function PostCard({ post, onAddComment, onDeletePost, onDeleteComment }: PostCardProps) {
  const [newComment, setNewComment] = useState("")
  const [showComments, setShowComments] = useState(false)

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(post.id, {
        author: "Admin",
        content: newComment,
        timestamp: new Date().toISOString(),
      })
      setNewComment("")
    }
  }

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.author}`} />
          <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{post.author}</h3>
          <p className="text-sm text-gray-500">{new Date(post.timestamp).toLocaleString()}</p>
        </div>
      </CardHeader>
      <CardContent>
        <ReactMarkdown className="prose dark:prose-invert max-w-none">{post.content}</ReactMarkdown>
        {post.image && (
          <img src={post.image || "/placeholder.svg"} alt="Post image" className="mt-4 rounded-lg max-w-full h-auto" />
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Button variant="ghost" size="sm">
            <ThumbsUp className="mr-2 h-4 w-4" />
            {post.likes}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="mr-2 h-4 w-4" />
            {post.comments.length}
          </Button>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette publication ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action ne peut pas être annulée. Cela supprimera définitivement la publication et tous ses
                commentaires.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeletePost(post.id)}>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
      {showComments && (
        <CardContent>
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.author}`} />
                  <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{comment.author}</h4>
                    <p className="text-sm text-gray-500">{new Date(comment.timestamp).toLocaleString()}</p>
                  </div>
                  <ReactMarkdown className="prose dark:prose-invert max-w-none">{comment.content}</ReactMarkdown>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce commentaire ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action ne peut pas être annulée. Cela supprimera définitivement le commentaire.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDeleteComment(post.id, comment.id)}>
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Textarea
              placeholder="Ajouter un commentaire..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2"
            />
            <Button onClick={handleAddComment}>Commenter</Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

