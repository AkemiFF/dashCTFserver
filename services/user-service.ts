// User types
export interface UserSkill {
  name: string
  icon: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  progress?: number
}

export interface UserBadge {
  id: string
  name: string
  description: string
  icon: string
  dateEarned: string
}

export interface UserCertification {
  id: string
  name: string
  issuer: string
  dateEarned: string
  expiryDate?: string
  credentialId: string
  credentialUrl?: string
}

export interface UserProfile {
  id: string
  username: string
  displayName: string
  email: string
  avatar?: string
  bio?: string
  role: string
  joinDate: string
  lastActive: string
  coursesCompleted: number
  challengesCompleted: number
  totalPoints: number
  rank?: string
  skills: UserSkill[]
  badges: UserBadge[]
  certifications: UserCertification[]
}

// Mock user data
const currentUser: UserProfile = {
  id: "user-1",
  username: "jeandupont",
  displayName: "Jean Dupont",
  email: "jean.dupont@example.com",
  avatar: "/placeholder.svg?height=56&width=56",
  bio: "Passionate about cybersecurity and ethical hacking. Always learning new techniques and tools.",
  role: "Ethical Hacker",
  joinDate: "2024-01-15",
  lastActive: "2025-04-26",
  coursesCompleted: 12,
  challengesCompleted: 28,
  totalPoints: 1240,
  rank: "Security Specialist",
  skills: [
    { name: "Web Security", icon: "Laptop", level: "Advanced", progress: 85 },
    { name: "Network", icon: "Zap", level: "Intermediate", progress: 65 },
    { name: "Cryptography", icon: "Lock", level: "Beginner", progress: 30 },
    { name: "OSINT", icon: "Search", level: "Intermediate", progress: 70 },
    { name: "Malware Analysis", icon: "Bug", level: "Beginner", progress: 25 },
  ],
  badges: [
    {
      id: "badge-1",
      name: "Web Warrior",
      description: "Completed all web security challenges",
      icon: "Shield",
      dateEarned: "2025-03-10",
    },
    {
      id: "badge-2",
      name: "Network Ninja",
      description: "Solved 10 network security challenges",
      icon: "Network",
      dateEarned: "2025-02-22",
    },
    {
      id: "badge-3",
      name: "Crypto Crusader",
      description: "Decrypted 5 advanced encryption challenges",
      icon: "Key",
      dateEarned: "2025-04-05",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Certified Ethical Hacker (CEH)",
      issuer: "EC-Council",
      dateEarned: "2024-12-15",
      expiryDate: "2027-12-15",
      credentialId: "ECC12345",
      credentialUrl: "#",
    },
    {
      id: "cert-2",
      name: "CompTIA Security+",
      issuer: "CompTIA",
      dateEarned: "2024-08-20",
      expiryDate: "2027-08-20",
      credentialId: "COMP98765",
      credentialUrl: "#",
    },
  ],
}

// User service functions
export const userService = {
  // Get current user profile
  getCurrentUserProfile: async (): Promise<UserProfile> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400))
    return currentUser
  },

  // Get user skills
  getUserSkills: async (): Promise<UserSkill[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return currentUser.skills
  },

  // Get user badges
  getUserBadges: async (): Promise<UserBadge[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return currentUser.badges
  },

  // Get user certifications
  getUserCertifications: async (): Promise<UserCertification[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return currentUser.certifications
  },

  // Update user profile
  updateUserProfile: async (updates: Partial<UserProfile>): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    // In a real app, this would update the database
    return {
      success: true,
      message: "Profile updated successfully.",
    }
  },

  // Get user stats
  getUserStats: async (): Promise<{ coursesCompleted: number; challengesCompleted: number; totalPoints: number }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      coursesCompleted: currentUser.coursesCompleted,
      challengesCompleted: currentUser.challengesCompleted,
      totalPoints: currentUser.totalPoints,
    }
  },
}
