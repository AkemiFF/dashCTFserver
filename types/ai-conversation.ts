export interface AIMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface AIConversation {
  id: string
  title: string
  messages: AIMessage[]
}

