"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Bell, UserPlus, AtSign, MessageSquare, Heart, Code2, Award, AlertCircle, Filter } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface NotificationsFilterProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export function NotificationsFilter({ activeFilter, onFilterChange }: NotificationsFilterProps) {
  const filters = [
    { id: "all", label: "Toutes", icon: Bell },
    { id: "unread", label: "Non lues", icon: AlertCircle },
    { id: "friend_request", label: "Amis", icon: UserPlus },
    { id: "mention", label: "Mentions", icon: AtSign },
    { id: "comment", label: "Commentaires", icon: MessageSquare },
    { id: "like", label: "J'aime", icon: Heart },
    { id: "project", label: "Projets", icon: Code2 },
    { id: "achievement", label: "Réussites", icon: Award },
    { id: "system", label: "Système", icon: Filter },
  ]

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 p-1">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-2 text-sm",
              activeFilter === filter.id
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                : "hover:bg-white/10",
            )}
          >
            <filter.icon className="h-4 w-4" />
            <span>{filter.label}</span>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="h-2" />
    </ScrollArea>
  )
}

