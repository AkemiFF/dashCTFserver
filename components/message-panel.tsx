"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { Contact, Message } from "@/pages/messages"
import { motion } from "framer-motion"
import { Check, CheckCheck, File, Info, Mic, MoreVertical, Paperclip, Phone, Send, Smile, Video, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface MessagePanelProps {
  contact: Contact
  onSendMessage: (
    content: string,
    attachments?: { type: "image" | "file" | "audio"; url: string; name?: string }[],
  ) => void
  onToggleInfo: () => void
  showInfoButton: boolean
}

export function MessagePanel({ contact, onSendMessage, onToggleInfo, showInfoButton }: MessagePanelProps) {
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<{ type: "image" | "file" | "audio"; url: string; name?: string }[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [contact.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments.length > 0 ? attachments : undefined)
      setMessage("")
      setAttachments([])
    }
  }

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newAttachments = Array.from(files).map((file) => {
      const isImage = file.type.startsWith("image/")
      const isAudio = file.type.startsWith("audio/")

      return {
        type: isImage ? "image" : isAudio ? "audio" : "file" as "image" | "audio" | "file",
        url: URL.createObjectURL(file),
        name: file.name,
      }
    })
    setAttachments([...attachments, ...newAttachments])

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle removing an attachment
  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  // Handle voice recording
  const handleToggleRecording = () => {
    setIsRecording(!isRecording)
    // Here you would implement actual voice recording logic
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

  // Format date for message groups
  const formatMessageDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier"
    } else {
      return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })
    }
  }

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = []

    messages.forEach((message) => {
      const dateStr = formatMessageDate(message.timestamp)
      const lastGroup = groups[groups.length - 1]

      if (lastGroup && lastGroup.date === dateStr) {
        lastGroup.messages.push(message)
      } else {
        groups.push({ date: dateStr, messages: [message] })
      }
    })

    return groups
  }

  // Get message status icon
  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-white/60" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-white/60" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  const messageGroups = groupMessagesByDate(contact.messages)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative mr-3">
            <Avatar className="h-10 w-10 border border-white/10">
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                {contact.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-navy-950",
                getStatusColor(contact.status),
              )}
            />
          </div>
          <div>
            <h3 className="font-medium text-white">{contact.name}</h3>
            <p className="text-xs text-white/60">
              {contact.status === "online"
                ? "En ligne"
                : contact.status === "typing"
                  ? "En train d'écrire..."
                  : contact.lastSeen
                    ? `Vu à ${contact.lastSeen.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
                    : "Hors ligne"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Phone className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Appel audio</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Video className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Appel vidéo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {showInfoButton && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={onToggleInfo}
                  >
                    <Info className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Informations du contact</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 text-white/70 hover:text-white hover:bg-white/10"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-navy-950/90 backdrop-blur-xl border-white/10 text-white">
              <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">Rechercher</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">Archiver la conversation</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
                Désactiver les notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="hover:bg-white/5 cursor-pointer text-red-500">
                Supprimer la conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            <div className="flex justify-center">
              <div className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/60">{group.date}</div>
            </div>

            {group.messages.map((msg, msgIndex) => {
              const isUser = msg.sender === "user"
              const showAvatar = msgIndex === 0 || group.messages[msgIndex - 1].sender !== msg.sender

              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    isUser ? "justify-end" : "justify-start",
                    msgIndex > 0 && group.messages[msgIndex - 1].sender === msg.sender ? "mt-1" : "mt-4",
                  )}
                >
                  {!isUser && showAvatar && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs">
                        {contact.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  {!isUser && !showAvatar && <div className="w-8 mr-2" />}

                  <div className={cn("max-w-[70%]", isUser ? "items-end" : "items-start")}>
                    {/* Message content */}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2 inline-block",
                        isUser ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" : "bg-white/10 text-white",
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>

                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {msg.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className={cn("rounded-lg overflow-hidden", isUser ? "bg-pink-500/20" : "bg-white/5")}
                          >
                            {attachment.type === "image" ? (
                              <div className="relative">
                                <img
                                  src={attachment.url || "/placeholder.svg"}
                                  alt={attachment.name || "Image"}
                                  className="max-w-full rounded-lg"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center p-3 space-x-3">
                                <div
                                  className={cn(
                                    "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                                    isUser ? "bg-pink-500/30" : "bg-white/10",
                                  )}
                                >
                                  <File className="h-5 w-5 text-white" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm text-white font-medium truncate">{attachment.name}</p>
                                  <p className="text-xs text-white/60">Document</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Message meta */}
                    <div className={cn("flex items-center mt-1 text-xs", isUser ? "justify-end" : "justify-start")}>
                      <span className="text-white/40">
                        {msg.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {isUser && <span className="ml-1">{getMessageStatusIcon(msg.status)}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        {/* Typing indicator */}
        {contact.isTyping && (
          <div className="flex mt-2">
            <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs">
                {contact.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="bg-white/10 rounded-full px-4 py-2 inline-flex items-center">
              <div className="flex space-x-1">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                  className="h-2 w-2 bg-white/60 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                  className="h-2 w-2 bg-white/60 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                  className="h-2 w-2 bg-white/60 rounded-full"
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t border-white/10 flex gap-2 overflow-x-auto scrollbar-hide">
          {attachments.map((attachment, index) => (
            <div key={index} className="relative group">
              {attachment.type === "image" ? (
                <div className="h-20 w-20 rounded-md overflow-hidden bg-white/5 relative">
                  <img
                    src={attachment.url || "/placeholder.svg"}
                    alt={attachment.name || "Attachment"}
                    className="h-full w-full object-cover"
                  />
                  <button
                    className="absolute top-1 right-1 h-5 w-5 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveAttachment(index)}
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ) : (
                <div className="h-20 w-20 rounded-md overflow-hidden bg-white/5 flex flex-col items-center justify-center p-1 relative">
                  <File className="h-8 w-8 text-white/70" />
                  <p className="text-xs text-white/70 truncate w-full text-center mt-1">{attachment.name}</p>
                  <button
                    className="absolute top-1 right-1 h-5 w-5 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveAttachment(index)}
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-end space-x-2">
          <div className="flex-grow relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Écrivez un message..."
              className="min-h-[60px] max-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-white/50 resize-none pr-12"
            />
            <div className="absolute bottom-3 right-3 flex space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Joindre un fichier</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} multiple />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Emoji</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {message.trim() || attachments.length > 0 ? (
            <Button
              type="button"
              className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 p-0 flex-shrink-0"
              onClick={handleSendMessage}
            >
              <Send className="h-5 w-5 text-white" />
            </Button>
          ) : (
            <Button
              type="button"
              className={cn(
                "h-10 w-10 rounded-full p-0 flex-shrink-0",
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
              )}
              onClick={handleToggleRecording}
            >
              <Mic className="h-5 w-5 text-white" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

