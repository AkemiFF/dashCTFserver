// Event types
export interface Event {
  id: string
  title: string
  description?: string
  date: string
  instructor: string
  avatar?: string
  duration?: string
  category?: string
  registeredCount?: number
  isRegistered?: boolean
  link?: string
}

// Mock events data
const events: Event[] = [
  {
    id: "event-1",
    title: "Live Hacking Session: SQL Injection",
    description: "Learn advanced SQL injection techniques and how to protect against them in this live session.",
    date: "2025-05-10T18:00:00",
    instructor: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    duration: "90 minutes",
    category: "Web Security",
    registeredCount: 156,
  },
  {
    id: "event-2",
    title: "Cybersecurity Career Workshop",
    description: "Discover various career paths in cybersecurity and how to prepare for them.",
    date: "2025-05-15T15:00:00",
    instructor: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    duration: "120 minutes",
    category: "Career Development",
    registeredCount: 89,
  },
  {
    id: "event-3",
    title: "Threat Hunting Masterclass",
    description: "Advanced techniques for proactively searching for cyber threats in your environment.",
    date: "2025-05-18T17:00:00",
    instructor: "Elena Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    duration: "120 minutes",
    category: "Threat Intelligence",
    registeredCount: 112,
  },
  {
    id: "event-4",
    title: "Mobile App Security Testing",
    description: "Learn how to identify and exploit vulnerabilities in mobile applications.",
    date: "2025-05-22T16:00:00",
    instructor: "David Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    duration: "90 minutes",
    category: "Mobile Security",
    registeredCount: 78,
  },
  {
    id: "event-5",
    title: "Cloud Security Fundamentals",
    description: "Essential security practices for AWS, Azure, and Google Cloud environments.",
    date: "2025-05-25T14:00:00",
    instructor: "Priya Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    duration: "120 minutes",
    category: "Cloud Security",
    registeredCount: 134,
  },
]

// Event service functions
export const eventService = {
  // Get all events
  getAllEvents: async (): Promise<Event[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return events
  },

  // Get upcoming events
  getUpcomingEvents: async (limit?: number): Promise<Event[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    // Filter events that are in the future
    const now = new Date()
    const upcomingEvents = events
      .filter((event) => new Date(event.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Return limited number if specified
    return limit ? upcomingEvents.slice(0, limit) : upcomingEvents
  },

  // Get event by ID
  getEventById: async (id: string): Promise<Event | undefined> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return events.find((event) => event.id === id)
  },

  // Register for an event
  registerForEvent: async (eventId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    // Find the event
    const event = events.find((e) => e.id === eventId)

    if (!event) {
      return {
        success: false,
        message: "Event not found.",
      }
    }

    // Mock registration (in a real app, this would update a database)
    return {
      success: true,
      message: `Successfully registered for "${event.title}".`,
    }
  },

  // Cancel registration for an event
  cancelEventRegistration: async (eventId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    // Find the event
    const event = events.find((e) => e.id === eventId)

    if (!event) {
      return {
        success: false,
        message: "Event not found.",
      }
    }

    // Mock cancellation (in a real app, this would update a database)
    return {
      success: true,
      message: `Successfully canceled registration for "${event.title}".`,
    }
  },
}
