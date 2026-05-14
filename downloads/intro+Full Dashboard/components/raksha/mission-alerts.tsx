"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Phone, Shield, ChevronRight, Mic, MapPin } from "lucide-react"

interface Alert {
  id: string
  type: "panic" | "high" | "info"
  title: string
  message: string
  time: string
  action?: string
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "panic",
    title: "PANIC DETECTED",
    message: "Domestic violence case in Koramangala. Caller showing extreme distress.",
    time: "NOW",
    action: "DISPATCH UNIT"
  },
  {
    id: "2",
    type: "high",
    title: "HIGH PRIORITY",
    message: "Stalking case escalated. Unit I3 en route to Indiranagar.",
    time: "3 min ago",
    action: "TRACK UNIT"
  },
  {
    id: "3",
    type: "info",
    title: "AI TRANSCRIPTION",
    message: "Multilingual call detected: Hindi + Kannada. Auto-translating...",
    time: "5 min ago"
  },
]

const alertStyles = {
  panic: {
    bg: "bg-[rgba(255,45,85,0.1)]",
    border: "border-[#FF2D55]",
    icon: "text-[#FF2D55]",
    title: "text-[#FF2D55]",
    glow: "shadow-[0_0_20px_rgba(255,45,85,0.3)]"
  },
  high: {
    bg: "bg-[rgba(255,107,43,0.1)]",
    border: "border-[#FF6B2B]",
    icon: "text-[#FF6B2B]",
    title: "text-[#FF6B2B]",
    glow: ""
  },
  info: {
    bg: "bg-[rgba(41,121,255,0.1)]",
    border: "border-[#2979FF]",
    icon: "text-[#2979FF]",
    title: "text-[#2979FF]",
    glow: ""
  }
}

export function MissionAlerts() {
  return (
    <motion.div
      className="glass-card h-[520px] flex flex-col overflow-hidden"
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      {/* Top accent line */}
      <div 
        className="h-[3px] w-full"
        style={{ background: "linear-gradient(90deg, #FF2D55, #FF9933)" }}
      />

      {/* Header */}
      <div className="p-4 border-b border-[rgba(255,107,0,0.15)]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide text-[#F5F0FF]">
            🔔 MISSION ALERTS
          </h3>
          <span className="px-2 py-1 rounded-full bg-[rgba(255,45,85,0.2)] text-[10px] text-[#FF2D55] font-bold animate-pulse">
            3 NEW
          </span>
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            className={`p-4 rounded-lg border ${alertStyles[alert.type].bg} ${alertStyles[alert.type].border} ${alertStyles[alert.type].glow} transition-all cursor-pointer hover:scale-[1.02]`}
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ 
              delay: index === 0 ? 1.5 : 0.8 + index * 0.15,
              type: "spring",
              stiffness: 200
            }}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${alertStyles[alert.type].bg}`}>
                {alert.type === "panic" && <AlertTriangle size={18} className={alertStyles[alert.type].icon} />}
                {alert.type === "high" && <Shield size={18} className={alertStyles[alert.type].icon} />}
                {alert.type === "info" && <Mic size={18} className={alertStyles[alert.type].icon} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold tracking-wider ${alertStyles[alert.type].title}`}>
                    {alert.title}
                  </span>
                  <span className="text-[10px] text-[#7B8FA8]">{alert.time}</span>
                </div>
                <p className="text-xs text-[#F5F0FF] leading-relaxed">{alert.message}</p>
                
                {alert.action && (
                  <button className="mt-3 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF6B00] to-[#FF9933] text-[10px] font-bold text-white hover:shadow-[0_0_15px_rgba(255,107,0,0.4)] transition-all">
                    {alert.action}
                    <ChevronRight size={12} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-t border-[rgba(255,107,0,0.15)] grid grid-cols-2 gap-2">
        <button className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.2)] text-[10px] text-[#FF9933] hover:bg-[rgba(255,107,0,0.2)] transition-all">
          <Phone size={12} />
          CALL BACKUP
        </button>
        <button className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.2)] text-[10px] text-[#FF9933] hover:bg-[rgba(255,107,0,0.2)] transition-all">
          <MapPin size={12} />
          LOCATE ALL
        </button>
      </div>
    </motion.div>
  )
}
