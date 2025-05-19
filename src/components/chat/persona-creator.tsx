"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusCircle, Upload } from "lucide-react"
import { PersonaGuide } from "./persona-guide"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface Persona {
  id: string
  name: string
  age: number
  gender: string
  location: string
  occupation: string
  bio: string
  interests: string[]
  personality: string[]
  lookingFor: string
  avatar: string
  model: "openai" | "grok"
}

interface PersonaCreatorProps {
  onAddPersona: (persona: Omit<Persona, "id">) => void
}

const DEFAULT_BIO = `I am a person who is looking for meaningful connections and interested in dating. I enjoy getting to know new people and exploring potential romantic relationships. I value honesty, good communication, and genuine connections.`

export function PersonaCreator({ onAddPersona }: PersonaCreatorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newPersona, setNewPersona] = useState<Omit<Persona, "id">>({
    name: "",
    age: 25,
    gender: "",
    location: "",
    occupation: "",
    bio: DEFAULT_BIO,
    interests: [],
    personality: [],
    lookingFor: "",
    avatar: "/default-avatar.png",
    model: "openai"
  })

  const [newInterest, setNewInterest] = useState("")
  const [newPersonality, setNewPersonality] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      setNewPersona(prev => ({
        ...prev,
        avatar: data.url
      }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    }
  }

  const handleAddInterest = () => {
    if (newInterest && !newPersona.interests.includes(newInterest)) {
      setNewPersona({
        ...newPersona,
        interests: [...newPersona.interests, newInterest]
      })
      setNewInterest("")
    }
  }

  const handleAddPersonality = () => {
    if (newPersonality && !newPersona.personality.includes(newPersonality)) {
      setNewPersona({
        ...newPersona,
        personality: [...newPersona.personality, newPersonality]
      })
      setNewPersonality("")
    }
  }

  const handleRemoveInterest = (interest: string) => {
    setNewPersona({
      ...newPersona,
      interests: newPersona.interests.filter(i => i !== interest)
    })
  }

  const handleRemovePersonality = (trait: string) => {
    setNewPersona({
      ...newPersona,
      personality: newPersona.personality.filter(p => p !== trait)
    })
  }

  const handleAddPersona = () => {
    if (!newPersona.name || !newPersona.bio || !newPersona.gender || !newPersona.location || !newPersona.occupation || !newPersona.lookingFor) return

    onAddPersona(newPersona)
    setNewPersona({
      name: "",
      age: 25,
      gender: "",
      location: "",
      occupation: "",
      bio: DEFAULT_BIO,
      interests: [],
      personality: [],
      lookingFor: "",
      avatar: "/default-avatar.png",
      model: "openai"
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Persona
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Dating Persona</DialogTitle>
          <DialogDescription>
            Create a new AI persona for dating. Make it realistic and detailed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddPersona} className="space-y-4">
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-muted-foreground/25">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <Label
                  htmlFor="avatar-upload"
                  className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Upload Image
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended size: 400x400px
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newPersona.name}
                onChange={(e) => setNewPersona({ ...newPersona, name: e.target.value })}
                placeholder="Full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="100"
                value={newPersona.age}
                onChange={(e) => setNewPersona({ ...newPersona, age: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={newPersona.gender}
                onValueChange={(value) => setNewPersona({ ...newPersona, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Non-binary">Non-binary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newPersona.location}
                onChange={(e) => setNewPersona({ ...newPersona, location: e.target.value })}
                placeholder="City, Country"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              value={newPersona.occupation}
              onChange={(e) => setNewPersona({ ...newPersona, occupation: e.target.value })}
              placeholder="Current job or profession"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={newPersona.bio}
              onChange={(e) => setNewPersona({ ...newPersona, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Interests</Label>
            <div className="flex gap-2">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest"
              />
              <Button type="button" onClick={handleAddInterest}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {newPersona.interests.map((interest) => (
                <div key={interest} className="bg-secondary px-2 py-1 rounded-full flex items-center gap-1">
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="text-xs hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Personality Traits</Label>
            <div className="flex gap-2">
              <Input
                value={newPersonality}
                onChange={(e) => setNewPersonality(e.target.value)}
                placeholder="Add a personality trait"
              />
              <Button type="button" onClick={handleAddPersonality}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {newPersona.personality.map((trait) => (
                <div key={trait} className="bg-secondary px-2 py-1 rounded-full flex items-center gap-1">
                  {trait}
                  <button
                    type="button"
                    onClick={() => handleRemovePersonality(trait)}
                    className="text-xs hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lookingFor">Looking For</Label>
            <Textarea
              id="lookingFor"
              value={newPersona.lookingFor}
              onChange={(e) => setNewPersona({ ...newPersona, lookingFor: e.target.value })}
              placeholder="What are you looking for in a partner?"
              required
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Select
              value={newPersona.model}
              onValueChange={(value: "openai" | "grok") => 
                setNewPersona({ ...newPersona, model: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                <SelectItem value="grok">Grok</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <PersonaGuide />
            <Button type="submit">Create Persona</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 