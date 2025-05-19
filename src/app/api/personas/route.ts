import { NextResponse } from "next/server"
import prisma from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs"

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Fetching personas...")
    const personas = await prisma.persona.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    console.log("Found personas:", personas)
    return NextResponse.json(personas)
  } catch (error) {
    console.error("Error fetching personas:", error)
    return NextResponse.json(
      { error: "Failed to fetch personas" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Received persona creation request:", body)
    const { 
      name, 
      age, 
      gender, 
      location, 
      occupation, 
      bio, 
      interests, 
      personality, 
      lookingFor, 
      avatar 
    } = body

    // Validate required fields
    if (!name || !age || !gender || !location || !occupation || !bio || !interests || !personality || !lookingFor || !avatar) {
      console.error("Missing required fields:", body)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate age
    if (age < 18 || age > 100) {
      return NextResponse.json(
        { error: "Age must be between 18 and 100" },
        { status: 400 }
      )
    }

    const persona = await prisma.persona.create({
      data: {
        name,
        age,
        gender,
        location,
        occupation,
        bio,
        interests,
        personality,
        lookingFor,
        avatar,
        userId
      }
    })
    console.log("Created persona:", persona)

    return NextResponse.json(persona)
  } catch (error) {
    console.error("Error creating persona:", error)
    return NextResponse.json(
      { error: "Failed to create persona" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: "Persona ID is required" },
        { status: 400 }
      )
    }

    // Delete all related chats and messages first
    await prisma.$transaction(async (tx) => {
      // Get all chats for this persona
      const chats = await tx.chat.findMany({
        where: { personaId: id },
        select: { id: true }
      })

      // Delete all messages in these chats
      for (const chat of chats) {
        await tx.message.deleteMany({
          where: { chatId: chat.id }
        })
      }

      // Delete all chats
      await tx.chat.deleteMany({
        where: { personaId: id }
      })

      // Finally delete the persona
      await tx.persona.delete({
        where: { id }
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting persona:", error)
    return NextResponse.json(
      { error: "Failed to delete persona" },
      { status: 500 }
    )
  }
} 