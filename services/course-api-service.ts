import type { Course, Module } from "@/types/course"
import apiClient from "./api-client"

// Type pour les réponses de quiz
interface QuizSubmissionResponse {
  score: number
  total: number
  feedback: Record<string, { correct: boolean; feedback?: string }>
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

  // Marquer un module comme complété
  completeModule: async (courseId: string, moduleId: string): Promise<void> => {
    try {
      await apiClient.post(`/learn/user/progress/complete-module`, {
        course_id: courseId,
        module_id: moduleId,
      })
    } catch (error) {
      console.error(`Error completing module ${moduleId}:`, error)
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
      await apiClient.post(`/learn/user/courses/${courseId}/enroll`)
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

