export interface AIMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface AIConversation {
  id: string
  messages: AIMessage[]
  title?: string
}

