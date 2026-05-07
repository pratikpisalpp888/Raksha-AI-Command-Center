"use client"

import { Link2, MapPin, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RelatedCase {
  id: string
  intent: string
  location: string
  date: string
  status: "resolved" | "dispatched" | "pending"
}

interface RelatedCasesProps {
  cases: RelatedCase[]
}

const statusConfig = {
  resolved: { 
    label: "Resolved",
    className: "bg-success/15 text-success border-success/30" 
  },
  dispatched: { 
    label: "Active",
    className: "bg-info/15 text-info border-info/30" 
  },
  pending: { 
    label: "Pending",
    className: "bg-warning/15 text-warning border-warning/30" 
  },
}

export function RelatedCases({ cases }: RelatedCasesProps) {
  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-4 border-b border-border/30">
        <CardTitle className="text-sm font-semibold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
          <Link2 className="h-4 w-4 text-saffron" />
          Similar Cases Nearby
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-3">
        {cases.map((relatedCase, index) => {
          const status = statusConfig[relatedCase.status]
          return (
            <div
              key={relatedCase.id}
              className={cn(
                "group rounded-xl p-4 border border-border/30 transition-all duration-200",
                "hover:border-saffron/30 hover:bg-saffron/5 cursor-pointer"
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono text-sm font-semibold text-saffron">
                  {relatedCase.id}
                </span>
                <Badge
                  variant="outline"
                  className={cn("text-[10px] px-2 py-0.5", status.className)}
                >
                  {status.label}
                </Badge>
              </div>
              
              <p className="text-sm font-medium text-foreground mb-2">{relatedCase.intent}</p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{relatedCase.location}</span>
                </div>
                <span className="font-mono">{relatedCase.date}</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-saffron hover:text-saffron-light hover:bg-saffron/10 h-8 text-xs font-medium group"
              >
                View Case
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
