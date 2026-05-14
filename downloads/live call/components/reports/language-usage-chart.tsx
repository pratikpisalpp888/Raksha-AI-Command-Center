"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "Hindi", value: 42, color: "#e67e22" },
  { name: "Kannada", value: 33, color: "#27ae60" },
  { name: "English", value: 15, color: "#3498db" },
  { name: "Tamil", value: 6, color: "#9b59b6" },
  { name: "Telugu", value: 4, color: "#f1c40f" },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0]
    return (
      <div className="bg-[var(--glass)] backdrop-blur-xl border border-[var(--glass-border)] rounded-lg p-3 shadow-xl">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.payload.color }}
          />
          <span className="text-sm font-medium text-foreground">{item.name}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Usage: <span className="font-medium text-foreground">{item.value}%</span>
        </p>
      </div>
    )
  }
  return null
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.05) return null

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function LanguageUsageChart() {
  return (
    <Card className="bg-[var(--glass)] backdrop-blur-xl border-[var(--glass-border)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Language Usage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px" }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
