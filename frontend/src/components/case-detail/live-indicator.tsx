"use client"

import { Radio, Car, MapPin, Clock } from "lucide-react"

export function LiveIndicator() {
  return (
    <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-12">
          {/* Live Status */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-success rounded-full" />
                <div className="absolute inset-0 w-2 h-2 bg-success rounded-full animate-ping" />
              </div>
              <span className="text-xs font-medium text-success uppercase tracking-wider">Live</span>
            </div>
            
            <div className="h-4 w-px bg-border/50" />
            
            <div className="flex items-center gap-4">
              <StatusItem
                icon={<Car className="h-3.5 w-3.5" />}
                label="PCR Van"
                value="Alpha-1"
                color="text-info"
              />
              <StatusItem
                icon={<MapPin className="h-3.5 w-3.5" />}
                label="Distance"
                value="0.3km away"
                color="text-saffron"
              />
              <StatusItem
                icon={<Clock className="h-3.5 w-3.5" />}
                label="ETA"
                value="< 1 min"
                color="text-success"
              />
            </div>
          </div>
          
          {/* Responder Info */}
          <div className="flex items-center gap-3">
            <Radio className="h-4 w-4 text-saffron animate-pulse" />
            <span className="text-xs text-muted-foreground">
              Responding: <span className="text-foreground font-medium">SI Rajesh Kumar</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusItem({
  icon,
  label,
  value,
  color
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={color}>{icon}</span>
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-muted-foreground">{label}:</span>
        <span className={`font-medium ${color}`}>{value}</span>
      </div>
    </div>
  )
}
