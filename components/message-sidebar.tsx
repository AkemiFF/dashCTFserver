"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Contact } from "@/pages/messages"
import { motion } from "framer-motion"
import { CheckCircle2, Edit, Search } from "lucide-react"
import { useState } from "react"
interface MessageSidebarProps {
  contacts: Contact[]
  selectedContactId: string | null
  onSelectContact: (contactId: string) => void
}

export function MessageSidebar({ contacts, selectedContactId, onSelectContact }: MessageSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all")

  // Filter contacts based on search query and active tab
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || (activeTab === "unread" && contact.unreadCount && contact.unreadCount > 0)
    return matchesSearch && matchesTab
  })

  // Format timestamp for last message
  const formatMessageTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) {
      return days === 1 ? "Hier" : `${days}j`
    }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours > 0) {
      return `${hours}h`
    }

    const minutes = Math.floor(diff / (1000 * 60))
    if (minutes > 0) {
      return `${minutes}m`
    }

    return "À l'instant"
  }

  // Get last message for a contact
  const getLastMessage = (contact: Contact) => {
    if (contact.messages.length === 0) return null
    return contact.messages[contact.messages.length - 1]
  }

  // Get status indicator color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "busy":
        return "bg-red-500"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 mb-4">
          Messages
        </h2>

        {/* Search */}
        <div className="relative">
          <Input
            type="search"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50 pl-10 rounded-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-2 border-b border-white/10">
        <Button
          variant="ghost"
          className={cn("flex-1 rounded-full text-sm", activeTab === "all" && "bg-white/10 text-white")}
          onClick={() => setActiveTab("all")}
        >
          Tous
        </Button>
        <Button
          variant="ghost"
          className={cn("flex-1 rounded-full text-sm", activeTab === "unread" && "bg-white/10 text-white")}
          onClick={() => setActiveTab("unread")}
        >
          Non lus
        </Button>
      </div>

      {/* Contacts list */}
      <div className="flex-grow overflow-y-auto scrollbar-hide">
        {filteredContacts.length > 0 ? (
          <div className="divide-y divide-white/5">
            {filteredContacts.map((contact) => {
              const lastMessage = getLastMessage(contact)

              return (
                <motion.div
                  key={contact.id}
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  className={cn(
                    "p-3 cursor-pointer transition-colors",
                    selectedContactId === contact.id && "bg-white/10",
                  )}
                  onClick={() => onSelectContact(contact.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border border-white/10">
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                          {contact.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-navy-950",
                          getStatusColor(contact.status),
                        )}
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-white truncate">{contact.name}</h3>
                        {lastMessage && (
                          <span className="text-xs text-white/50">{formatMessageTime(lastMessage.timestamp)}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-white/60 truncate max-w-[150px]">
                          {contact.isTyping ? (
                            <span className="text-pink-500">En train d'écrire...</span>
                          ) : lastMessage ? (
                            <>
                              {lastMessage.sender === "user" && (
                                <span className="inline-flex items-center mr-1">
                                  <CheckCircle2
                                    className={cn(
                                      "h-3 w-3 mr-1",
                                      lastMessage.status === "read" ? "text-blue-500" : "text-white/40",
                                    )}
                                  />
                                </span>
                              )}
                              {lastMessage.content}
                            </>
                          ) : (
                            "Aucun message"
                          )}
                        </p>
                        {contact.unreadCount && contact.unreadCount > 0 && (
                          <Badge className="bg-pink-500 text-white">{contact.unreadCount}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-white/40" />
            </div>
            <p className="text-white/60">Aucun résultat trouvé</p>
          </div>
        )}
      </div>

      {/* New message button */}
      <div className="p-4 border-t border-white/10">
        <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
          <Edit className="h-4 w-4 mr-2" />
          Nouveau message
        </Button>
      </div>
    </div>
  )
}

