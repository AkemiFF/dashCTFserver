import type { Course } from "@/types/course"

// This is a mock function. In a real application, this would fetch data from an API or database.
export async function getCourseById(id: string): Promise<Course | null> {
  // Simulating an API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock course data
  const mockCourse: Course = {
    id,
    title: "Introduction à la Cybersécurité",
    description: "Un cours complet pour débutants en cybersécurité",
    level: "Débutant",
    duration: "4 semaines",
    modules: [
      {
        id: "m1",
        title: "Les bases de la sécurité informatique",
        content: [
          { type: "text", content: "La cybersécurité est un domaine crucial dans notre ère numérique..." },
          { type: "image", content: "/images/cybersecurity-basics.jpg", position: "center" },
        ],
      },
      {
        id: "m2",
        title: "Comprendre les menaces courantes",
        content: [
          { type: "text", content: "Il existe de nombreuses menaces dans le monde numérique, notamment..." },
          { type: "video", content: "/videos/common-threats.mp4", position: "left" },
        ],
      },
    ],
    quiz: {
      id: "q1",
      questions: [
        {
          id: "q1_1",
          question:
            "Quel est le principe de base de la cybersécurité qui garantit que les données ne sont accessibles qu'aux personnes autorisées ?",
          options: ["Intégrité", "Disponibilité", "Confidentialité", "Authenticité"],
          correctAnswer: 2,
        },
        {
          id: "q1_2",
          question:
            "Quelle technique est utilisée par les attaquants pour tromper les utilisateurs et les inciter à révéler des informations sensibles ?",
          options: ["Malware", "Phishing", "Cryptage", "Pare-feu"],
          correctAnswer: 1,
        },
      ],
    },
  }

  // In a real application, you would fetch the course based on the id
  // For now, we'll just return the mock course if the id is not empty
  return id ? mockCourse : null
}

