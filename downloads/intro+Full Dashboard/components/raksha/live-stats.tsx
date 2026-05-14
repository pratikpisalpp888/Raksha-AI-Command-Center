"use client"

import { motion } from "framer-motion"
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, Cell } from "recharts"
import { Phone, Users, Clock, CheckCircle, AlertCircle, TrendingUp, Headphones, Shield } from "lucide-react"
import { useState, useEffect } from "react"

// Live call volume data (simulated real-time)
const callVolumeData = [
  { time: "1", calls: 12 },
  { time: "2", calls: 18 },
  { time: "3", calls: 15 },
  { time: "4", calls: 22 },
  { time: "5", calls: 19 },
  { time: "6", calls: 25 },
  { time: "7", calls: 28 },
  { time: "8", calls: 24 },
  { time: "9", calls: 30 },
  { time: "10", calls: 27 },
]

// District-wise distribution
const districtData = [
  { name: "East", cases: 42, color: "#FF2D55" },
  { name: "West", cases: 38, color: "#FF6B2B" },
  { name: "North", cases: 25, color: "#FFD60A" },
  { name: "South", cases: 55, color: "#FF9933" },
  { name: "Central", cases: 32, color: "#2979FF" },
]

// Live activity feed
const activities = [
  { id: 1, type: "call", message: "New call from Koramangala", time: "Just now", severity: "critical" },
  { id: 2, type: "resolved", message: "Case RK-4842 resolved", time: "2m ago", severity: "success" },
  { id: 3, type: "dispatch", message: "Unit K7 dispatched", time: "3m ago", severity: "info" },
  { id: 4, type: "escalation", message: "AI escalated case RK-4845", time: "5m ago", severity: "warning" },
  { id: 5, type: "call", message: "Follow-up call completed", time: "8m ago", severity: "info" },
]

const severityStyles = {
  critical: { bg: "bg-[rgba(255,45,85,0.15)]", text: "text-[#FF2D55]", dot: "bg-[#FF2D55]" },
  warning: { bg: "bg-[rgba(255,214,10,0.15)]", text: "text-[#FFD60A]", dot: "bg-[#FFD60A]" },
  success: { bg: "bg-[rgba(0,230,118,0.15)]", text: "text-[#00E676]", dot: "bg-[#00E676]" },
  info: { bg: "bg-[rgba(41,121,255,0.15)]", text: "text-[#2979FF]", dot: "bg-[#2979FF]" },
}

export function LiveStats() {
  const [currentCalls, setCurrentCalls] = useState(27)
  const [operatorsOnline, setOperatorsOnline] = useState(42)
  
  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCalls(prev => prev + Math.floor(Math.random() * 3) - 1)
      setOperatorsOnline(prev => Math.max(38, Math.min(48, prev + Math.floor(Math.random() * 3) - 1)))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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
              <p className="text-[10px] text-[#7B8FA8]">Last 10 minutes</p>
            </div>
          </div>
          <div className="text-right">
            <motion.span 
              className="text-2xl font-bold text-[#FF9933]"
              key={currentCalls}
              initial={{ scale: 1.2, color: "#00E676" }}
              animate={{ scale: 1, color: "#FF9933" }}
              transition={{ duration: 0.3 }}
            >
              {currentCalls}
            </motion.span>
            <p className="text-[9px] text-[#7B8FA8]">active calls</p>
          </div>
        </div>
        
        <div className="flex-1 h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={callVolumeData}>
              <Line 
                type="monotone" 
                dataKey="calls" 
                stroke="#FF9933" 
                strokeWidth={2}
                dot={false}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between mt-3 pt-3 border-t border-[rgba(255,107,0,0.1)]">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={12} className="text-[#00E676]" />
            <span className="text-[10px] text-[#00E676]">+15% vs avg</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[9px] text-[#7B8FA8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
              Live
            </span>
          </div>
        </div>
      </div>

      {/* District Distribution */}
      <div className="glass-card p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[rgba(41,121,255,0.15)]">
              <Shield size={14} className="text-[#2979FF]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F5F0FF] uppercase tracking-wide">Zone Distribution</h4>
              <p className="text-[10px] text-[#7B8FA8]">Active cases by zone</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={districtData} layout="vertical" margin={{ left: 0, right: 0 }}>
              <Bar 
                dataKey="cases" 
                radius={[0, 4, 4, 0]}
                animationDuration={1500}
              >
                {districtData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between mt-3 pt-3 border-t border-[rgba(255,107,0,0.1)]">
          {districtData.map((district) => (
            <span key={district.name} className="flex items-center gap-1 text-[8px] text-[#7B8FA8]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: district.color }} />
              {district.name}
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
              <h4 className="text-xs font-semibold text-[#F5F0FF] uppercase tracking-wide">Live Activity</h4>
              <p className="text-[10px] text-[#7B8FA8]">{operatorsOnline} operators online</p>
            </div>
          </div>
          <span className="px-2 py-1 rounded-full bg-[rgba(0,230,118,0.15)] text-[9px] text-[#00E676] font-medium animate-pulse">
            LIVE
          </span>
        </div>
        
        <div className="flex-1 space-y-2 overflow-hidden">
          {activities.slice(0, 4).map((activity, index) => (
            <motion.div
              key={activity.id}
              className={`flex items-center gap-2 p-2 rounded-lg ${severityStyles[activity.severity as keyof typeof severityStyles].bg}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${severityStyles[activity.severity as keyof typeof severityStyles].dot}`} />
              <span className={`text-[9px] flex-1 truncate ${severityStyles[activity.severity as keyof typeof severityStyles].text}`}>
                {activity.message}
              </span>
              <span className="text-[8px] text-[#7B8FA8] flex-shrink-0">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
