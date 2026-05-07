"use client"

import { useState } from "react"
import { StickyNote, Plus, User, Bot } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Note {
  id: string
  text: string
  author: string
  timestamp: string
}

interface CaseNotesProps {
  notes: Note[]
}

export function CaseNotes({ notes: initialNotes }: CaseNotesProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [newNote, setNewNote] = useState("")

  const handleAddNote = () => {
    if (!newNote.trim()) return
    
    const note: Note = {
      id: Date.now().toString(),
      text: newNote,
      author: "Current User",
      timestamp: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
    
    setNotes([note, ...notes])
    setNewNote("")
  }

  const isAINote = (author: string) => author.toLowerCase().includes("ai") || author.toLowerCase().includes("system")

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-4 border-b border-border/30">
        <CardTitle className="text-sm font-semibold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-saffron" />
          Case Notes
          <span className="ml-auto text-xs font-normal text-muted-foreground/60">{notes.length} notes</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <div className="space-y-3">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="bg-secondary/50 border-border/50 focus:border-saffron focus:ring-saffron/20 resize-none min-h-[80px] text-sm"
          />
          <Button 
            onClick={handleAddNote}
            size="sm"
            className="w-full bg-saffron text-primary-foreground hover:bg-saffron-light font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>

        {notes.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border/30">
            {notes.map((note) => {
              const isAI = isAINote(note.author)
              return (
                <div 
                  key={note.id} 
                  className={cn(
                    "rounded-xl p-3.5 border transition-colors",
                    isAI 
                      ? "bg-saffron/5 border-saffron/20" 
                      : "bg-secondary/30 border-border/30 hover:border-border/50"
                  )}
                >
                  <p className="text-sm text-foreground mb-3 leading-relaxed">{note.text}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      {isAI ? (
                        <Bot className="h-3 w-3 text-saffron" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      <span className={cn(isAI && "text-saffron")}>{note.author}</span>
                    </div>
                    <span className="font-mono text-[10px]">{note.timestamp}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
