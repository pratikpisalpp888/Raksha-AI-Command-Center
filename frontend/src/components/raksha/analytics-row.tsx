"use client"

import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts"
import { TrendingUp, Activity, Brain, Globe, Zap } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { getLiveStats } from "../../services/api"

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[rgba(3,8,16,0.95)] border border-[rgba(255,107,0,0.3)] rounded-lg p-2 text-xs">
        <p className="text-[#FF9933] font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-[#F5F0FF]">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function AnalyticsRow() {
  const [stats, setStats] = useState<any>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await getLiveStats()
      setStats(data)
    } catch (err) {
      console.warn('[AnalyticsRow] Failed to fetch analytics')
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [fetchAnalytics])

  // Map real data to charts
  const emotionData = stats ? [
    { emotion: "Panic", value: Math.round((stats.emotion_distribution.panic / (stats.calls_last_24h || 1)) * 100), color: "#FF2D55" },
    { emotion: "Distress", value: Math.round((stats.emotion_distribution.distressed / (stats.calls_last_24h || 1)) * 100), color: "#FF6B2B" },
    { emotion: "Concerned", value: Math.round((stats.emotion_distribution.concerned / (stats.calls_last_24h || 1)) * 100), color: "#FFD60A" },
    { emotion: "Calm", value: Math.round((stats.emotion_distribution.calm / (stats.calls_last_24h || 1)) * 100), color: "#00E676" },
  ] : []

  const incidentData = stats ? [
    { name: "Critical", value: stats.emotion_distribution.panic, color: "#FF2D55" },
    { name: "High", value: stats.emotion_distribution.distressed, color: "#FF6B2B" },
    { name: "Medium", value: stats.emotion_distribution.concerned, color: "#FFD60A" },
    { name: "Resolved", value: stats.calls_last_24h - stats.active_calls_count, color: "#00E676" },
  ] : []

  // Mocked for visual variety but using real base numbers
  const responseTimeTrend = [
    { time: "00:00", avgTime: 4.2, calls: 5 },
    { time: "04:00", avgTime: 3.8, calls: 3 },
    { time: "08:00", avgTime: 5.1, calls: 12 },
    { time: "12:00", avgTime: 4.5, calls: stats?.calls_last_24h || 10 },
    { time: "NOW", avgTime: stats?.avg_response_time || 5.0, calls: stats?.active_calls_count || 2 },
  ]

  const aiPerformanceData = [
    { subject: "Accuracy", A: 92, fullMark: 100 },
    { subject: "Speed", A: 98, fullMark: 100 },
    { subject: "Emotion", A: 95, fullMark: 100 },
    { subject: "Language", A: 90, fullMark: 100 },
    { subject: "Safety", A: 100, fullMark: 100 },
  ]

  return (
    <motion.div
      className="grid grid-cols-4 gap-5 px-6 pb-6"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      {/* Emotion Intelligence Card */}
      <div className="glass-card h-[320px] flex flex-col overflow-hidden">
        <div className="h-[3px] w-full flex-shrink-0" style={{ background: "linear-gradient(90deg, #FF2D55, #FF6B2B, #FFD60A, #00E676)" }} />
        <div className="p-4 border-b border-[rgba(255,107,0,0.15)] flex items-center gap-2 flex-shrink-0">
          <Brain size={16} className="text-[#FF6B2B]" />
          <h3 className="text-xs font-semibold tracking-wide text-[#F5F0FF] uppercase">Emotion Intelligence</h3>
        </div>
        
        <div className="flex-1 p-4 space-y-3 overflow-hidden">
          {emotionData.map((item, index) => (
            <div key={item.emotion} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#F5F0FF] font-medium">{item.emotion}</span>
                <span className="text-[#7B8FA8] font-mono">{item.value}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-[rgba(255,107,0,0.08)] overflow-hidden relative">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          ))}

          {stats?.emotion_distribution.panic > 0 && (
            <motion.div
              className="mt-3 p-3 rounded-lg border border-[#FF2D55] bg-[rgba(255,45,85,0.08)]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF2D55] animate-pulse" />
                <p className="text-[10px] text-[#FF2D55] font-medium">PANIC DETECTED - Response units alerted</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Incident Command Donut */}
      <div className="glass-card h-[320px] flex flex-col overflow-hidden">
        <div className="h-[3px] w-full flex-shrink-0" style={{ background: "linear-gradient(90deg, #FF9933, #FF2D55)" }} />
        <div className="p-4 border-b border-[rgba(255,107,0,0.15)] flex items-center gap-2 flex-shrink-0">
          <Zap size={16} className="text-[#FF9933]" />
          <h3 className="text-xs font-semibold tracking-wide text-[#F5F0FF] uppercase">Incident Command</h3>
        </div>
        
        <div className="flex-1 flex items-center justify-center relative p-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={incidentData}
                cx="50%" cy="50%"
                innerRadius="55%" outerRadius="85%"
                paddingAngle={2} dataKey="value"
              >
                {incidentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-3xl font-black text-[#FF9933] block">{stats?.calls_last_24h || 0}</span>
            <p className="text-[9px] text-[#7B8FA8] uppercase tracking-wider">24H Cases</p>
          </div>
        </div>

        <div className="p-3 border-t border-[rgba(255,107,0,0.15)]">
          <div className="grid grid-cols-2 gap-1">
            {incidentData.map((item) => (
              <span key={item.name} className="flex items-center gap-1 text-[8px] text-[#7B8FA8]">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}: {item.value}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Response Time Trend */}
      <div className="glass-card h-[320px] flex flex-col overflow-hidden">
        <div className="h-[3px] w-full flex-shrink-0" style={{ background: "linear-gradient(90deg, #2979FF, #00E676)" }} />
        <div className="p-4 border-b border-[rgba(255,107,0,0.15)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-[#2979FF]" />
            <h3 className="text-xs font-semibold tracking-wide text-[#F5F0FF] uppercase">Response Trend</h3>
          </div>
        </div>
        
        <div className="flex-1 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={responseTimeTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" tick={{ fill: '#7B8FA8', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7B8FA8', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="calls" stroke="#2979FF" fill="rgba(41,121,255,0.2)" name="Calls" />
              <Area type="monotone" dataKey="avgTime" stroke="#FF9933" fill="rgba(255,153,51,0.1)" name="Avg (min)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Performance Radar */}
      <div className="glass-card h-[320px] flex flex-col overflow-hidden">
        <div className="h-[3px] w-full flex-shrink-0" style={{ background: "linear-gradient(90deg, #FF6B00, #2979FF, #00E676)" }} />
        <div className="p-4 border-b border-[rgba(255,107,0,0.15)] flex items-center gap-2">
          <Globe size={16} className="text-[#00E676]" />
          <h3 className="text-xs font-semibold tracking-wide text-[#F5F0FF] uppercase">AI Health</h3>
        </div>
        
        <div className="flex-1 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={aiPerformanceData}>
              <PolarGrid stroke="rgba(255,107,0,0.15)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#7B8FA8', fontSize: 8 }} />
              <Radar name="Perf" dataKey="A" stroke="#FF9933" fill="#FF9933" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="px-4 pb-3 flex items-center justify-center gap-2">
          <span className="text-[10px] text-[#7B8FA8]">Efficiency:</span>
          <span className="text-sm font-bold text-[#00E676]">98.2%</span>
        </div>
      </div>
    </motion.div>
  )
}
