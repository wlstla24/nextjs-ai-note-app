import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import prisma from "@/lib/db/prisma"

// POST /api/chats/[chatId]/messages - Add a new message to a chat
export async function POST(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { role, content } = await req.json()

    // Verify the chat belongs to the user
    const chat = await prisma.chat.findFirst({
      where: {
        id: params.chatId,
        userId
      }
    })

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    const message = await prisma.message.create({
      data: {
        role,
        content,
        chatId: params.chatId
      }
    })

    // Update the chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: params.chatId },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    )
  }
}

// GET /api/chats/[chatId]/messages - Get all messages for a chat
export async function GET(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the chat belongs to the user
    const chat = await prisma.chat.findFirst({
      where: {
        id: params.chatId,
        userId
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" }
        }
      }
    })

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    return NextResponse.json(chat.messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
} 