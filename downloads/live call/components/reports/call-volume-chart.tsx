"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { date: "Apr 28", total: 320, resolved: 280, escalated: 18 },
  { date: "Apr 29", total: 385, resolved: 345, escalated: 22 },
  { date: "Apr 30", total: 420, resolved: 378, escalated: 15 },
  { date: "May 1", total: 510, resolved: 465, escalated: 25 },
  { date: "May 2", total: 445, resolved: 398, escalated: 20 },
  { date: "May 3", total: 390, resolved: 355, escalated: 14 },
  { date: "May 4", total: 377, resolved: 340, escalated: 13 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--glass)] backdrop-blur-xl border border-[var(--glass-border)] rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function CallVolumeChart() {
  return (
    <Card className="bg-[var(--glass)] backdrop-blur-xl border-[var(--glass-border)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Call Volume Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e67e22" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e67e22" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#27ae60" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#27ae60" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="escalatedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e74c3c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "10px" }}
                formatter={(value) => (
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>
                    {value}
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="total"
                name="Total Calls"
                stroke="#e67e22"
                strokeWidth={2}
                fill="url(#totalGradient)"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                name="Resolved"
                stroke="#27ae60"
                strokeWidth={2}
                fill="url(#resolvedGradient)"
              />
              <Area
                type="monotone"
                dataKey="escalated"
                name="Escalated"
                stroke="#e74c3c"
                strokeWidth={2}
                fill="url(#escalatedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
