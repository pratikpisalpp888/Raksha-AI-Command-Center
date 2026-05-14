"use client"

import { MapPin, Navigation, Route, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface LocationDetailsProps {
  extractedLocation: string
  coordinates: string
  nearestPolice: string
  policeDistance: string
  dispatchRoute: string
}

export function LocationDetails({
  extractedLocation,
  coordinates,
  nearestPolice,
  policeDistance,
  dispatchRoute,
}: LocationDetailsProps) {
  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-4 border-b border-border/30">
        <CardTitle className="text-sm font-semibold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4 text-saffron" />
          Location Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Enhanced Map Visualization */}
        <div className="relative h-[200px] bg-secondary/30 rounded-xl mb-5 overflow-hidden border border-border/30">
          {/* Grid Background */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border/30" />
                </pattern>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(251, 146, 60)" stopOpacity="1" />
                  <stop offset="100%" stopColor="rgb(96, 165, 250)" stopOpacity="1" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Stylized Roads */}
              <path
                d="M0 100 Q80 100 140 70 T260 80 T400 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted-foreground/20"
              />
              <path
                d="M180 0 Q180 40 160 90 T180 200"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted-foreground/20"
              />
              <path
                d="M0 160 Q100 150 200 170 T400 140"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-muted-foreground/15"
              />
              
              {/* Route Line */}
              <path
                d="M180 65 Q210 85 260 95 Q290 105 310 130"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="3"
                strokeDasharray="8 4"
                strokeLinecap="round"
                className="animate-pulse"
              />
            </svg>
          </div>

          {/* Incident Marker */}
          <div className="absolute top-[30%] left-[45%] -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute -inset-6 bg-critical/20 rounded-full animate-ping" />
              <div className="absolute -inset-4 bg-critical/10 rounded-full animate-pulse-slow" />
              <div className="relative bg-critical rounded-full p-2.5 shadow-lg shadow-critical/30">
                <MapPin className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          {/* Police Station Marker */}
          <div className="absolute bottom-[30%] right-[22%]">
            <div className="relative">
              <div className="absolute -inset-3 bg-info/20 rounded-full" />
              <div className="bg-info rounded-full p-2 shadow-lg shadow-info/30">
                <Navigation className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 flex items-center gap-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs border border-border/30">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-critical shadow-sm shadow-critical/50" />
              <span className="text-muted-foreground">Incident</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-info shadow-sm shadow-info/50" />
              <span className="text-muted-foreground">Police</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-gradient-to-r from-saffron to-info rounded" />
              <span className="text-muted-foreground">Route</span>
            </div>
          </div>

          {/* ETA Badge */}
          <div className="absolute top-3 right-3 bg-success/20 text-success border border-success/30 rounded-lg px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
            ETA: 4 min
          </div>
        </div>

        {/* Location Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <LocationItem
            icon={<MapPin className="h-4 w-4" />}
            iconColor="text-saffron"
            label="Extracted Location"
            value={extractedLocation}
          />
          <LocationItem
            icon={<Globe className="h-4 w-4" />}
            iconColor="text-muted-foreground"
            label="Coordinates"
            value={coordinates}
            mono
          />
          <LocationItem
            icon={<Navigation className="h-4 w-4" />}
            iconColor="text-info"
            label="Nearest Police"
            value={`${nearestPolice} (${policeDistance})`}
          />
          <LocationItem
            icon={<Route className="h-4 w-4" />}
            iconColor="text-success"
            label="Dispatch Route"
            value={dispatchRoute}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function LocationItem({
  icon,
  iconColor,
  label,
  value,
  mono = false
}: {
  icon: React.ReactNode
  iconColor: string
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="bg-secondary/30 rounded-lg p-3 border border-border/30 hover:bg-secondary/50 transition-colors">
      <div className={cn("flex items-center gap-2 mb-1.5", iconColor)}>
        {icon}
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <p className={cn(
        "font-medium text-foreground text-sm",
        mono && "font-mono text-xs"
      )}>
        {value}
      </p>
    </div>
  )
}
