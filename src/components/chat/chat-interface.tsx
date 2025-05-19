"use client"

import { useState, useEffect } from "react"
import { PersonaList } from "./PersonaList"
import { ChatHeader } from "./ChatHeader"
import { PersonaProfile } from "./PersonaProfile"
import { ChatMessages } from "./ChatMessages"
import { ChatInput } from "./ChatInput"
import { Persona, Message, ChatHistory } from "./types"

export function ChatInterface() {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatHistory>({})
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [personas, setPersonas] = useState<Persona[]>([])

  // Load personas on component mount
  useEffect(() => {
    const loadPersonas = async () => {
      try {
        const response = await fetch("/api/personas", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        })
        const data = await response.json()
        if (Array.isArray(data)) {
          setPersonas(data)
        } else {
          console.error("Invalid response format:", data)
          setPersonas([])
        }
      } catch (error) {
        console.error("Error loading personas:", error)
        setPersonas([])
      }
    }

    loadPersonas()
  }, [])

  // Load existing chat when selecting a persona
  useEffect(() => {
    const loadExistingChat = async () => {
      if (!selectedPersona) return

      try {
        // First, try to find an existing chat for this persona
        const response = await fetch("/api/chats")
        const chats = await response.json()
        
        const existingChat = chats.find((chat: any) => chat.personaId === selectedPersona.id)
        
        if (existingChat) {
          setCurrentChatId(existingChat.id)
          // Load messages for this chat
          const messagesResponse = await fetch(`/api/chats/${existingChat.id}/messages`)
          const messages = await messagesResponse.json()
          setChatHistory(prev => ({
            ...prev,
            [selectedPersona.id]: messages
          }))
        } else {
          // Create a new chat if none exists
          const newChatResponse = await fetch("/api/chats", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              personaId: selectedPersona.id,
            }),
          })
          const newChat = await newChatResponse.json()
          setCurrentChatId(newChat.id)
        }
      } catch (error) {
        console.error("Error loading chat:", error)
      }
    }

    loadExistingChat()
  }, [selectedPersona])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedPersona || !currentChatId) return

    const newMessage: Message = {
      role: "user",
      content: inputMessage
    }

    // Update local state
    setChatHistory(prev => ({
      ...prev,
      [selectedPersona.id]: [...(prev[selectedPersona.id] || []), newMessage]
    }))
    setInputMessage("")
    setIsLoading(true)

    try {
      // Save user message to database
      await fetch(`/api/chats/${currentChatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      })

      // Get AI response
      const aiResponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...(chatHistory[selectedPersona.id] || []), newMessage],
          personaId: selectedPersona.id,
        }),
      })

      if (!aiResponse.ok) {
        throw new Error("Failed to get response")
      }

      const data = await aiResponse.json()
      
      const assistantMessage: Message = {
        role: "assistant",
        content: data.content
      }

      // Save AI response to database
      await fetch(`/api/chats/${currentChatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assistantMessage),
      })

      // Update local state with AI response
      setChatHistory(prev => ({
        ...prev,
        [selectedPersona.id]: [...(prev[selectedPersona.id] || []), assistantMessage]
      }))
    } catch (error) {
      console.error("Error sending message:", error)
      setChatHistory(prev => ({
        ...prev,
        [selectedPersona.id]: [...(prev[selectedPersona.id] || []), {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again."
        }]
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPersona = async (newPersona: Omit<Persona, "id">) => {
    try {
      console.log("Creating new persona:", newPersona)
      const response = await fetch("/api/personas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newPersona),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Failed to create persona:", errorData)
        throw new Error("Failed to create persona")
      }

      const createdPersona = await response.json()
      console.log("Created persona:", createdPersona)
      setPersonas(prev => {
        const updated = [...prev, createdPersona]
        console.log("Updated personas:", updated)
        return updated
      })
      // Initialize empty chat history for the new persona
      setChatHistory(prev => ({
        ...prev,
        [createdPersona.id]: []
      }))
    } catch (error) {
      console.error("Error creating persona:", error)
    }
  }

  const handleDeletePersona = async (personaId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click event
    if (!confirm("Are you sure you want to delete this persona? This will also delete all associated chats and messages.")) {
      return
    }

    try {
      const response = await fetch(`/api/personas?id=${personaId}`, {
        method: "DELETE",
        credentials: "include"
      })

      if (!response.ok) {
        throw new Error("Failed to delete persona")
      }

      // Remove persona from state
      setPersonas(prev => prev.filter(p => p.id !== personaId))
      // Clear chat history for this persona
      setChatHistory(prev => {
        const newHistory = { ...prev }
        delete newHistory[personaId]
        return newHistory
      })
      // If the deleted persona was selected, clear selection
      if (selectedPersona?.id === personaId) {
        setSelectedPersona(null)
        setCurrentChatId(null)
      }
    } catch (error) {
      console.error("Error deleting persona:", error)
      alert("Failed to delete persona. Please try again.")
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {!selectedPersona ? (
        <PersonaList
          personas={personas}
          chatHistory={chatHistory}
          onSelectPersona={setSelectedPersona}
          onDeletePersona={handleDeletePersona}
          onAddPersona={handleAddPersona}
        />
      ) : (
        <div className="flex flex-col h-full">
          <ChatHeader
            persona={selectedPersona}
            onBack={() => setSelectedPersona(null)}
          />
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <PersonaProfile persona={selectedPersona} />
            <ChatMessages
              messages={chatHistory[selectedPersona.id] || []}
              isLoading={isLoading}
            />
            <ChatInput
              value={inputMessage}
              onChange={setInputMessage}
              onSend={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  )
} 