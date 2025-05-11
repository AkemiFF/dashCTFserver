import { BASE_URL } from "@/lib/host"
import type {
  CTFChallenge,
  ChallengeInstance,
  DownloadableFile,
  FlagSubmission,
  FlagSubmissionResult,
  UserChallengeStats
} from "@/services/types/ctf"
import apiClient from "./api-client"

class CTFService {
  private baseUrl = `${BASE_URL}/api/ctf`

  // Récupérer tous les défis
  async getChallenges(): Promise<CTFChallenge[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/challenges/`)
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to fetch challenges")
      }
      return response.data.results
    } catch (error) {
      console.error("Error fetching challenges:", error)
      throw error
    }
  }

  // Récupérer un défi spécifique
  async getChallenge(id: string): Promise<CTFChallenge> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/challenges/${id}/`)
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to fetch challenge")
      }
      return response.data
    } catch (error) {
      console.error(`Error fetching challenge ${id}:`, error)
      throw error
    }
  }

  // Démarrer une instance de défi
  async startChallengeInstance(challengeId: string): Promise<ChallengeInstance> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/start/${challengeId}/`, {})
      if (response.status < 200 || response.status >= 300) {
        const errorData = response.data
        throw new Error(errorData.message || "Failed to start challenge instance")
      }
      return response.data
    } catch (error) {
      console.error(`Error starting challenge ${challengeId}:`, error)
      throw error
    }
  }

  // Arrêter une instance de défi
  async stopChallengeInstance(challengeId: string): Promise<void> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/stop/${challengeId}/`, {})
      if (response.status < 200 || response.status >= 300) {
        const errorData = await response.data
        throw new Error(errorData.message || "Failed to stop challenge instance")
      }
    } catch (error) {
      console.error(`Error stopping challenge ${challengeId}:`, error)
      throw error
    }
  }

  // Soumettre un flag
  async submitFlag(submission: FlagSubmission): Promise<FlagSubmissionResult> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/submit-flag/`, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ challenge_id: submission.challenge_id, submitted_flag: submission.submitted_flag }),
      })

      const result = response.data

      if (response.status < 200) {
        throw new Error(result.message || "Failed to submit flag")
      }

      return result
    } catch (error) {
      console.error(`Error submitting flag for challenge ${submission.challenge_id}:`, error)
      throw error
    }
  }

  // Récupérer un fichier téléchargeable
  async getDownloadableFile(fileId: number): Promise<DownloadableFile> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/files/${fileId}/`)
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to fetch file")
      }
      return response.data
    } catch (error) {
      console.error(`Error fetching file ${fileId}:`, error)
      throw error
    }
  }

  // Télécharger un fichier
  async downloadFile(fileUrl: string): Promise<Blob> {
    try {
      const response = await apiClient.get(fileUrl)
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to download file")
      }
      return response.data
    } catch (error) {
      console.error(`Error downloading file from ${fileUrl}:`, error)
      throw error
    }
  }

  // Débloquer un indice
  async unlockHint(challengeId: string, hintId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/challenges/${challengeId}/hints/${hintId}/unlock/`, {
        method: "POST",
      })
      if (response.status < 200 || response.status >= 300) {
        const errorData = await response.data
        throw new Error(errorData.message || "Failed to unlock hint")
      }
      return response.data
    } catch (error) {
      console.error(`Error unlocking hint ${hintId} for challenge ${challengeId}:`, error)
      throw error
    }
  }


  // Récupérer les statistiques de l'utilisateur
  async getUserStats(): Promise<UserChallengeStats> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/user/stats/`)
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to fetch user stats")
      }
      return response.data
    } catch (error) {
      console.error("Error fetching user stats:", error)
      throw error
    }
  }

  async checkInstanceStatus(instanceId: string): Promise<any> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/status/${instanceId}/`)
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to check instance status")
      }
      return response.data
    } catch (error) {
      console.error(`Error checking instance status ${instanceId}:`, error)
      throw error
    }
  }
}

export const ctfService = new CTFService()

