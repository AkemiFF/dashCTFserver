import type { Course, Module, QuizQuestion } from "@/services/types/course"
import apiClient, { apiAdmin } from "./api-client"

// Type pour les réponses de quiz
interface QuizSubmissionResponse {
  score: number
  total: number
  feedback: Record<string, { correct: boolean; feedback?: string }>
}
interface QuizQuestionCreate {
  question: string
  type: "multiple-choice" | "open-ended"
  order: number
  options: { text: string; is_correct: boolean }[]
}
// Service pour interagir avec l'API des cours
export const CourseApiService = {
  // Récupérer tous les cours
  getAllCourses: async (): Promise<Course[]> => {
    try {
      const response = await apiClient.get("/learn/courses")
      return response.data
    } catch (error) {
      console.error("Error fetching courses:", error)
      throw error
    }
  },
  getAllCoursesAdmin: async (): Promise<Course[]> => {
    try {
      const response = await apiAdmin.get("/learn/courses")
      const res = response.data
      return res.results
    } catch (error) {
      console.error("Error fetching courses:", error)
      throw error
    }
  },
  getAllModules: async (): Promise<Module[]> => {
    try {
      const response = await apiAdmin.get("/learn/modules/")
      const res = response.data.results
      return res
    } catch (error) {
      console.error("Error fetching courses:", error)
      throw error
    }
  },

  // Récupérer un cours par son ID
  getCourseById: async (id: string): Promise<Course> => {
    try {
      const response = await apiClient.get(`/learn/courses/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error)
      throw error
    }
  },

  // Récupérer un module par son ID
  getModuleById: async (courseId: string, moduleId: string): Promise<Module> => {
    try {
      const response = await apiClient.get(`/learn/modules/${moduleId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching module ${moduleId}:`, error)
      throw error
    }
  },
  getAllModulesQuizzes: async (moduleId: string): Promise<Module[]> => {
    try {
      const response = await apiClient.get(`/learn/modules/${moduleId}/quiz/`)
      return response.data
    } catch (error) {
      console.error(`Error fetching module ${moduleId}:`, error)
      throw error
    }
  },

  // Récupérer toutes les questions de quiz pour un module
  getAllQuizQuestions: async (moduleId: string): Promise<QuizQuestion[]> => {
    try {
      const response = await apiAdmin.get(`/learn/modules/${moduleId}/quiz/`)

      // Transformer les données de l'API au format attendu par le frontend
      return response.data.map((item: any) => ({
        id: item.id.toString(),
        question: item.question,
        type: item.type,
        options:
          item.options?.map((opt: any) => ({
            id: opt.id.toString(),
            text: opt.text,
            is_correct: opt.is_correct,
          })) || [],
        correctAnswer:
          item.type === "multiple-choice"
            ? item.options?.filter((opt: any) => opt.is_correct).map((opt: any) => opt.id.toString()) || []
            : undefined,
      }))
    } catch (error) {
      console.error(`Error fetching quiz questions for module ${moduleId}:`, error)
      throw error
    }
  },
  createQuizQuestion: async (moduleId: string, questionData: QuizQuestionCreate): Promise<QuizQuestion> => {
    try {
      const response = await apiAdmin.post(`/learn/admin/modules/${moduleId}/quizzes/`, questionData)
      return response.data
    } catch (error) {
      console.error(`Error creating quiz question for module ${moduleId}:`, error)
      throw error
    }
  },
  // Mettre à jour une question de quiz existante
  updateQuizQuestion: async (
    moduleId: string,
    questionId: string,
    questionData: QuizQuestionCreate,
  ): Promise<QuizQuestion> => {
    try {
      const response = await apiAdmin.put(`/learn/modules/${moduleId}/quiz/${questionId}/`, questionData)
      return response.data
    } catch (error) {
      console.error(`Error updating quiz question ${questionId}:`, error)
      throw error
    }
  },

  // Supprimer une question de quiz
  deleteQuizQuestion: async (moduleId: string, questionId: string): Promise<void> => {
    try {
      await apiAdmin.delete(`/learn/modules/${moduleId}/quiz/${questionId}/`)
    } catch (error) {
      console.error(`Error deleting quiz question ${questionId}:`, error)
      throw error
    }
  },

  // Marquer un module comme complété
  completeModule: async (courseId: string, moduleId: string, timeSpent: number): Promise<void> => {
    try {
      await apiClient.post(`/learn/modules/${moduleId}/complete/`, {
        course_id: courseId,
        module_id: moduleId,
        time_spent: timeSpent,
      })
    } catch (error) {
      console.error(`Error completing module ${moduleId}:`, error)
      throw error
    }
  },

  CreateQuizModules: async (moduleId: string, data: any): Promise<Module[]> => {
    try {
      const response = await apiClient.post(`/learn/admin/modules/${moduleId}/quizzes/`, {
        data,
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching module ${moduleId}:`, error)
      throw error
    }
  },
  // Soumettre les réponses d'un quiz
  submitQuizAnswers: async (
    courseId: string,
    moduleId: string,
    answers: Record<string, string>,
  ): Promise<QuizSubmissionResponse> => {
    try {
      const response = await apiClient.post(`/learn/courses/${courseId}/modules/${moduleId}/submit-quiz`, {
        answers,
      })
      return response.data
    } catch (error) {
      console.error(`Error submitting quiz for module ${moduleId}:`, error)
      throw error
    }
  },

  // Récupérer la progression de l'utilisateur
  getUserProgress: async (): Promise<Record<string, number>> => {
    try {
      const response = await apiClient.get("/learn/user/progress")
      return response.data
    } catch (error) {
      console.error("Error fetching user progress:", error)
      throw error
    }
  },

  // Récupérer les cours populaires
  getPopularCourses: async (): Promise<Course[]> => {
    try {
      const response = await apiClient.get("/learn/courses/popular")
      return response.data
    } catch (error) {
      console.error("Error fetching popular courses:", error)
      throw error
    }
  },

  // Récupérer les cours récents
  getRecentCourses: async (): Promise<Course[]> => {
    try {
      const response = await apiClient.get("/learn/courses/recent")
      return response.data
    } catch (error) {
      console.error("Error fetching recent courses:", error)
      throw error
    }
  },

  // Récupérer les cours auxquels l'utilisateur est inscrit
  getEnrolledCourses: async (): Promise<Course[]> => {
    try {
      const response = await apiClient.get("/learn/user/courses")
      return response.data
    } catch (error) {
      console.error("Error fetching enrolled courses:", error)
      throw error
    }
  },

  // S'inscrire à un cours
  enrollInCourse: async (courseId: string): Promise<void> => {
    try {
      await apiClient.post(`/learn/courses/${courseId}/enroll/`)
    } catch (error) {
      console.error(`Error enrolling in course ${courseId}:`, error)
      throw error
    }
  },

  // Rechercher des cours
  searchCourses: async (query: string): Promise<Course[]> => {
    try {
      const response = await apiClient.get("/learn/courses/search", {
        params: { q: query },
      })
      return response.data
    } catch (error) {
      console.error(`Error searching courses with query "${query}":`, error)
      throw error
    }
  },
}

