export type ContentItemType = "text" | "image" | "video" | "file" | "link"

export type ContentPosition = "left" | "center" | "right"

export type VideoPlatform = "youtube" | "vimeo" | "local" | "upload"

export interface BaseContentItem {
  id: string
  type: ContentItemType
}

export interface TextContent extends BaseContentItem {
  type: "text"
  content: string
}

export interface ImageContent extends BaseContentItem {
  type: "image"
  url: string
  position: ContentPosition

}

export interface VideoContent extends BaseContentItem {
  type: "video"
  url: string
  platform: VideoPlatform
}

export interface FileContent extends BaseContentItem {
  type: "file"
  url: string
  filename: string
  description: string
  fileSize: number
}

export interface LinkContent extends BaseContentItem {
  type: "link"
  url: string
  description: string
}

export type ContentItem = TextContent | ImageContent | VideoContent | FileContent | LinkContent

export interface QuizQuestion {
  id: string
  question: string
  type: "multiple-choice" | "open-ended"
  options?: string[]
  correctAnswer?: string | string[]
}
export interface Quiz {
  id: string
  questions: []
  type: "multiple-choice" | "open-ended"
  options?: string[]
  correctAnswer?: string | string[]
}

export interface Module {
  quiz_questions?: any[]
  content_items?: any[]
  id: string
  course_id: string
  courseId: string
  title: string
  duration: string
  content: ContentItem[]
  quiz: QuizQuestion[]
  completed: boolean
}

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  level: "debutant" | "intermediaire" | "avance"
  category: string
  duration: string
  prerequisites: string
  instructor: string
  image: string
  tags: string[]
  modules: Module[]
  quiz: Quiz
  students: number
  rating: number
  progress: number
}

