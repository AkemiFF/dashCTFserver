import { BASE_URL } from "@/lib/host"
import apiClient from "./api-client"
interface User {
  id: string
  rank: number
  name: string
  points: number
  category: "S" | "A" | "B" | "C"
  completedChallenges: number
  successRate: number
  badges: string[]
  joinedDate: string
  avatar?: string
}
class GamificationService {
  private baseUrl = `${BASE_URL}/api`

  async getLeaderboard(): Promise<User[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/accounts/leaderboard/`)
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to fetch leaderboard")
      }
      return response.data.results
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
      throw error
    }
  }

}

export const gamificationService = new GamificationService()

