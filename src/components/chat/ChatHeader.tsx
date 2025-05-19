import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Persona } from "./types"

interface ChatHeaderProps {
  persona: Persona
  onBack: () => void
}

function isEmoji(str: string): boolean {
  return str.length === 2 && str.charCodeAt(0) >= 0xD800 && str.charCodeAt(0) <= 0xDBFF
}

export function ChatHeader({ persona, onBack }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Button
        variant="ghost"
        onClick={onBack}
      >
        ← Back
      </Button>
      <div className="relative w-12 h-12">
        {isEmoji(persona.avatar) ? (
          <div className="w-full h-full flex items-center justify-center text-2xl bg-muted rounded-full">
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
      <h2 className="text-xl font-bold">{persona.name}</h2>
    </div>
  )
} 