"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { date: "Apr 28", calm: 45, anxious: 30, distressed: 18, critical: 7 },
  { date: "Apr 29", calm: 42, anxious: 32, distressed: 20, critical: 6 },
  { date: "Apr 30", calm: 48, anxious: 28, distressed: 17, critical: 7 },
  { date: "May 1", calm: 38, anxious: 35, distressed: 19, critical: 8 },
  { date: "May 2", calm: 44, anxious: 30, distressed: 18, critical: 8 },
  { date: "May 3", calm: 50, anxious: 26, distressed: 17, critical: 7 },
  { date: "May 4", calm: 46, anxious: 29, distressed: 18, critical: 7 },
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
            <span className="text-muted-foreground capitalize">{entry.name}:</span>
            <span className="font-medium text-foreground">{entry.value}%</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function EmotionBreakdownChart() {
  return (
    <Card className="bg-[var(--glass)] backdrop-blur-xl border-[var(--glass-border)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Daily Emotion Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "10px" }}
                formatter={(value) => (
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px" }}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </span>
                )}
              />
              <Bar dataKey="calm" name="calm" stackId="a" fill="#27ae60" radius={[0, 0, 0, 0]} />
              <Bar dataKey="anxious" name="anxious" stackId="a" fill="#f1c40f" radius={[0, 0, 0, 0]} />
              <Bar dataKey="distressed" name="distressed" stackId="a" fill="#e67e22" radius={[0, 0, 0, 0]} />
              <Bar dataKey="critical" name="critical" stackId="a" fill="#e74c3c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
