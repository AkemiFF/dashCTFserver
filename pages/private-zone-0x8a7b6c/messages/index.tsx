"use client"

import Layout from "@/components/admin/layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, Search, Send } from "lucide-react"
import { useState } from "react"

interface Conversation {
  id: string
  name: string
  lastMessage: string
  avatar: string
  unread: number
}

const initialConversations: Conversation[] = [
  { id: "1", name: "Alice Smith", lastMessage: "Hey, how's it going?", avatar: "/avatars/alice.png", unread: 2 },
  { id: "2", name: "Bob Johnson", lastMessage: "Can you help me with...", avatar: "/avatars/bob.png", unread: 0 },
  {
    id: "3",
    name: "CTF Team Alpha",
    lastMessage: "Great job on the last challenge!",
    avatar: "/avatars/team-alpha.png",
    unread: 5,
  },
  // Add more conversations as needed
]

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupMembers, setNewGroupMembers] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // In a real app, you'd send this message to your backend
      console.log(`Sending message to ${selectedConversation.name}: ${newMessage}`)
      setNewMessage("")
    }
  }

  const handleCreateGroup = () => {
    if (newGroupName.trim() && newGroupMembers.trim()) {
      const newGroup: Conversation = {
        id: Date.now().toString(),
        name: newGroupName,
        lastMessage: "Group created",
        avatar: "/avatars/group.png",
        unread: 0,
      }
      setConversations([newGroup, ...conversations])
      setNewGroupName("")
      setNewGroupMembers("")
    }
  }

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Sidebar with conversation list */}
        <div className="w-1/3 border-r border-border">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Messages</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Group</DialogTitle>
                  <DialogDescription>Create a new group conversation by adding members.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="group-name" className="text-right">
                      Group Name
                    </Label>
                    <Input
                      id="group-name"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="group-members" className="text-right">
                      Members
                    </Label>
                    <Input
                      id="group-members"
                      value={newGroupMembers}
                      onChange={(e) => setNewGroupMembers(e.target.value)}
                      className="col-span-3"
                      placeholder="Separate usernames with commas"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateGroup}>Create Group</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-8" />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {conversations.map((conversation) => (
              <div key={conversation.id}>
                <div
                  className={`flex items-center space-x-4 p-4 hover:bg-accent cursor-pointer ${selectedConversation?.id === conversation.id ? "bg-accent" : ""
                    }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <Avatar>
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{conversation.name}</p>
                    <p className="text-sm text-muted-foreground">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <div className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unread}
                    </div>
                  )}
                </div>
                <Separator />
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-border">
                <h3 className="text-xl font-semibold">{selectedConversation.name}</h3>
              </div>
              <ScrollArea className="flex-1 p-4">
                {/* Chat messages would go here */}
                <p className="text-center text-muted-foreground">No messages yet</p>
              </ScrollArea>
              <div className="p-4 border-t border-border">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex space-x-2"
                >
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button type="submit">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

