"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import type { Notification } from "@/pages/notifications"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { AnimatePresence, motion } from "framer-motion"
import { Check, ExternalLink, MoreHorizontal, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface NotificationsListProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
}

export function NotificationsList({ notifications, onMarkAsRead }: NotificationsListProps) {
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null)
  const { toast } = useToast()

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "friend_request":
        return "👥"
      case "mention":
        return "🔖"
      case "comment":
        return "💬"
      case "like":
        return "❤️"
      case "project":
        return "🚀"
      case "achievement":
        return "🏆"
      case "system":
        return "🔔"
      default:
        return "📣"
    }
  }

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: fr })
  }

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id)
    }

    if (expandedNotification === notification.id) {
      setExpandedNotification(null)
    } else {
      setExpandedNotification(notification.id)
    }
  }

  // Handle delete notification
  const handleDeleteNotification = (id: string) => {
    toast({
      title: "Notification supprimée",
      description: "La notification a été supprimée avec succès",
    })
  }

  return (
    <div className="space-y-4">
      {notifications.length > 0 ? (
        <AnimatePresence initial={false}>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <Card
                className={`backdrop-blur-xl border overflow-hidden transition-colors ${notification.read ? "bg-white/5 border-white/10" : "bg-white/10 border-pink-500/30"
                  }`}
              >
                <div className="p-4 cursor-pointer" onClick={() => handleNotificationClick(notification)}>
                  <div className="flex items-start gap-4">
                    {/* Icon or Avatar */}
                    {notification.user ? (
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                        <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center text-xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-sm text-white/90">
                            {notification.user && (
                              <Link
                                href={`/profile/${notification.user.username}`}
                                className="font-medium text-white hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {notification.user.name}
                              </Link>
                            )}{" "}
                            <span>{notification.content}</span>{" "}
                            {notification.project && (
                              <Link
                                href={`/projects/${notification.project.id}`}
                                className="font-medium text-pink-500 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {notification.project.name}
                              </Link>
                            )}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/50">{formatTimestamp(notification.timestamp)}</span>
                            {!notification.read && <Badge className="bg-pink-500 text-white text-xs">Nouveau</Badge>}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 ml-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-white/10"
                              onClick={(e) => {
                                e.stopPropagation()
                                onMarkAsRead(notification.id)
                              }}
                              title="Marquer comme lu"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-white/10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-navy-950/90 backdrop-blur-xl border-white/10 text-white"
                            >
                              {!notification.read && (
                                <DropdownMenuItem
                                  onClick={() => onMarkAsRead(notification.id)}
                                  className="cursor-pointer"
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  <span>Marquer comme lu</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="cursor-pointer text-red-500 focus:text-red-500"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Supprimer</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {expandedNotification === notification.id && notification.actionUrl && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Separator className="my-4 bg-white/10" />
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/5 border-white/10 hover:bg-white/10"
                            asChild
                          >
                            <Link href={notification.actionUrl}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Voir les détails
                            </Link>
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center text-3xl mb-4">🔔</div>
            <h3 className="text-xl font-medium mb-2">Aucune notification</h3>
            <p className="text-white/60 max-w-md mx-auto">
              Vous n'avez aucune notification correspondant à ce filtre. Revenez plus tard ou essayez un autre filtre.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

