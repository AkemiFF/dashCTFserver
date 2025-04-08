// Ce fichier est une solution temporaire pour tester l'interface sans API fonctionnelle
import type { Course, Quiz } from "@/services/types/course"

// Données de test pour les cours
const mockQuiz: Quiz = {
  id: "",
  questions: [],
  type: "multiple-choice"
}
const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction à JavaScript",
    description: "Apprenez les bases de JavaScript, le langage de programmation du web.",
    image: "/placeholder.svg?height=300&width=400",
    instructor: "Jean Dupont",
    level: "debutant",
    rating: 4.7,
    students: 1250,
    progress: 0,
    tags: ["JavaScript", "Web", "Programmation"],
    category: "web",
    duration: "10h",
    prerequisites: "Aucun",
    modules: [],
    slug: "",
    quiz: mockQuiz,
  },
  {
    id: "2",
    title: "React pour les débutants",
    description: "Découvrez React, la bibliothèque JavaScript pour créer des interfaces utilisateur.",
    image: "/placeholder.svg?height=300&width=400",
    instructor: "Marie Martin",
    level: "intermediaire",
    rating: 4.9,
    students: 980,
    progress: 35,
    tags: ["React", "JavaScript", "Frontend"],
    category: "web",
    duration: "15h",
    prerequisites: "JavaScript",
    modules: [],
    slug: "",
    quiz: mockQuiz,
  },
  {
    id: "3",
    title: "Python avancé",
    description: "Maîtrisez les concepts avancés de Python pour le développement et la data science.",
    image: "/placeholder.svg?height=300&width=400",
    instructor: "Pierre Lefort",
    level: "avance",
    rating: 4.8,
    students: 750,
    progress: 0,
    tags: ["Python", "Data Science", "Programmation"],
    category: "programmation",
    duration: "20h",
    prerequisites: "Python bases",
    modules: [],
    slug: "",
    quiz: mockQuiz,
  },
  {
    id: "4",
    title: "Cybersécurité fondamentale",
    description: "Apprenez les principes de base de la sécurité informatique et protégez vos systèmes.",
    image: "/placeholder.svg?height=300&width=400",
    instructor: "Sophie Dubois",
    level: "intermediaire",
    rating: 4.6,
    students: 620,
    progress: 0,
    tags: ["Sécurité", "Réseau", "Hacking éthique"],
    category: "securite",
    duration: "18h",
    prerequisites: "Bases en informatique",
    modules: [],
    slug: "",
    quiz: mockQuiz,
  },
  {
    id: "5",
    title: "Machine Learning avec TensorFlow",
    description: "Découvrez comment créer des modèles d'apprentissage automatique avec TensorFlow.",
    image: "/placeholder.svg?height=300&width=400",
    instructor: "Alexandre Chen",
    level: "avance",
    rating: 4.9,
    students: 890,
    progress: 15,
    tags: ["Machine Learning", "TensorFlow", "IA"],
    category: "data-science",
    duration: "25h",
    prerequisites: "Python, Statistiques",
    modules: [],
    slug: "",
    quiz: mockQuiz,
  }
]

// Fonction pour simuler un délai réseau
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Service API mock
export const mockApiService = {
  // Récupérer tous les cours
  async getCourses(): Promise<Course[]> {
    await delay(800) // Simuler un délai réseau
    return mockCourses
  },

  // Récupérer les cours populaires
  async getPopularCourses(): Promise<Course[]> {
    await delay(800)
    return mockCourses.sort((a, b) => b.students - a.students)
  },

  // Récupérer les cours récents
  async getRecentCourses(): Promise<Course[]> {
    await delay(800)
    return [...mockCourses].sort((a, b) => b.id.localeCompare(a.id))
  },

  // Récupérer les cours de l'utilisateur
  async getUserCourses(): Promise<Course[]> {
    await delay(800)
    return mockCourses.filter((course) => course.progress > 0)
  },

  // Rechercher des cours
  async searchCourses(query: string): Promise<Course[]> {
    await delay(800)
    const lowercaseQuery = query.toLowerCase()
    return mockCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(lowercaseQuery) ||
        course.description.toLowerCase().includes(lowercaseQuery) ||
        course.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    )
  },

  // Récupérer un cours par ID
  async getCourseById(id: string): Promise<Course | null> {
    await delay(800)
    const course = mockCourses.find((course) => course.id === id)
    return course || null
  },
}

