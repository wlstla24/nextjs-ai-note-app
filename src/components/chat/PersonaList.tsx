import { Persona } from "./types"
import { PersonaCard } from "./PersonaCard"
import { PersonaCreator } from "./persona-creator"

interface PersonaListProps {
  personas: Persona[]
  chatHistory: { [key: string]: any[] }
  onSelectPersona: (persona: Persona) => void
  onDeletePersona: (personaId: string, e: React.MouseEvent) => void
  onAddPersona: (newPersona: Omit<Persona, "id">) => void
}

export function PersonaList({ 
  personas, 
  chatHistory, 
  onSelectPersona, 
  onDeletePersona,
  onAddPersona 
}: PersonaListProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat with Others</h1>
        <PersonaCreator onAddPersona={onAddPersona} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.isArray(personas) && personas.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            messageCount={chatHistory[persona.id]?.length}
            onSelect={onSelectPersona}
            onDelete={onDeletePersona}
          />
        ))}
      </div>
    </div>
  )
} 