"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import apiClient from "@/services/api-client"

interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  is_staff: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface LoginCredentials {
  username: string
  password: string
}

interface RegisterData {
  username: string
  email: string
  password: string
  first_name?: string
  last_name?: string
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })
  const router = useRouter()

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
        return
      }

      try {
        const response = await apiClient.get("/user/profile")
        setAuthState({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        localStorage.removeItem("token")
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Session expirée. Veuillez vous reconnecter.",
        })
      }
    }

    checkAuth()
  }, [])

  // Fonction de connexion
  const login = async (credentials: LoginCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await apiClient.post("/auth/login", credentials)
      const { token, user } = response.data

      localStorage.setItem("token", token)

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })

      return true
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Erreur de connexion",
      }))

      return false
    }
  }

  // Fonction d'inscription
  const register = async (data: RegisterData) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await apiClient.post("/auth/register", data)
      const { token, user } = response.data

      localStorage.setItem("token", token)

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })

      return true
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Erreur d'inscription",
      }))

      return false
    }
  }

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem("token")

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })

    router.push("/login")
  }

  return {
    ...authState,
    login,
    register,
    logout,
  }
}

