"use client"

import { Brain, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AiAssessmentProps {
  intentConfidence: number
  emotionScore: number
  locationConfidence: number
  overallConfidence: number
}

export function AiAssessment({
  intentConfidence,
  emotionScore,
  locationConfidence,
  overallConfidence,
}: AiAssessmentProps) {
  return (
    <Card className="bg-card border-border/50 overflow-hidden relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-saffron/5 via-transparent to-transparent pointer-events-none" />
      
      <CardHeader className="pb-4 border-b border-border/30 relative">
        <CardTitle className="text-sm font-semibold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
          <Brain className="h-4 w-4 text-saffron" />
          AI Assessment
          <Sparkles className="h-3 w-3 text-saffron/60 ml-auto" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4 relative">
        <ConfidenceBar
          label="Intent Confidence"
          value={intentConfidence}
          color="bg-saffron"
          textColor="text-saffron"
        />
        
        <ConfidenceBar
          label="Emotion Score"
          value={emotionScore}
          color="bg-critical"
          textColor="text-critical"
        />
        
        <ConfidenceBar
          label="Location Confidence"
          value={locationConfidence}
          color="bg-info"
          textColor="text-info"
        />

        {/* Overall Score */}
        <div className="pt-4 mt-4 border-t border-border/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Overall AI Confidence</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-saffron to-saffron-light rounded-full transition-all duration-500"
                style={{ width: `${overallConfidence}%` }}
              />
            </div>
            <span className="font-mono text-2xl font-bold text-saffron min-w-[60px] text-right">
              {overallConfidence}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ConfidenceBar({
  label,
  value,
  color,
  textColor
}: {
  label: string
  value: number
  color: string
  textColor: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn("font-mono font-semibold", textColor)}>{value}%</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
