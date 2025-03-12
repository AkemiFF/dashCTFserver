"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Contact } from "@/pages/messages"
import { Bell, BellOff, File, ImageIcon, Link2, Search, Star, Trash2, UserMinus, X } from "lucide-react"
import { useState } from "react"

interface ContactInfoProps {
  contact: Contact
}

export function ContactInfo({ contact }: ContactInfoProps) {
  const [activeTab, setActiveTab] = useState("media")
  const [muted, setMuted] = useState(false)
  const [starred, setStarred] = useState(false)

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

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "En ligne"
      case "busy":
        return "Occupé(e)"
      case "away":
        return "Absent(e)"
      default:
        return "Hors ligne"
    }
  }

  // Count media items
  const mediaItems = contact.messages
    .filter((msg) => msg.attachments && msg.attachments.some((att) => att.type === "image"))
    .flatMap((msg) => msg.attachments || [])
    .filter((att) => att.type === "image")

  // Count files
  const fileItems = contact.messages
    .filter((msg) => msg.attachments && msg.attachments.some((att) => att.type === "file"))
    .flatMap((msg) => msg.attachments || [])
    .filter((att) => att.type === "file")

  // Count links (this is a placeholder since we don't have actual link detection)
  const linkItems: { url: string; title: string; preview?: string }[] = [
    { url: "https://example.com", title: "Example Website", preview: "/placeholder.svg?height=100&width=200" },
    { url: "https://docs.example.com", title: "Documentation" },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-medium text-white">Informations</h3>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Contact info */}
      <div className="p-6 flex flex-col items-center border-b border-white/10">
        <div className="relative mb-4">
          <Avatar className="h-24 w-24 border-2 border-white/10">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl">
              {contact.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-navy-950",
              getStatusColor(contact.status),
            )}
          />
        </div>
        <h2 className="text-xl font-bold text-white mb-1">{contact.name}</h2>
        <p className="text-sm text-white/60 mb-4">{getStatusText(contact.status)}</p>

        <div className="flex space-x-2 mb-4">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full h-10 w-10",
              muted ? "bg-pink-500/20 text-pink-500" : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10",
            )}
            onClick={() => setMuted(!muted)}
          >
            {muted ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full h-10 w-10",
              starred ? "bg-pink-500/20 text-pink-500" : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10",
            )}
            onClick={() => setStarred(!starred)}
          >
            <Star className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Media, files, links tabs */}
      <div className="flex-grow overflow-hidden flex flex-col">
        <Tabs defaultValue="media" value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
          <TabsList className="grid grid-cols-3 bg-transparent border-b border-white/10 p-0 h-auto">
            <TabsTrigger
              value="media"
              className={cn(
                "py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-pink-500 text-white/60 data-[state=active]:text-white",
              )}
            >
              Médias
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className={cn(
                "py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-pink-500 text-white/60 data-[state=active]:text-white",
              )}
            >
              Fichiers
            </TabsTrigger>
            <TabsTrigger
              value="links"
              className={cn(
                "py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-pink-500 text-white/60 data-[state=active]:text-white",
              )}
            >
              Liens
            </TabsTrigger>
          </TabsList>

          <TabsContent value="media" className="flex-grow overflow-y-auto scrollbar-hide p-4 mt-0">
            {mediaItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {mediaItems.map((media, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-white/5 relative group">
                    <img
                      src={media.url || "/placeholder.svg"}
                      alt={media.name || "Media"}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/50 text-white">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="h-6 w-6 text-white/40" />
                </div>
                <p className="text-white/60">Aucun média partagé</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="files" className="flex-grow overflow-y-auto scrollbar-hide p-4 mt-0">
            {fileItems.length > 0 ? (
              <div className="space-y-2">
                {fileItems.map((file, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <File className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <p className="text-sm text-white font-medium truncate">{file.name}</p>
                      <p className="text-xs text-white/60">Document</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <File className="h-6 w-6 text-white/40" />
                </div>
                <p className="text-white/60">Aucun fichier partagé</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="links" className="flex-grow overflow-y-auto scrollbar-hide p-4 mt-0">
            {linkItems.length > 0 ? (
              <div className="space-y-3">
                {linkItems.map((link, index) => (
                  <div key={index} className="bg-white/5 rounded-lg overflow-hidden">
                    {link.preview && (
                      <div className="h-32 w-full">
                        <img
                          src={link.preview || "/placeholder.svg"}
                          alt={link.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-sm text-white font-medium mb-1">{link.title}</p>
                      <p className="text-xs text-white/60 flex items-center">
                        <Link2 className="h-3 w-3 mr-1 inline" />
                        {link.url}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Link2 className="h-6 w-6 text-white/40" />
                </div>
                <p className="text-white/60">Aucun lien partagé</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5">
          <UserMinus className="h-5 w-5 mr-3 text-red-500" />
          Bloquer le contact
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5">
          <Trash2 className="h-5 w-5 mr-3 text-red-500" />
          Supprimer la conversation
        </Button>
      </div>
    </div>
  )
}

