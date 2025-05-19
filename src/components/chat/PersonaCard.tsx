import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Persona } from "./types"

interface PersonaCardProps {
  persona: Persona
  messageCount?: number
  onSelect: (persona: Persona) => void
  onDelete: (personaId: string, e: React.MouseEvent) => void
}

function isEmoji(str: string): boolean {
  return str.length === 2 && str.charCodeAt(0) >= 0xD800 && str.charCodeAt(0) <= 0xDBFF
}

function getUserDescription(bio: string): string {
  const defaultBio = `I am a person who is looking for meaningful connections and interested in dating. I enjoy getting to know new people and exploring potential romantic relationships. I value honesty, good communication, and genuine connections.`
  
  if (bio.startsWith(defaultBio)) {
    return bio.slice(defaultBio.length).trim()
  }
  
  return bio
}

export function PersonaCard({ persona, messageCount, onSelect, onDelete }: PersonaCardProps) {
  return (
    <Card
      className="p-4 cursor-pointer hover:bg-accent relative group"
      onClick={() => onSelect(persona)}
    >
      <Button
        variant="destructive"
        size="sm"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => onDelete(persona.id, e)}
      >
        Delete
      </Button>
      <div className="relative w-16 h-16 mb-2">
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
      <h3 className="text-xl font-bold">{persona.name}</h3>
      <p className="text-muted-foreground">{getUserDescription(persona.bio)}</p>
      {messageCount && messageCount > 0 && (
        <p className="text-sm text-muted-foreground mt-2">
          {messageCount} messages in conversation
        </p>
      )}
    </Card>
  )
} 