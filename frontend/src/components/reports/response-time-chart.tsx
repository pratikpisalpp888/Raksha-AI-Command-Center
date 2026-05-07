"use client"

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { time: "0-2s", count: 245 },
  { time: "2-4s", count: 520 },
  { time: "4-6s", count: 680 },
  { time: "6-8s", count: 890 },
  { time: "8-10s", count: 420 },
  { time: "10-15s", count: 180 },
  { time: "15-20s", count: 75 },
  { time: "20-30s", count: 45 },
  { time: "30s+", count: 22 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--glass)] backdrop-blur-xl border border-[var(--glass-border)] rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Responses: <span className="font-medium text-foreground">{payload[0].value}</span>
        </p>
      </div>
    )
  }
  return null
}

export function ResponseTimeChart() {
  return (
    <Card className="bg-[var(--glass)] backdrop-blur-xl border-[var(--glass-border)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Response Time Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#27ae60]/60" />
            <span className="text-muted-foreground">Target (0-10s)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#e67e22]/60" />
            <span className="text-muted-foreground">Warning (10-30s)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#e74c3c]/60" />
            <span className="text-muted-foreground">Critical (30s+)</span>
          </div>
        </div>
        <div className="h-[230px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#27ae60" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="#e67e22" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e74c3c" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#27ae60"
                strokeWidth={2}
                fill="url(#responseGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
