"use client"

import { CheckCircle2, ClipboardCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ActionsTakenProps {
  actions: string[]
}

export function ActionsTaken({ actions }: ActionsTakenProps) {
  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-4 border-b border-border/30">
        <CardTitle className="text-sm font-semibold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-saffron" />
          Actions Taken
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-2.5">
          {actions.map((action, index) => (
            <div 
              key={index} 
              className={cn(
                "flex items-start gap-3 p-2.5 rounded-lg transition-colors",
                "hover:bg-success/5 group"
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                <CheckCircle2 className="h-4 w-4 text-success group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-sm text-foreground leading-relaxed">{action}</span>
            </div>
          ))}
        </div>
        
        {/* Progress indicator */}
        <div className="mt-4 pt-4 border-t border-border/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Completion</span>
            <span className="text-success font-medium">{actions.length}/{actions.length} actions</span>
          </div>
          <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-success rounded-full w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
