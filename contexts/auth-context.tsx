"use client"

import {
  logout as authLogout,
  getClientToken,
  isAuthenticated,
  saveAuthData
} from "@/lib/auth"; // Assurez-vous que le chemin est correct
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  is_staff: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: { username: string; password: string }) => Promise<boolean>
  register: (data: {
    username: string
    email: string
    password: string
    first_name?: string
    last_name?: string
  }) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMounted, setHasMounted] = useState(false); // <-- Ajout

  useEffect(() => {
    setHasMounted(true); // Déclencher après le montage côté client
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        if (hasMounted && isAuthenticated()) { // <-- Vérifier hasMounted
          const token = await getClientToken();
          if (token) {
            const userData = await fetchUserData(token);
            setUser(userData);
          }
        }
      } catch (err) {
        setError("Erreur lors de la vérification de l'authentification");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [hasMounted]);
  const login = async (credentials: { username: string; password: string }) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      if (response.ok) {
        const data = await response.json()
        saveAuthData(data) // Sauvegarder les données d'authentification
        const userData = await fetchUserData(data.access) // Récupérer les données de l'utilisateur
        setUser(userData)
        setError(null)
        return true
      } else {
        setError("Identifiants invalides")
        return false
      }
    } catch (err) {
      setError("Erreur lors de la connexion")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: {
    username: string
    email: string
    password: string
    first_name?: string
    last_name?: string
  }) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const data = await response.json()
        saveAuthData(data) // Sauvegarder les données d'authentification
        const userData = await fetchUserData(data.access) // Récupérer les données de l'utilisateur
        setUser(userData)
        setError(null)
        return true
      } else {
        setError("Erreur lors de l'inscription")
        return false
      }
    } catch (err) {
      setError("Erreur lors de l'inscription")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authLogout() // Appeler la fonction de déconnexion de auth.ts
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: isAuthenticated(),
    isLoading,
    error,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}

// Fonction pour récupérer les données de l'utilisateur
async function fetchUserData(token: string): Promise<User> {
  const response = await fetch("/api/auth/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des données de l'utilisateur")
  }

  const data = await response.json()
  return data
}