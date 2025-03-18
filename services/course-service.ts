import type { Course, Module } from "@/types/course"

// Données de démonstration pour les cours
const mockCourses: Course[] = [
    {
        id: "1",
        title: "Introduction à la Cybersécurité",
        description: "Découvrez les fondamentaux de la cybersécurité et apprenez à protéger vos systèmes contre les menaces courantes.",
        level: "debutant",
        category: "securite",
        duration: "8 semaines",
        prerequisites: "Connaissances de base en informatique",
        instructor: "Dr. Sophie Martin",
        image: "/placeholder.svg?height=400&width=600",
        tags: ["Cybersécurité", "Sécurité informatique", "Débutant"],
        modules: [
            {
                id: "m1",
                courseId: "1",
                title: "Principes fondamentaux de la cybersécurité",
                duration: "2h 30min",
                content: [
                    {
                        id: "c1",
                        type: "text",
                        content: "<h2>Introduction à la cybersécurité</h2><p>La cybersécurité est l'ensemble des moyens techniques, organisationnels, juridiques et humains nécessaires à la mise en place de moyens visant à empêcher l'utilisation non autorisée, le mauvais usage, la modification ou le détournement du système d'information.</p><p>Dans ce module, nous allons explorer les concepts fondamentaux qui vous permettront de comprendre les enjeux et les mécanismes de base de la sécurité informatique.</p>",
                    },
                    {
                        id: "c2",
                        type: "image",
                        url: "/placeholder.svg?height=300&width=600",
                        position: "center",
                    },
                    {
                        id: "c3",
                        type: "text",
                        content: "<h3>Les trois piliers de la sécurité informatique</h3><ul><li><strong>Confidentialité</strong> : Garantir que l'information n'est accessible qu'aux personnes autorisées</li><li><strong>Intégrité</strong> : Garantir que l'information n'est pas altérée de façon non autorisée</li><li><strong>Disponibilité</strong> : Garantir que l'information est accessible quand elle est nécessaire</li></ul>",
                    },
                ],
                quiz: [
                    {
                        id: "q1",
                        question: "Quels sont les trois piliers fondamentaux de la cybersécurité ?",
                        type: "multiple-choice",
                        options: [
                            { id: "o3", text: "Authentification, Autorisation, Audit" },
                            { id: "o3", text: "Authentification, Autorisation, Audit" },
                        ],
                        correctAnswer: "Confidentialité, Intégrité, Disponibilité",
                    },
                    {
                        id: "q2",
                        question: "Expliquez avec vos propres mots pourquoi la cybersécurité est importante pour les entreprises aujourd'hui.",
                        type: "open-ended",
                    },
                ],
                completed: true,
                quiz_questions: [],
                content_items: [],
                course_id: ""
            },
            {
                id: "m2",
                courseId: "1",
                title: "Menaces et vulnérabilités courantes",
                duration: "3h 15min",
                content: [
                    {
                        id: "c1",
                        type: "text",
                        content: "<h2>Comprendre les menaces informatiques</h2><p>Les menaces informatiques évoluent constamment. Dans cette section, nous allons explorer les types d'attaques les plus courants et comprendre comment ils fonctionnent.</p>",
                    },
                    {
                        id: "c2",
                        type: "video",
                        url: "dQw4w9WgXcQ",
                        platform: "youtube",
                    },
                    {
                        id: "c3",
                        type: "text",
                        content: "<h3>Types d'attaques courants</h3><ul><li><strong>Phishing</strong> : Tentatives de vol d'informations sensibles en se faisant passer pour une entité de confiance</li><li><strong>Malware</strong> : Logiciels malveillants conçus pour endommager ou infiltrer un système</li><li><strong>Attaques par déni de service (DDoS)</strong> : Tentatives de rendre un service indisponible en le submergeant de trafic</li><li><strong>Attaques par force brute</strong> : Tentatives de deviner des mots de passe par essais successifs</li></ul>",
                    },
                ],
                quiz: [
                    {
                        id: "q1",
                        question: "Quelle technique d'attaque consiste à envoyer des emails frauduleux imitant une entité légitime ?",
                        type: "multiple-choice",
                        options: [{ id: "o3", text: "Authentification, Autorisation, Audit" }, { id: "o3", text: "Authentification, Autorisation, Audit" },

                        ],
                        correctAnswer: "Phishing",
                    },
                    {
                        id: "q2",
                        question: "Décrivez une expérience personnelle où vous avez identifié une tentative de phishing et comment vous l'avez reconnue.",
                        type: "open-ended",
                    },
                ],
                completed: false,
                quiz_questions: [],
                content_items: [],
                course_id: ""
            },
        ],
        students: 12500,
        rating: 4.8,
        progress: 35,
        slug: "",
        quiz: { id: "q1", questions: [], type: "multiple-choice" }
    },



]

// Service pour gérer les cours
export const CourseService = {
    // Récupérer tous les cours
    getAllCourses: (): Course[] => {
        return mockCourses
    },

    // Récupérer un cours par son ID
    getCourseById: (id: string): Course | undefined => {
        return mockCourses.find((course) => course.id === id)
    },

    // Récupérer un module par son ID
    getModuleById: (courseId: string, moduleId: string): Module | undefined => {
        const course = mockCourses.find((course) => course.id === courseId)
        return course?.modules.find((module) => module.id === moduleId)
    },

    // Marquer un module comme complété
    completeModule: (courseId: string, moduleId: string): void => {
        const course = mockCourses.find((course) => course.id === courseId)
        if (course) {
            const module = course.modules.find((module) => module.id === moduleId)
            if (module) {
                module.completed = true

                // Mettre à jour la progression du cours
                const completedModules = course.modules.filter((m) => m.completed).length
                course.progress = Math.round((completedModules / course.modules.length) * 100)
            }
        }
    },

    // Soumettre les réponses d'un quiz
    submitQuizAnswers: (
        courseId: string,
        moduleId: string,
        answers: Record<string, string>,
    ): { score: number; total: number; feedback: Record<string, { correct: boolean; feedback?: string }> } => {
        const module = CourseService.getModuleById(courseId, moduleId)
        if (!module) {
            throw new Error("Module not found")
        }

        const multipleChoiceQuestions = module.quiz.filter((q) => q.type === "multiple-choice")
        let score = 0
        const feedback: Record<string, { correct: boolean; feedback?: string }> = {}

        multipleChoiceQuestions.forEach((question) => {
            const answer = answers[question.id]
            const isCorrect = answer === question.correctAnswer

            if (isCorrect) {
                score++
            }

            feedback[question.id] = {
                correct: isCorrect,
                feedback: isCorrect ? "Bonne réponse !" : `La réponse correcte était : ${question.correctAnswer}`,
            }
        })

        // Si le score est suffisant, marquer le module comme complété
        if (score / multipleChoiceQuestions.length >= 0.7) {
            CourseService.completeModule(courseId, moduleId)
        }

        return {
            score,
            total: multipleChoiceQuestions.length,
            feedback,
        }
    },
}

