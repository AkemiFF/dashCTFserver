"use client"

import { motion } from "framer-motion"
import { GitCommit, GitPullRequest, AlertCircle, Flag, FileText } from "lucide-react"

interface Activity {
  id: number
  type: string
  project: string
  description: string
  timestamp: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "commit":
        return <GitCommit className="h-4 w-4 text-green-500" />
      case "pull_request":
        return <GitPullRequest className="h-4 w-4 text-purple-500" />
      case "issue":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "hackathon":
        return <Flag className="h-4 w-4 text-red-500" />
      case "article":
        return <FileText className="h-4 w-4 text-blue-500" />
      default:
        return <GitCommit className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="flex items-start space-x-3"
        >
          <div className="mt-0.5 bg-white/10 p-2 rounded-full">{getActivityIcon(activity.type)}</div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <p className="font-medium">
                <span className="text-pink-500">{activity.project}</span>
              </p>
              <span className="text-xs text-white/50">{activity.timestamp}</span>
            </div>
            <p className="text-sm text-white/70 mt-1">{activity.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export { ActivityFeed }

