"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { intent: "Domestic Violence", cases: 892, color: "#e74c3c" },
  { intent: "Medical Emergency", cases: 654, color: "#e67e22" },
  { intent: "Harassment", cases: 523, color: "#f1c40f" },
  { intent: "Stalking", cases: 412, color: "#9b59b6" },
  { intent: "General Inquiry", cases: 234, color: "#3498db" },
  { intent: "False Alarm", cases: 132, color: "#95a5a6" },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0]
    return (
      <div className="bg-[var(--glass)] backdrop-blur-xl border border-[var(--glass-border)] rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-foreground">{item.payload.intent}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Cases: <span className="font-medium text-foreground">{item.value}</span>
        </p>
      </div>
    )
  }
  return null
}

export function IntentBreakdownChart() {
  return (
    <Card className="bg-[var(--glass)] backdrop-blur-xl border-[var(--glass-border)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Intent Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
              />
              <YAxis
                type="category"
                dataKey="intent"
                tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
                width={120}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
              <Bar dataKey="cases" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
