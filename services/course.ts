import type { Course } from "@/services/types/course"

// This is a mock function. In a real application, this would fetch data from an API or database.
export async function getCourseById(id: string): Promise<Course | null> {
  // Simulating an API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock course data
  const mockCourse: Course = {
    id,
    title: "Introduction à la Cybersécurité",
    description: "Un cours complet pour débutants en cybersécurité",
    level: "debutant",
    duration: "4 semaines",
    modules: [
      {
        id: "m1",
        title: "Les bases de la sécurité informatique",
        content: [
          { id: "c1", type: "text", content: "La cybersécurité est un domaine crucial dans notre ère numérique..." },
          { id: "img1", type: "image", url: "/images/cybersecurity-basics.png", position: "center" },
        ],
        quiz_questions: [],
        content_items: [],
        course_id: "",
        courseId: "",
        duration: "",
        quiz: [],
        completed: false
      },
    ],
    quiz: {
      id: "q1",
      questions: [],
      type: "multiple-choice"
    },
    slug: "",
    category: "",
    prerequisites: "",
    instructor: "",
    image: "",
    tags: [],
    students: 0,
    rating: 0,
    progress: 0
  }

  // In a real application, you would fetch the course based on the id
  // For now, we'll just return the mock course if the id is not empty
  return id ? mockCourse : null
}

