export interface Module {
  id: string
  title: string
  content: ModuleContent[]
}

export interface ModuleContent {
  type: "text" | "image" | "video"
  content: string
  position?: "left" | "right" | "center"
}

export interface Quiz {
  id: string
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

export interface Course {
  id: string
  title: string
  description: string
  level: string
  duration: string
  modules: Module[]
  quiz: Quiz
}

