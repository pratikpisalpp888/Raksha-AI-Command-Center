"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Clock, MapPin, Globe } from "lucide-react"

const hourlyData = Array.from({ length: 24 }, (_, i) => {
  const hour = i
  let intensity = 0.2
  if (hour >= 22 || hour <= 2) intensity = 0.9
  else if (hour >= 18 && hour <= 21) intensity = 0.7
  else if (hour >= 8 && hour <= 17) intensity = 0.4
  else intensity = 0.3
  return { hour, intensity }
})

const languageConfidence = [
  { lang: "Hindi", confidence: 96 },
  { lang: "Kannada", confidence: 94 },
  { lang: "English", confidence: 98 },
  { lang: "Tamil", confidence: 91 },
  { lang: "Telugu", confidence: 89 },
]

export function InsightsSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-[var(--saffron)]" />
        <h2 className="text-xl font-bold text-foreground">AI INSIGHTS</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Peak Hours Insight */}
        <Card className="bg-[var(--glass)] backdrop-blur-xl border-[var(--glass-border)]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <CardTitle className="text-sm font-semibold text-foreground">
                Peak Hours Analysis
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-foreground">
                Peak call volume: <span className="font-semibold text-[var(--saffron)]">10PM - 2AM</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Recommend: Increase AI capacity at night
              </p>
            </div>
            
            {/* 24-hour heatmap */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">24-Hour Activity Heatmap</div>
              <div className="grid grid-cols-12 gap-0.5">
                {hourlyData.map(({ hour, intensity }) => (
                  <div
                    key={hour}
                    className="aspect-square rounded-sm transition-all hover:scale-110"
                    style={{
                      backgroundColor: `rgba(230, 126, 34, ${intensity})`,
                    }}
                    title={`${hour}:00 - ${intensity > 0.7 ? "High" : intensity > 0.4 ? "Medium" : "Low"} activity`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>12AM</span>
                <span>6AM</span>
                <span>12PM</span>
                <span>6PM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Hotspot Insight */}
        <Card className="bg-[var(--glass)] backdrop-blur-xl border-[var(--glass-border)]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📍</span>
              <CardTitle className="text-sm font-semibold text-foreground">
                Location Hotspot
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-foreground">
                Koramangala has <span className="font-semibold text-[var(--danger)]">23%</span> of all cases
              </p>
              <p className="text-xs text-muted-foreground">
                Recommend: Pre-position PCR van
              </p>
            </div>
            
            {/* Mini map visualization */}
            <div className="relative h-32 bg-secondary/50 rounded-lg overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 p-2">
                {Array.from({ length: 16 }, (_, i) => {
                  const hotspots = [5, 6, 9, 10]
                  const isHotspot = hotspots.includes(i)
                  const intensity = isHotspot ? 0.6 + Math.random() * 0.4 : 0.1 + Math.random() * 0.2
                  return (
                    <div
                      key={i}
                      className="rounded transition-all"
                      style={{
                        backgroundColor: `rgba(230, 126, 34, ${intensity})`,
                      }}
                    />
                  )
                })}
              </div>
              <div className="absolute top-2 left-2 px-2 py-1 bg-background/80 rounded text-[10px] text-foreground">
                Bangalore
              </div>
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[var(--danger)]" />
                <span className="text-[10px] text-foreground">Koramangala</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Pattern Insight */}
        <Card className="bg-[var(--glass)] backdrop-blur-xl border-[var(--glass-border)]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌐</span>
              <CardTitle className="text-sm font-semibold text-foreground">
                Language Pattern
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-foreground">
                Hindi + Kannada = <span className="font-semibold text-[var(--saffron)]">75%</span> of calls
              </p>
              <p className="text-xs text-muted-foreground">
                AI accuracy: 94% for these languages
              </p>
            </div>
            
            {/* Language confidence bars */}
            <div className="space-y-2">
              {languageConfidence.map(({ lang, confidence }) => (
                <div key={lang} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{lang}</span>
                    <span className="text-foreground font-medium">{confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${confidence}%`,
                        backgroundColor: confidence >= 95 ? "#27ae60" : confidence >= 90 ? "#e67e22" : "#f1c40f",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
