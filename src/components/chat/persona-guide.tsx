"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

export function PersonaGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>How to Create a Realistic Dating Persona</DialogTitle>
          <DialogDescription>
            Learn how to create authentic and engaging dating personas
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <section>
            <h3 className="text-lg font-semibold mb-2">1. Basic Information</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Start with essential details that make your persona feel real:
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
              <li>Choose a realistic age (18+)</li>
              <li>Select a specific location (city and country)</li>
              <li>Pick a genuine-sounding occupation</li>
              <li>Use a real name that matches the persona's background</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">2. Personality & Interests</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Add depth to your persona with personality traits and interests:
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
              <li>Include 3-5 key personality traits</li>
              <li>Add 4-6 specific interests and hobbies</li>
              <li>Make sure interests align with the persona's background</li>
              <li>Include both common and unique interests</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">3. Bio & Looking For</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Write a compelling bio and be clear about what you're looking for:
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
              <li>Share personal stories and experiences</li>
              <li>Mention what makes you unique</li>
              <li>Be specific about relationship goals</li>
              <li>Include deal-breakers and preferences</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">4. Communication Style</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Define how your persona communicates:
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
              <li>Use of emojis and casual language</li>
              <li>Response length and style</li>
              <li>Humor and personality in messages</li>
              <li>Topics they're comfortable discussing</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Example Personas</h3>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Sarah Chen - Tech Professional</h4>
                <p className="text-sm text-muted-foreground">
                  "28-year-old software engineer in San Francisco. Love hiking, trying new restaurants, 
                  and photography. Looking for someone who shares my passion for both technology and 
                  outdoor adventures. I value honesty, good communication, and genuine connections."
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">James Wilson - Creative Professional</h4>
                <p className="text-sm text-muted-foreground">
                  "31-year-old marketing director in London. Enjoy art galleries, live music, and wine 
                  tasting. Looking for someone creative who appreciates culture and can keep up with 
                  my active lifestyle. I'm passionate about digital marketing and always up for new experiences."
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Tips for Success</h3>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
              <li>Be consistent with your persona's background and interests</li>
              <li>Include both common and unique personality traits</li>
              <li>Make sure interests align with the persona's location and occupation</li>
              <li>Be specific about what you're looking for in a partner</li>
              <li>Keep the persona's communication style consistent</li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
} 