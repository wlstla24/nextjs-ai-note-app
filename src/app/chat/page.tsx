import { Metadata } from "next"
import { ChatInterface } from "@/components/chat/chat-interface"

export const metadata: Metadata = {
  title: "TrueFlare",
  description: "Chat with different AI personas",
}

export default function ChatPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TrueFlare</h1>
      <ChatInterface />
    </div>
  )
} 