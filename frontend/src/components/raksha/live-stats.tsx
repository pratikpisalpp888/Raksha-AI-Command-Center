"use client"

import { motion, AnimatePresence } from "framer-motion"
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip } from "recharts"
import { Phone, Users, Clock, CheckCircle, AlertCircle, TrendingUp, Headphones, Shield, Activity } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { getLiveStats } from "../../services/api"
import { useRakshaWebSocket } from "../../hooks/useWebSocket"

interface ActivityItem {
  id: string
  type: string
  message: string
  time: string
  severity: "critical" | "warning" | "success" | "info"
}

const severityStyles = {
  critical: { bg: "bg-[rgba(255,45,85,0.15)]", text: "text-[#FF2D55]", dot: "bg-[#FF2D55]" },
  warning: { bg: "bg-[rgba(255,214,10,0.15)]", text: "text-[#FFD60A]", dot: "bg-[#FFD60A]" },
  success: { bg: "bg-[rgba(0,230,118,0.15)]", text: "text-[#00E676]", dot: "bg-[#00E676]" },
  info: { bg: "bg-[rgba(41,121,255,0.15)]", text: "text-[#2979FF]", dot: "bg-[#2979FF]" },
}

export function LiveStats() {
  const [stats, setStats] = useState<any>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [callHistory, setCallHistory] = useState<{time: string, calls: number}[]>([])

  const fetchStats = useCallback(async () => {
    try {
      const data = await getLiveStats()
      setStats(data)
      
      // Update call history chart
      setCallHistory(prev => {
        const newPoint = { time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), calls: data.active_calls_count }
        const newHistory = [...prev, newPoint].slice(-10)
        if (newHistory.length < 10) {
          // Fill with some dummy initial data if empty
          return Array(10 - newHistory.length).fill(0).map((_, i) => ({ time: `${i}`, calls: 0 })).concat(newHistory)
        }
        return newHistory
      })
    } catch (err) {
      console.warn('[LiveStats] Failed to fetch live stats')
    }
  }, [])

  // Real-time updates via WebSocket
  useRakshaWebSocket({
    onNewCase: (c) => {
      const newActivity: ActivityItem = {
        id: Math.random().toString(),
        type: 'call',
        message: `New ${c.priority} call: ${c.id}`,
        time: 'Just now',
        severity: c.priority === 'critical' ? 'critical' : c.priority === 'high' ? 'warning' : 'info'
      }
      setActivities(prev => [newActivity, ...prev].slice(0, 5))
      fetchStats()
    },
    onStatusUpdate: (data) => {
      const newActivity: ActivityItem = {
        id: Math.random().toString(),
        type: 'status',
        message: `Case ${data.case_id} marked as ${data.status}`,
        time: 'Just now',
        severity: data.status === 'resolved' ? 'success' : 'info'
      }
      setActivities(prev => [newActivity, ...prev].slice(0, 5))
      fetchStats()
    }
  })

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [fetchStats])

  const emotionData = stats ? [
    { name: "Panic", value: stats.emotion_distribution.panic, color: "#FF2D55" },
    { name: "Distressed", value: stats.emotion_distribution.distressed, color: "#FF6B2B" },
    { name: "Concerned", value: stats.emotion_distribution.concerned, color: "#FFD60A" },
    { name: "Calm", value: stats.emotion_distribution.calm, color: "#00E676" },
  ] : []

  return (
    <motion.div
      className="grid grid-cols-3 gap-5 px-6 mb-5"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.55, duration: 0.5 }}
    >
      {/* Live Call Volume Chart */}
      <div className="glass-card p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[rgba(255,107,0,0.15)]">
              <Phone size={14} className="text-[#FF9933]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F5F0FF] uppercase tracking-wide">Live Call Volume</h4>
              <p className="text-[10px] text-[#7B8FA8]">Real-time active count</p>
            </div>
          </div>
          <div className="text-right">
            <motion.span 
              className="text-2xl font-bold text-[#FF9933]"
              key={stats?.active_calls_count}
              initial={{ scale: 1.2, color: "#00E676" }}
              animate={{ scale: 1, color: "#FF9933" }}
            >
              {stats?.active_calls_count || 0}
            </motion.span>
            <p className="text-[9px] text-[#7B8FA8]">active calls</p>
          </div>
        </div>
        
        <div className="flex-1 h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={callHistory} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <Line 
                type="monotone" 
                dataKey="calls" 
                stroke="#FF9933" 
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between mt-3 pt-3 border-t border-[rgba(255,107,0,0.1)]">
          <div className="flex items-center gap-1.5">
            <Activity size={12} className="text-[#00E676]" />
            <span className="text-[10px] text-[#7B8FA8]">System Load: Nominal</span>
          </div>
          <span className="flex items-center gap-1 text-[9px] text-[#7B8FA8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
            Live Feed
          </span>
        </div>
      </div>

      {/* Emotion Distribution */}
      <div className="glass-card p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[rgba(41,121,255,0.15)]">
              <Shield size={14} className="text-[#2979FF]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F5F0FF] uppercase tracking-wide">Emotion Analysis</h4>
              <p className="text-[10px] text-[#7B8FA8]">Last 24h distribution</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={emotionData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" hide />
              <Tooltip 
                contentStyle={{ background: '#030810', border: '1px solid #2979FF', fontSize: '10px' }}
                itemStyle={{ color: '#F5F0FF' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between mt-3 pt-3 border-t border-[rgba(255,107,0,0.1)]">
          {emotionData.map((d) => (
            <span key={d.name} className="flex items-center gap-1 text-[8px] text-[#7B8FA8]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
              {d.name}
            </span>
          ))}
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="glass-card p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[rgba(0,230,118,0.15)]">
              <Headphones size={14} className="text-[#00E676]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F5F0FF] uppercase tracking-wide">System Log</h4>
              <p className="text-[10px] text-[#7B8FA8]">Real-time events</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 space-y-2 overflow-hidden">
          <AnimatePresence initial={false}>
            {activities.length === 0 && (
              <div className="text-[10px] text-[#3D5068] text-center mt-4 italic">Waiting for events...</div>
            )}
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                className={`flex items-center gap-2 p-2 rounded-lg ${severityStyles[activity.severity].bg}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${severityStyles[activity.severity].dot}`} />
                <span className={`text-[9px] flex-1 truncate ${severityStyles[activity.severity].text}`}>
                  {activity.message}
                </span>
                <span className="text-[8px] text-[#7B8FA8] flex-shrink-0">{activity.time}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
