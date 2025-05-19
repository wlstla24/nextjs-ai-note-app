import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Create a test chat
    const chat = await prisma.chats.create({
      data: {
        userId: 'test-user',
        personaId: 'persona1',
      },
    })

    console.log('Created test chat:', chat)

    // Create a test message
    const message = await prisma.messages.create({
      data: {
        role: 'user',
        content: 'This is a test message',
        chatId: chat.id,
      },
    })

    console.log('Created test message:', message)
  } catch (error) {
    console.error('Error creating test data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 