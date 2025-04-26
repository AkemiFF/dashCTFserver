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

export interface CTFChallenge {
  id: number
  title: string
  description: string
  points: number
  difficulty: "easy" | "medium" | "hard"
  challenge_type: ChallengeType
  categories: ChallengeCategory[]
  is_active: boolean
  is_solved?: boolean
  solved_count?: number
  attempt_count?: number
  created_at: string
  updated_at: string
  docker_status?: "pending" | "running" | "stopped" | "error"
  instance_url?: string
  instance_ports?: Record<string, number>
  downloadable_files?: DownloadableFile[]
  time_limit_minutes?: number
  hints?: ChallengeHint[]
}

export interface DownloadableFile {
  id: number
  name: string
  size: number
  url: string
  content_type: string
}

export interface ChallengeHint {
  id: number
  content: string
  cost: number
  is_unlocked: boolean
}

export interface ChallengeInstance {
  id: number
  challenge_id: number
  status: "pending" | "running" | "stopped" | "error"
  url?: string
  ports?: Record<string, number>
  created_at: string
  expires_at: string
  flag?: string
}

export interface FlagSubmission {
  challenge_id: number
  flag: string
}

export interface FlagSubmissionResult {
  success: boolean
  message: string
  points_earned?: number
  time_taken?: number
  first_blood?: boolean
}

export interface CTFLeaderboardEntry {
  user_id: number
  username: string
  avatar: string
  points: number
  solved_count: number
  last_solve_time: string
  rank: number
}

export interface UserChallengeStats {
  solved_count: number
  total_count: number
  points_earned: number
  categories: {
    name: string
    solved: number
    total: number
  }[]
}
