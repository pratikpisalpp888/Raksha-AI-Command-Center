"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Phone, Shield, ChevronRight, Mic, MapPin, RefreshCw } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { getCases } from "../../services/api"
import { useRakshaWebSocket } from "../../hooks/useWebSocket"
import { useNavigate } from "react-router-dom"

interface Alert {
  id: string
  type: "panic" | "high" | "info"
  title: string
  message: string
  time: string
  action?: string
  caseId: string
}

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

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return "Just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

export function MissionAlerts() {
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAlerts = useCallback(async () => {
    try {
      // Fetch recent critical and high priority cases
      const data = await getCases({ limit: 10, priority: "critical" })
      const highData = await getCases({ limit: 5, priority: "high" })
      
      const allCases = [...(data.items || []), ...(highData.items || [])]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10)

      const mappedAlerts: Alert[] = allCases.map(c => ({
        id: c.id,
        caseId: c.id,
        type: c.priority === "critical" ? "panic" : "high",
        title: c.priority === "critical" ? "PANIC DETECTED" : "HIGH PRIORITY",
        message: `${c.intent_type || 'Emergency'} in ${c.location_area || c.location_raw || 'Unknown location'}.`,
        time: timeAgo(c.created_at),
        action: c.status === "new" ? "DISPATCH UNIT" : "TRACK CASE"
      }))

      setAlerts(mappedAlerts)
    } catch (err) {
      console.warn('[MissionAlerts] Failed to fetch alerts')
    } finally {
      setLoading(false)
    }
  }, [])

  // Use WebSocket for real-time alerts
  useRakshaWebSocket({
    onNewCase: (newCase) => {
      if (newCase.priority === "critical" || newCase.priority === "high") {
        const newAlert: Alert = {
          id: newCase.id,
          caseId: newCase.id,
          type: newCase.priority === "critical" ? "panic" : "high",
          title: newCase.priority === "critical" ? "PANIC DETECTED" : "HIGH PRIORITY",
          message: `${newCase.intent_type || 'Emergency'} in ${newCase.location_area || 'Unknown location'}.`,
          time: "Just now",
          action: "DISPATCH UNIT"
        }
        setAlerts(prev => [newAlert, ...prev].slice(0, 10))
      }
    },
    onPanic: (panicData) => {
      // Handle explicit panic broadcast if any
      console.log('Panic Alert Received:', panicData)
    }
  })

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 60000)
    return () => clearInterval(interval)
  }, [fetchAlerts])

  // 🔄 Clear all alerts on global reset event
  useEffect(() => {
    const handleReset = () => setAlerts([])
    window.addEventListener('raksha-reset', handleReset)
    return () => window.removeEventListener('raksha-reset', handleReset)
  }, [])

  return (
    <motion.div
      className="cyber-card h-[520px] flex flex-col overflow-hidden relative border border-white/5 shadow-2xl rounded-[2rem]"
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#FF2D55] via-[#FF9933] to-[#FF2D55] animate-tricolor-shimmer" />
      
      {/* Tactical Scanning Line */}
      <motion.div 
        className="absolute left-0 right-0 h-[1px] bg-[#FF2D55]/10 z-10 pointer-events-none"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <div className="p-5 border-b border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#FF9933] status-led shadow-[0_0_8px_#FF9933]" />
            <div>
              <h3 className="text-[10px] font-black tracking-[0.4em] text-white uppercase neon-text-orange mb-1">
                 MISSION ALERTS
              </h3>
              <p className="text-[8px] text-[#7B8FA8] font-bold tracking-[0.2em] uppercase opacity-60">Global Threat Monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchAlerts} 
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#7B8FA8] hover:text-[#FF9933] transition-all"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <div className={`px-3 py-1 rounded-full ${alerts.length > 0 ? 'bg-[#FF2D55]/10 text-[#FF2D55] border-[#FF2D55]/20' : 'bg-white/5 text-[#7B8FA8] border-white/10'} text-[10px] font-black tracking-widest border animate-pulse`}>
              {alerts.length} ACTIVE
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {loading && alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-[#7B8FA8] text-xs gap-3">
            <RefreshCw className="animate-spin text-[#FF9933]" size={24} />
            <span className="font-bold tracking-widest uppercase text-[10px]">Scanning Frequencies...</span>
          </div>
        )}
        
        {!loading && alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-[#3D5068] text-xs gap-2 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
            <Shield size={32} className="opacity-10 mb-2" />
            <span className="font-black tracking-[0.2em] uppercase text-[9px]">Sector Secured • No Threats</span>
          </div>
        )}

        <AnimatePresence initial={false} mode="popLayout">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              onClick={() => navigate(`/case/${alert.caseId}`)}
              className={`group relative p-4 rounded-[1.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 transition-all cursor-pointer hover:border-white/20 hover:bg-white/[0.05] overflow-hidden ${alertStyles[alert.type].glow}`}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: -4 }}
            >
              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: alertStyles[alert.type].icon === 'text-[#FF2D55]' ? '#FF2D55' : alertStyles[alert.type].icon === 'text-[#FF6B2B]' ? '#FF6B2B' : '#2979FF' }} />
              
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-black/40 border border-white/5 ${alertStyles[alert.type].icon}`}>
                  {alert.type === "panic" && <AlertTriangle size={20} className="animate-pulse" />}
                  {alert.type === "high" && <Shield size={20} />}
                  {alert.type === "info" && <Mic size={20} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${alertStyles[alert.type].title}`}>
                      {alert.title}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-[#7B8FA8] uppercase opacity-60 tabular-nums">{alert.time}</span>
                  </div>
                  <p className="text-[13px] text-white/90 font-bold leading-relaxed tracking-tight group-hover:text-white transition-colors">{alert.message}</p>
                  
                  {alert.action && (
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="mt-4 flex items-center gap-2 text-[#FF9933] text-[9px] font-black uppercase tracking-[0.3em] group-hover:drop-shadow-[0_0_8px_rgba(255,153,51,0.5)] transition-all"
                    >
                      {alert.action}
                      <ChevronRight size={14} className="animate-bounce-x" />
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Tactical Corners */}
              <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-white/10" />
              <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/10" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20 grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-3 py-3 rounded-[1.2rem] bg-white/[0.02] border border-white/5 text-[10px] font-black text-[#FF9933] tracking-[0.2em] hover:bg-[#FF9933]/10 hover:border-[#FF9933]/30 transition-all uppercase group">
          <Phone size={14} className="group-hover:rotate-12 transition-transform" /> CALL BACKUP
        </button>
        <button className="flex items-center justify-center gap-3 py-3 rounded-[1.2rem] bg-white/[0.02] border border-white/5 text-[10px] font-black text-[#FF9933] tracking-[0.2em] hover:bg-[#FF9933]/10 hover:border-[#FF9933]/30 transition-all uppercase group">
          <MapPin size={14} className="group-hover:scale-110 transition-transform" /> LOCATE ALL
        </button>
      </div>
    </motion.div>
  )
}
