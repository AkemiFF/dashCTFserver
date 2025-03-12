"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CatchAllPage() {
  const params = useParams()
  const router = useRouter()
  const catchAll = (params?.catchAll ?? []) as string[]

  // Exclude specific routes that should have their own pages
  // but might be captured by the catch-all route
  useEffect(() => {
    // List of valid routes that should have their own pages
    const validRoutes = ["search", "notifications", "profile", "messages", "friends"]

    // If the first segment of the path is a valid route, redirect to that route
    if (catchAll && catchAll.length > 0 && validRoutes.includes(catchAll[0])) {
      router.push(`/${catchAll.join("/")}`)
    }
  }, [catchAll, router])

  return (
    <div className="p-10 mt-40">
      <h1 className="text-2xl font-bold">Page non trouvée</h1>
      <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <p className="text-sm text-white/50 mt-4">Route capturée: {JSON.stringify(params)}</p>
    </div>
  )
}

