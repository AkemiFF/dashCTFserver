// Challenge types
export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  points: number
  completions: number
  category: string
  tags?: string[]
  estimatedTime?: string
  isCompleted?: boolean
}

// Mock challenges data
const challenges: Challenge[] = [
  {
    id: "chall-1",
    title: "Web Application Penetration Testing",
    description: "Test your skills by finding vulnerabilities in this simulated e-commerce website.",
    difficulty: "Intermediate",
    points: 250,
    completions: 128,
    category: "Web Security",
    tags: ["XSS", "SQL Injection", "CSRF"],
    estimatedTime: "2 hours",
  },
  {
    id: "chall-2",
    title: "Network Traffic Analysis",
    description: "Analyze packet captures to identify suspicious network activities and potential breaches.",
    difficulty: "Advanced",
    points: 350,
    completions: 87,
    category: "Network Security",
    tags: ["Wireshark", "Packet Analysis", "Intrusion Detection"],
    estimatedTime: "3 hours",
  },
  {
    id: "chall-3",
    title: "Password Cracking Basics",
    description: "Learn the fundamentals of password cracking techniques and tools.",
    difficulty: "Beginner",
    points: 150,
    completions: 256,
    category: "Authentication",
    tags: ["Hashcat", "John the Ripper", "Dictionary Attacks"],
    estimatedTime: "1 hour",
  },
  {
    id: "chall-4",
    title: "Cryptography Challenge",
    description: "Decrypt various ciphers and encoded messages using cryptanalysis techniques.",
    difficulty: "Expert",
    points: 500,
    completions: 42,
    category: "Cryptography",
    tags: ["Encryption", "Ciphers", "Cryptanalysis"],
    estimatedTime: "4 hours",
  },
  {
    id: "chall-5",
    title: "Reverse Engineering Malware",
    description: "Analyze and reverse engineer a simulated malware sample to understand its behavior.",
    difficulty: "Expert",
    points: 450,
    completions: 56,
    category: "Malware Analysis",
    tags: ["Reverse Engineering", "Static Analysis", "Dynamic Analysis"],
    estimatedTime: "5 hours",
  },
]

// Challenge service functions
export const challengeService = {
  // Get all challenges
  getAllChallenges: async (): Promise<Challenge[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return challenges
  },

  // Get challenge by ID
  getChallengeById: async (id: string): Promise<Challenge | undefined> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return challenges.find((challenge) => challenge.id === id)
  },

  // Get featured challenge
  getFeaturedChallenge: async (): Promise<Challenge> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    // Return a random challenge as featured
    return challenges[Math.floor(Math.random() * challenges.length)]
  },

  // Get challenges by category
  getChallengesByCategory: async (category: string): Promise<Challenge[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400))
    return challenges.filter((challenge) => challenge.category === category)
  },

  // Get challenges by difficulty
  getChallengesByDifficulty: async (difficulty: Challenge["difficulty"]): Promise<Challenge[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400))
    return challenges.filter((challenge) => challenge.difficulty === difficulty)
  },

  // Submit a challenge solution
  submitChallengeSolution: async (id: string, solution: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 700))

    // Mock validation logic (in a real app, this would validate against actual solutions)
    const isCorrect = Math.random() > 0.3 // 70% chance of success for demo purposes

    return {
      success: isCorrect,
      message: isCorrect ? "Congratulations! Your solution is correct." : "Incorrect solution. Please try again.",
    }
  },
}
