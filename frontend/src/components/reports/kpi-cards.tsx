"use client"

import { TrendingUp, TrendingDown, Phone, CheckCircle2, Clock, AlertTriangle, MessageSquare, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const kpiData = [
  {
    label: "Total Cases",
    value: "2,847",
    trend: "+12%",
    trendUp: true,
    icon: Phone,
    iconBg: "bg-[var(--saffron)]/20",
    iconColor: "text-[var(--saffron)]",
  },
  {
    label: "Resolved",
    value: "2,341",
    trend: "+8%",
    trendUp: true,
    icon: CheckCircle2,
    iconBg: "bg-[var(--success)]/20",
    iconColor: "text-[var(--success)]",
  },
  {
    label: "Avg Response Time",
    value: "8.2s",
    trend: "-15%",
    trendUp: true,
    icon: Clock,
    iconBg: "bg-[var(--saffron)]/20",
    iconColor: "text-[var(--saffron)]",
  },
  {
    label: "Escalated",
    value: "127",
    trend: "+3%",
    trendUp: false,
    icon: AlertTriangle,
    iconBg: "bg-[var(--danger)]/20",
    iconColor: "text-[var(--danger)]",
  },
  {
    label: "SMS Sent",
    value: "4,521",
    trend: "+22%",
    trendUp: true,
    icon: MessageSquare,
    iconBg: "bg-[var(--saffron)]/20",
    iconColor: "text-[var(--saffron)]",
  },
  {
    label: "Districts Covered",
    value: "48",
    trend: "+2",
    trendUp: true,
    icon: MapPin,
    iconBg: "bg-[var(--warning)]/20",
    iconColor: "text-[var(--warning)]",
  },
]

export function KPICards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpiData.map((kpi) => (
        <Card
          key={kpi.label}
          className="bg-[var(--glass)] backdrop-blur-xl border-[var(--glass-border)] hover:border-[var(--saffron)]/30 transition-all duration-300"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${kpi.iconBg}`}>
                <kpi.icon className={`w-4 h-4 ${kpi.iconColor}`} />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  kpi.trendUp ? "text-[var(--success)]" : "text-[var(--danger)]"
                }`}
              >
                {kpi.trendUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {kpi.trend}
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {kpi.value}
            </div>
            <div className="text-xs text-muted-foreground">{kpi.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
