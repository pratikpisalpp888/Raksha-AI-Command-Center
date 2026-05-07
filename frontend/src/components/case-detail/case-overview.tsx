"use client"

import { AlertTriangle, Brain, Clock, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CaseOverviewProps {
  caseId: string
  priority: "critical" | "high" | "medium" | "low"
  emotion: string
  emotionScore: number
  intent: string
  duration: string
  timestamp: string
}

const priorityConfig = {
  critical: { 
    label: "CRITICAL", 
    color: "bg-critical", 
    textColor: "text-critical",
    glowClass: "shadow-[0_0_20px_rgba(239,68,68,0.2)]"
  },
  high: { 
    label: "HIGH", 
    color: "bg-warning", 
    textColor: "text-warning",
    glowClass: ""
  },
  medium: { 
    label: "MEDIUM", 
    color: "bg-saffron", 
    textColor: "text-saffron",
    glowClass: ""
  },
  low: { 
    label: "LOW", 
    color: "bg-success", 
    textColor: "text-success",
    glowClass: ""
  },
}

export function CaseOverview({
  caseId,
  priority,
  emotion,
  emotionScore,
  intent,
  duration,
  timestamp,
}: CaseOverviewProps) {
  const priorityInfo = priorityConfig[priority]

  return (
    <Card className={cn(
      "overflow-hidden bg-card border-border/50 relative",
      priorityInfo.glowClass
    )}>
      {/* Priority Bar with Gradient */}
      <div className={cn("h-1", priorityInfo.color)} />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-saffron/5 via-transparent to-transparent pointer-events-none" />
      
      <CardContent className="p-6 relative">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={<AlertTriangle className="h-4 w-4" />}
            label="Priority"
            value={priorityInfo.label}
            valueColor={priorityInfo.textColor}
            accentColor={priorityInfo.color}
          />
          <StatCard
            icon={<Brain className="h-4 w-4" />}
            label="Emotion"
            value={`${emotion} ${emotionScore}%`}
            valueColor="text-critical"
            accentColor="bg-critical"
          />
          <StatCard
            icon={<Target className="h-4 w-4" />}
            label="Intent"
            value={intent}
            valueColor="text-foreground"
            accentColor="bg-saffron"
          />
          <StatCard
            icon={<Clock className="h-4 w-4" />}
            label="Duration"
            value={duration}
            valueColor="text-foreground"
            accentColor="bg-info"
            mono
          />
        </div>

        {/* Case ID & Timestamp */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Case Identifier</p>
            <p className="font-mono text-3xl font-bold text-gradient-saffron tracking-wider">
              {caseId}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Reported</p>
            <p className="text-sm text-foreground font-medium">
              {timestamp}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCard({ 
  icon, 
  label, 
  value, 
  valueColor, 
  accentColor,
  mono = false 
}: { 
  icon: React.ReactNode
  label: string
  value: string
  valueColor: string
  accentColor: string
  mono?: boolean
}) {
  return (
    <div className="group relative bg-secondary/30 rounded-xl p-4 border border-border/30 hover:border-border/60 transition-all duration-300 hover:bg-secondary/50">
      {/* Accent line */}
      <div className={cn("absolute top-0 left-4 right-4 h-px", accentColor, "opacity-50")} />
      
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className={cn(
        "font-semibold text-sm leading-tight",
        valueColor,
        mono && "font-mono"
      )}>
        {value}
      </p>
    </div>
  )
}
