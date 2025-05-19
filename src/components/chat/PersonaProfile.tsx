import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Persona } from "./types"

interface PersonaProfileProps {
  persona: Persona
}

function isEmoji(str: string): boolean {
  return str.length === 2 && str.charCodeAt(0) >= 0xD800 && str.charCodeAt(0) <= 0xDBFF
}

export function PersonaProfile({ persona }: PersonaProfileProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start space-x-4">
        <div className="relative w-24 h-24">
          {isEmoji(persona.avatar) ? (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-muted rounded-full">
              {persona.avatar}
            </div>
          ) : (
            <Image
              src={persona.avatar}
              alt={persona.name}
              fill
              className="object-cover rounded-full"
            />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{persona.name}</h2>
          <p className="text-sm text-muted-foreground">
            {persona.age} • {persona.gender} • {persona.location}
          </p>
          <p className="text-sm text-muted-foreground">{persona.occupation}</p>
          <p className="mt-2">{persona.bio}</p>
          <div className="mt-2">
            <p className="text-sm font-medium">Interests:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {persona.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium">Personality:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {persona.personality.map((trait, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium">Looking for:</p>
            <p className="text-sm">{persona.lookingFor}</p>
          </div>
        </div>
      </div>
    </Card>
  )
} 