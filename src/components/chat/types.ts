export interface Message {
  role: "user" | "assistant"
  content: string
}

export interface Persona {
  id: string
  name: string
  age: number
  gender: string
  location: string
  occupation: string
  bio: string
  interests: string[]
  personality: string[]
  lookingFor: string
  avatar: string
}

export interface ChatHistory {
  [key: string]: Message[]
} 