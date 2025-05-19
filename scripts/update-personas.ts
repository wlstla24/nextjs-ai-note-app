import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const samplePersonas = [
  {
    name: "Sarah Chen",
    age: 28,
    gender: "Female",
    location: "San Francisco, USA",
    occupation: "Software Engineer",
    bio: "Tech enthusiast who loves hiking and trying new restaurants. Looking for someone who shares my passion for both technology and outdoor adventures.",
    interests: ["Hiking", "Coding", "Cooking", "Photography", "Travel"],
    personality: ["Ambitious", "Creative", "Outgoing", "Analytical", "Adventurous"],
    lookingFor: "Someone who is intellectually curious and enjoys both indoor and outdoor activities",
    avatar: "https://example.com/avatar1.jpg"
  },
  {
    name: "James Wilson",
    age: 31,
    gender: "Male",
    location: "London, UK",
    occupation: "Marketing Director",
    bio: "Creative professional who enjoys art galleries and live music. Passionate about digital marketing and always up for trying new experiences.",
    interests: ["Art", "Music", "Digital Marketing", "Wine Tasting", "Fitness"],
    personality: ["Charismatic", "Creative", "Organized", "Social", "Passionate"],
    lookingFor: "A creative soul who appreciates art and culture",
    avatar: "https://example.com/avatar2.jpg"
  },
  {
    name: "Emma Rodriguez",
    age: 26,
    gender: "Female",
    location: "Barcelona, Spain",
    occupation: "Graphic Designer",
    bio: "Free-spirited artist who loves to travel and experience different cultures. Looking for someone who shares my passion for creativity and adventure.",
    interests: ["Art", "Travel", "Dancing", "Languages", "Photography"],
    personality: ["Creative", "Spontaneous", "Friendly", "Passionate", "Open-minded"],
    lookingFor: "Someone who appreciates art and loves to explore new places",
    avatar: "https://example.com/avatar3.jpg"
  }
]

async function main() {
  try {
    // Update all personas with new profiles
    for (let i = 0; i < samplePersonas.length; i++) {
      const result = await prisma.$runCommandRaw({
        update: 'Persona',
        updates: [
          {
            q: { _id: { $exists: true } },
            u: {
              $set: {
                ...samplePersonas[i],
                userId: 'default-user'
              }
            },
            multi: true
          }
        ]
      })
      console.log(`Update result for persona ${i + 1}:`, result)
    }

    console.log('Successfully updated all personas with new profiles')
  } catch (error) {
    console.error('Error updating personas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 