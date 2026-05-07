"use client"

import { Download, MessageSquare, Bot, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  speaker: "ai" | "caller"
  time: string
  text: string
}

interface CallTranscriptProps {
  language: string
  messages: Message[]
}

export function CallTranscript({ language, messages }: CallTranscriptProps) {
  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-saffron" />
            Call Transcript
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className="border-saffron/30 text-saffron bg-saffron/10 px-2.5 py-0.5 text-xs font-medium"
            >
              {language}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground h-8 px-3 text-xs"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[420px]">
          <div className="p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-3",
                  message.speaker === "ai" ? "justify-start" : "justify-end"
                )}
              >
                {message.speaker === "ai" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-saffron/20 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-saffron" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[75%] rounded-xl px-4 py-3 relative",
                    message.speaker === "ai"
                      ? "bg-saffron/10 border border-saffron/20"
                      : "bg-secondary border border-border/50"
                  )}
                >
                  {/* Triangle pointer */}
                  <div className={cn(
                    "absolute top-3 w-2 h-2 rotate-45",
                    message.speaker === "ai" 
                      ? "-left-1 bg-saffron/10 border-l border-b border-saffron/20"
                      : "-right-1 bg-secondary border-r border-t border-border/50"
                  )} />
                  
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={cn(
                        "text-xs font-semibold uppercase tracking-wider",
                        message.speaker === "ai" ? "text-saffron" : "text-muted-foreground"
                      )}
                    >
                      {message.speaker === "ai" ? "Raksha AI" : "Caller"}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 font-mono">
                      {message.time}
                    </span>
                  </div>
                  <p className="text-foreground leading-relaxed text-[15px]">{message.text}</p>
                </div>
                
                {message.speaker === "caller" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center border border-border/50">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
