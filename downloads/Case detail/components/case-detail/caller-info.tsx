"use client"

import { Phone, Globe, Clock, Signal, MessageSquare, CheckCircle2, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CallerInfoProps {
  phone: string
  language: string
  duration: string
  callQuality: number
  smsConfirmed: boolean
}

export function CallerInfo({
  phone,
  language,
  duration,
  callQuality,
  smsConfirmed,
}: CallerInfoProps) {
  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-4 border-b border-border/30">
        <CardTitle className="text-sm font-semibold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
          <User className="h-4 w-4 text-saffron" />
          Caller Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <InfoRow
          icon={<Phone className="h-4 w-4" />}
          label="Phone Number"
          value={phone}
          mono
        />
        
        <InfoRow
          icon={<Globe className="h-4 w-4" />}
          label="Language"
          value={language}
        />
        
        <InfoRow
          icon={<Clock className="h-4 w-4" />}
          label="Call Duration"
          value={duration}
          mono
        />

        {/* Call Quality Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Signal className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Call Quality</span>
            </div>
            <span className="font-mono text-sm font-medium text-foreground">{callQuality}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                callQuality >= 80 ? "bg-success" : callQuality >= 60 ? "bg-saffron" : "bg-critical"
              )}
              style={{ width: `${callQuality}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground/60">
            <span>Poor</span>
            <span>Fair</span>
            <span>Good</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* SMS Confirmation */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">SMS Confirmation</span>
          </div>
          {smsConfirmed ? (
            <div className="flex items-center gap-1.5 text-success">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Sent</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Pending</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function InfoRow({ 
  icon, 
  label, 
  value, 
  mono = false 
}: { 
  icon: React.ReactNode
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <span className={cn(
        "text-sm font-medium text-foreground",
        mono && "font-mono"
      )}>
        {value}
      </span>
    </div>
  )
}
