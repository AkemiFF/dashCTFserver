"use client"

import type React from "react"

import { useAuthContext } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export const config = {
  ssr: false,
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login?redirect=" + encodeURIComponent(window.location.pathname))
      } else if (adminOnly && !user?.is_staff) {
        router.push("/learn") // Rediriger vers la page d'accueil si l'utilisateur n'est pas admin
      }
    }
  }, [isAuthenticated, isLoading, router, adminOnly, user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Ne rien afficher pendant la redirection
  }

  if (adminOnly && !user?.is_staff) {
    return null // Ne rien afficher pendant la redirection
  }

  return <>{children}</>
}

