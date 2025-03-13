"use client"

import { ContactInfo } from "@/components/contact-info"
import { MessagePanel } from "@/components/message-panel"
import { MessageSidebar } from "@/components/message-sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, MessageSquare, Settings, Users } from "lucide-react"
import { useEffect, useState } from "react"

// Types
export interface Message {
  id: string
  content: string
  sender: "user" | "contact"
  timestamp: Date
  status: "sent" | "delivered" | "read"
  attachments?: {
    type: "image" | "file" | "audio"
    url: string
    name?: string
  }[]
}

export interface Contact {
  id: string
  name: string
  avatar: string
  status: "online" | "offline" | "away" | "busy"
  lastSeen?: Date
  isTyping?: boolean
  unreadCount?: number
  messages: Message[]
}

export default function MessagesPage() {
  const [init, setInit] = useState(false)
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [showContactInfo, setShowContactInfo] = useState(true)
  const [showSidebar, setShowSidebar] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [activeTab, setActiveTab] = useState<"messages" | "contacts" | "settings">("messages")

  // Sample contacts data
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Marie Laurent",
      avatar: "/placeholder.svg?height=60&width=60",
      status: "online",
      unreadCount: 3,
      isTyping: true,
      messages: [
        {
          id: "m1",
          content: "Salut ! Comment vas-tu aujourd'hui ?",
          sender: "contact",
          timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
          status: "read",
        },
        {
          id: "m2",
          content: "Je voulais te demander si tu avais vu mon dernier post sur l'IA ?",
          sender: "contact",
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          status: "read",
        },
        {
          id: "m3",
          content: "Très intéressant ! J'ai particulièrement aimé la partie sur les réseaux de neurones.",
          sender: "user",
          timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
          status: "read",
        },
        {
          id: "m4",
          content:
            "Merci ! J'ai passé beaucoup de temps sur la recherche. Est-ce que tu serais disponible pour en discuter ce weekend ?",
          sender: "contact",
          timestamp: new Date(Date.now() - 900000), // 15 minutes ago
          status: "delivered",
        },
        {
          id: "m5",
          content: "Voici quelques images de mon projet",
          sender: "contact",
          timestamp: new Date(Date.now() - 600000), // 10 minutes ago
          status: "delivered",
          attachments: [
            {
              type: "image",
              url: "/placeholder.svg?height=300&width=400",
              name: "project-preview.jpg",
            },
            {
              type: "image",
              url: "/placeholder.svg?height=300&width=400",
              name: "diagram.jpg",
            },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "Thomas Petit",
      avatar: "/placeholder.svg?height=60&width=60",
      status: "offline",
      lastSeen: new Date(Date.now() - 86400000), // 1 day ago
      messages: [
        {
          id: "m6",
          content: "Est-ce que tu as les notes du cours d'hier ?",
          sender: "contact",
          timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
          status: "read",
        },
        {
          id: "m7",
          content: "Oui, je te les envoie tout de suite !",
          sender: "user",
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          status: "read",
          attachments: [
            {
              type: "file",
              url: "#",
              name: "notes-cours.pdf",
            },
          ],
        },
      ],
    },
    {
      id: "3",
      name: "Emma Bernard",
      avatar: "/placeholder.svg?height=60&width=60",
      status: "busy",
      messages: [
        {
          id: "m8",
          content: "Bonjour ! Je voulais te remercier pour ton aide sur le projet.",
          sender: "contact",
          timestamp: new Date(Date.now() - 259200000), // 3 days ago
          status: "read",
        },
        {
          id: "m9",
          content: "Pas de problème, c'était un plaisir de travailler avec toi !",
          sender: "user",
          timestamp: new Date(Date.now() - 172800000), // 2 days ago
          status: "read",
        },
      ],
    },
    {
      id: "4",
      name: "Lucas Moreau",
      avatar: "/placeholder.svg?height=60&width=60",
      status: "away",
      messages: [
        {
          id: "m10",
          content: "Tu viens à la conférence demain ?",
          sender: "contact",
          timestamp: new Date(Date.now() - 432000000), // 5 days ago
          status: "read",
        },
        {
          id: "m11",
          content: "Oui, j'y serai ! On peut s'y retrouver si tu veux.",
          sender: "user",
          timestamp: new Date(Date.now() - 345600000), // 4 days ago
          status: "read",
        },
      ],
    },
    {
      id: "5",
      name: "Sophie Martin",
      avatar: "/placeholder.svg?height=60&width=60",
      status: "online",
      unreadCount: 1,
      messages: [
        {
          id: "m12",
          content: "J'ai une super idée pour notre prochain projet !",
          sender: "contact",
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
          status: "delivered",
        },
      ],
    },
  ])

  // Initialize particles
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640)
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024)

      // Adjust UI based on screen size
      if (window.innerWidth < 640) {
        // Mobile view
        setShowSidebar(selectedContactId === null)
        setShowContactInfo(false)
      } else if (window.innerWidth >= 640 && window.innerWidth < 1024) {
        // Tablet view
        setShowSidebar(true)
        setShowContactInfo(false)
      } else {
        // Desktop view
        setShowSidebar(true)
        setShowContactInfo(true)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [selectedContactId])

  // Set default selected contact
  useEffect(() => {
    if (contacts.length > 0 && !selectedContactId && !isMobile) {
      setSelectedContactId(contacts[0].id)
    }
  }, [contacts, selectedContactId, isMobile])

  // Handle contact selection
  const handleContactSelect = (contactId: string) => {
    setSelectedContactId(contactId)

    // Mark messages as read
    setContacts((prevContacts) =>
      prevContacts.map((contact) => (contact.id === contactId ? { ...contact, unreadCount: 0 } : contact)),
    )

    if (isMobile) {
      setShowSidebar(false)
    }
  }

  // Handle sending a new message
  const handleSendMessage = (
    content: string,
    attachments?: { type: "image" | "file" | "audio"; url: string; name?: string }[],
  ) => {
    if (!selectedContactId || !content.trim()) return

    const newMessage: Message = {
      id: `m${Date.now()}`,
      content,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
      attachments,
    }

    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === selectedContactId ? { ...contact, messages: [...contact.messages, newMessage] } : contact,
      ),
    )

    // Simulate message delivery after 1 second
    setTimeout(() => {
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === selectedContactId
            ? {
              ...contact,
              messages: contact.messages.map((msg) =>
                msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg,
              ),
            }
            : contact,
        ),
      )
    }, 1000)

    // Simulate contact typing after 2 seconds
    setTimeout(() => {
      setContacts((prevContacts) =>
        prevContacts.map((contact) => (contact.id === selectedContactId ? { ...contact, isTyping: true } : contact)),
      )
    }, 2000)

    // Simulate contact response after 4 seconds
    setTimeout(() => {
      const selectedContact = contacts.find((c) => c.id === selectedContactId)
      if (!selectedContact) return

      const responseMessages = [
        "D'accord, je comprends !",
        "Super idée !",
        "Merci pour l'info !",
        "Je suis d'accord avec toi.",
        "Intéressant, dis m'en plus !",
        "Parfait, on fait comme ça alors.",
      ]

      const randomResponse = responseMessages[Math.floor(Math.random() * responseMessages.length)]

      const responseMessage: Message = {
        id: `m${Date.now() + 1}`,
        content: randomResponse,
        sender: "contact",
        timestamp: new Date(),
        status: "delivered",
      }

      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === selectedContactId
            ? {
              ...contact,
              isTyping: false,
              messages: [...contact.messages, responseMessage],
            }
            : contact,
        ),
      )
    }, 4000)
  }

  // Get total unread count
  const totalUnreadCount = contacts.reduce((total, contact) => total + (contact.unreadCount || 0), 0)

  // Particles options
  const particlesOptions = {
    particles: {
      number: {
        value: 20,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ff1493",
      },
      links: {
        enable: true,
        color: "#ff1493",
        opacity: 0.1,
      },
      move: {
        enable: true,
        speed: 0.3,
      },
      size: {
        value: 2,
      },
      opacity: {
        value: 0.3,
      },
    },
    background: {
      color: {
        value: "transparent",
      },
    },
  }

  const selectedContact = contacts.find((contact) => contact.id === selectedContactId)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white relative overflow-hidden">
      {init && <Particles className="absolute inset-0" options={particlesOptions} />}

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -left-32 -top-32 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -right-32 -bottom-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>


      <main className="container mx-auto px-0 md:px-4 pt-20 pb-4 relative z-10 h-[calc(100vh-1rem)]">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col h-full">
          {/* Page header with title and mobile navigation */}
          <motion.div variants={itemVariants} className="mb-4 px-4 md:px-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mr-3">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                  Messages
                </h1>
                {totalUnreadCount > 0 && (
                  <span className="ml-2 bg-pink-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {totalUnreadCount}
                  </span>
                )}
              </div>

              {/* Mobile navigation tabs */}
              <div className="flex md:hidden space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("rounded-full h-9 w-9", activeTab === "messages" && "bg-white/10")}
                  onClick={() => setActiveTab("messages")}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("rounded-full h-9 w-9", activeTab === "contacts" && "bg-white/10")}
                  onClick={() => setActiveTab("contacts")}
                >
                  <Users className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("rounded-full h-9 w-9", activeTab === "settings" && "bg-white/10")}
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Main content area */}
          <motion.div
            variants={itemVariants}
            className="flex-1 rounded-xl overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 flex flex-col md:flex-row"
          >
            {/* Mobile navigation buttons */}
            {isMobile && selectedContactId && !showSidebar && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-24 left-4 z-20 bg-white/10 backdrop-blur-md rounded-full"
                onClick={() => {
                  setShowSidebar(true)
                  setSelectedContactId(null)
                }}
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </Button>
            )}

            {/* Contacts sidebar */}
            <AnimatePresence mode="wait">
              {showSidebar && (
                <motion.div
                  initial={{ opacity: 0, x: isMobile ? -20 : 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isMobile ? -20 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn("border-r border-white/10 flex-shrink-0", isMobile ? "w-full" : "w-80 lg:w-96")}
                >
                  <MessageSidebar
                    contacts={contacts}
                    selectedContactId={selectedContactId}
                    onSelectContact={handleContactSelect}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message panel */}
            <AnimatePresence mode="wait">
              {selectedContactId && selectedContact && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-grow flex flex-col h-full"
                >
                  <MessagePanel
                    contact={selectedContact}
                    onSendMessage={handleSendMessage}
                    onToggleInfo={() => setShowContactInfo(!showContactInfo)}
                    showInfoButton={!isMobile && !isTablet}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contact info panel */}
            <AnimatePresence>
              {selectedContactId && selectedContact && showContactInfo && !isMobile && !isTablet && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="w-80 border-l border-white/10 flex-shrink-0 hidden lg:block"
                >
                  <ContactInfo contact={selectedContact} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state */}
            {!selectedContactId && !isMobile && (
              <div className="flex-grow flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-pink-500"
                      >
                        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                      </svg>
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Vos messages</h3>
                  <p className="text-white/60 max-w-md">
                    Sélectionnez une conversation pour commencer à discuter ou démarrez une nouvelle conversation.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

