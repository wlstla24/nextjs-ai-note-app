import { NextResponse } from "next/server"
import OpenAI from "openai"
import prisma from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { messages, personaId } = body

    if (!personaId) {
      return NextResponse.json(
        { error: "Persona ID is required" },
        { status: 400 }
      )
    }

    // Get persona from database
    const persona = await prisma.persona.findUnique({
      where: { 
        id: personaId,
        userId // Ensure the persona belongs to the user
      }
    })

    if (!persona) {
      return NextResponse.json(
        { error: "Persona not found" },
        { status: 404 }
      )
    }

    // Prepare system message with persona details
    const systemMessage = {
      role: "system",
      content: `You are ${persona.name}, a ${persona.age}-year-old ${persona.gender} from ${persona.location}. 
      You work as a ${persona.occupation}. 
      Your bio: ${persona.bio}
      Your interests: ${persona.interests.join(", ")}
      Your personality traits: ${persona.personality.join(", ")}
      You are looking for: ${persona.lookingFor}
      
      Respond as this persona would, maintaining their personality, interests, and communication style.`
    }

    // Add system message to the beginning of the conversation
    const messagesWithSystem = [systemMessage, ...messages]

    let response
    if (persona.model === "grok") {
      // Call Grok API
      const grokResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/grok`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesWithSystem,
          systemPrompt: systemMessage.content
        }),
      })

      if (!grokResponse.ok) {
        const errorData = await grokResponse.json()
        console.error("Grok API error:", errorData)
        throw new Error("Failed to get response from Grok")
      }

      response = await grokResponse.json()
    } else {
      // Call OpenAI API
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: messagesWithSystem,
        })

        response = {
          content: completion.choices[0].message.content
        }
      } catch (error) {
        console.error("OpenAI API error:", error)
        throw new Error("Failed to get response from OpenAI")
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get response" },
      { status: 500 }
    )
  }
}
