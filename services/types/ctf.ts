export interface CTFChallenge {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  points: number
  challenge_type: ChallengeType
  categories: ChallengeCategory[]
  hints: {
    id: number
    content: string
    cost: number
    is_unlocked: boolean
  }[]
  downloadable_files?: {
    id: number
    name: string
    url: string
    size?: number
  }[]
  created_at: string
  docker_status?: "running" | "stopped" | "error"
  instance_url?: string
  instance_ports?: Record<string, string>
  is_solved?: boolean
  is_active?: boolean
  solved_count?: number
  attempt_count?: number
  time_limit_minutes?: number
}
export interface ChallengeCategory {
  id: number
  name: string
  description: string
  slug: string
  icon?: string
}

export interface ChallengeType {
  id: number
  name: string
  slug: string
  validation_type: string
  icon: string
}

export interface ChallengeInstance {
  id: string
  challenge_id: string
  instance_id: string
  status: "pending" | "starting" | "running" | "error" | "expired" | "processing"
  url?: string
  ports?: Record<string, string>
  created_at: string
  expires_at: string
}

export interface FlagSubmission {
  challenge_id: string
  submitted_flag: string
}

export interface FlagSubmissionResult {
  success: boolean
  message: string
  time_taken?: number
  first_blood?: number
  points_earned?: number
}

export interface CTFLeaderboardEntry {
  user_id: number
  username: string
  avatar_url?: string
  points: number
  solved_challenges: number
  last_submission: string
}

export interface UserChallengeStats {
  total_points: number
  solved_challenges: number
  total_challenges: number
  categories: {
    name: string
    solved: number
    total: number
  }[]
  recent_activities: {
    challenge_id: string
    challenge_title: string
    action: "solved" | "attempted"
    timestamp: string
    points?: number
  }[]
  solved_count: number
  total_count: number
  points_earned: number
}

export interface DownloadableFile {
  id: number
  name: string
  url: string
}
