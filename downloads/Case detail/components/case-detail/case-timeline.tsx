"use client"

import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TimelineEvent {
  time: string
  offset: string
  title: string
  description: string
  type: "default" | "saffron" | "red" | "green" | "blue"
  size?: "normal" | "large"
}

interface CaseTimelineProps {
  events: TimelineEvent[]
}

const dotConfig = {
  default: { 
    bg: "bg-muted-foreground", 
    ring: "ring-muted-foreground/20",
    glow: ""
  },
  saffron: { 
    bg: "bg-saffron", 
    ring: "ring-saffron/30",
    glow: "shadow-[0_0_8px_rgba(251,146,60,0.4)]"
  },
  red: { 
    bg: "bg-critical", 
    ring: "ring-critical/30",
    glow: "shadow-[0_0_8px_rgba(239,68,68,0.4)]"
  },
  green: { 
    bg: "bg-success", 
    ring: "ring-success/30",
    glow: "shadow-[0_0_8px_rgba(74,222,128,0.4)]"
  },
  blue: { 
    bg: "bg-info", 
    ring: "ring-info/30",
    glow: "shadow-[0_0_8px_rgba(96,165,250,0.4)]"
  },
}

export function CaseTimeline({ events }: CaseTimelineProps) {
  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-4 border-b border-border/30">
        <CardTitle className="text-sm font-semibold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-saffron" />
          Incident Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative">
          {/* Vertical Line with Gradient */}
          <div className="absolute left-[9px] top-3 bottom-3 w-px bg-gradient-to-b from-saffron/60 via-saffron/30 to-success/40" />

          <div className="space-y-1">
            {events.map((event, index) => {
              const config = dotConfig[event.type]
              const isLarge = event.size === "large"
              
              return (
                <div 
                  key={index} 
                  className="relative flex gap-5 group py-3 px-2 -mx-2 rounded-lg hover:bg-secondary/30 transition-all duration-200"
                >
                  {/* Dot */}
                  <div className="relative z-10 flex-shrink-0 mt-1">
                    <div
                      className={cn(
                        "rounded-full ring-2 transition-all duration-300",
                        config.bg,
                        config.ring,
                        config.glow,
                        isLarge ? "w-5 h-5" : "w-4 h-4",
                        "group-hover:scale-125"
                      )}
                    />
                    {/* Pulse effect for large dots */}
                    {isLarge && (
                      <div className={cn(
                        "absolute inset-0 rounded-full animate-ping",
                        config.bg,
                        "opacity-30"
                      )} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="font-mono text-sm font-semibold text-saffron">
                        {event.time}
                      </span>
                      {event.offset && (
                        <span className="text-xs text-muted-foreground/70 font-mono">
                          {event.offset}
                        </span>
                      )}
                    </div>
                    <p className={cn(
                      "font-medium text-foreground mb-0.5",
                      isLarge && "text-base"
                    )}>
                      {event.title}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
