import { motion } from "framer-motion"
import { Search, Filter, MapPin, Clock, User, RefreshCw } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { getCases } from "../../services/api"
import { useRakshaWebSocket } from "../../hooks/useWebSocket"

const EMOTION_DISPLAY: Record<string, string> = {
  panic: "PANIC", distressed: "DISTRESSED", concerned: "CONCERNED", calm: "CALM"
}
const EMOTION_COLORS: Record<string, string> = {
  panic: "bg-[#FF2D55] text-white",
  distressed: "bg-[#FF6B2B] text-white",
  concerned: "bg-[#FFD60A] text-[#030810]",
  calm: "bg-[#00E676] text-[#030810]",
}
const PRIORITY_COLORS: Record<string, string> = {
  critical: "text-[#FF2D55] border-[#FF2D55]",
  high: "text-[#FF6B2B] border-[#FF6B2B]",
  medium: "text-[#FFD60A] border-[#FFD60A]",
  low: "text-[#00E676] border-[#00E676]",
  resolved: "text-[#00E676] border-[#00E676]",
}
const ROW_GLOW: Record<string, string> = {
  panic: "hover:shadow-[inset_0_0_30px_rgba(255,45,85,0.15)]",
  distressed: "hover:shadow-[inset_0_0_30px_rgba(255,107,43,0.15)]",
  concerned: "hover:shadow-[inset_0_0_30px_rgba(255,214,10,0.1)]",
  calm: "hover:shadow-[inset_0_0_30px_rgba(0,230,118,0.1)]",
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  return `${Math.floor(diff / 3600)}h ago`
}

export function EmergencyCases() {
  const [activeTab, setActiveTab] = useState("all")
  const [search, setSearch] = useState("")
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const navigate = useNavigate()
  const tabs = ["all", "critical", "active", "resolved"]

  const fetchCases = useCallback(async () => {
    try {
      const params: Record<string, any> = { limit: 50 }
      if (activeTab === "critical") params.priority = "critical"
      else if (activeTab === "active") params.status = "ai_processing"
      else if (activeTab === "resolved") params.status = "resolved"

      const data = await getCases(params)
      setCases(data.items || [])
      setLastUpdated(new Date())
    } catch (err) {
      console.warn('[EmergencyCases] Backend offline')
    } finally {
      setLoading(false)
    }
  }, [activeTab])
  
  // Listen for Live Updates
  useRakshaWebSocket({
    onNewCase: (newCase) => {
      console.log("[EmergencyCases] New case received via WS:", newCase)
      setCases(prev => [newCase, ...prev])
      setLastUpdated(new Date())
      // Trigger global panic effect
      window.dispatchEvent(new CustomEvent('raksha-emergency'))
    },
    onStatusUpdate: () => fetchCases()
  })

  useEffect(() => {
    fetchCases()
    // Reduced interval since we have WebSockets now
    const interval = setInterval(fetchCases, 60000) 
    return () => clearInterval(interval)
  }, [fetchCases])

  const filtered = cases.filter(c =>
    !search || c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.intent_type?.toLowerCase().includes(search.toLowerCase()) ||
    c.location_area?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div
      className="cyber-card h-[520px] flex flex-col overflow-hidden relative border border-white/5 shadow-2xl"
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      {/* Tactical Scanning Line */}
      <motion.div 
        className="absolute left-0 right-0 h-[1px] bg-[#FF9933]/20 z-10 pointer-events-none"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      <div className="p-5 border-b border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[10px] font-black tracking-[0.4em] text-white uppercase neon-text-orange mb-1">
               EMERGENCY DATA STREAM
            </h3>
            <p className="text-[8px] text-[#7B8FA8] font-bold tracking-[0.2em] uppercase opacity-60">Neural Feed v4.0.2</p>
          </div>
          <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-pulse shadow-[0_0_8px_#FF9933]" />
            <span className="text-[9px] text-[#FF9933] font-black tracking-[0.2em]">LIVE OPS</span>
          </div>
        </div>

        <div className="flex gap-2 mb-4 p-1 bg-black/20 rounded-xl border border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-[#FF9933]/10 text-[#FF9933] shadow-[inset_0_0_10px_rgba(255,153,51,0.1)]"
                  : "text-[#7B8FA8] hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8FA8] group-focus-within:text-[#FF9933] transition-colors" size={14} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by ID, location, or type..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-[11px] text-[#F5F0FF] placeholder-[#3D5068] focus:outline-none focus:border-[#FF9933]/50 focus:bg-white/[0.06] transition-all font-medium"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[#7B8FA8] hover:text-[#FF9933] hover:border-[#FF9933]/40 transition-all">
            <Filter size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {loading && (
          <div className="flex flex-col items-center justify-center h-40 text-[#7B8FA8] text-xs gap-3">
            <RefreshCw className="animate-spin text-[#FF9933]" size={24} />
            <span className="font-bold tracking-widest uppercase text-[10px]">Synchronizing...</span>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-[#3D5068] text-xs gap-2 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
            <Search size={24} className="opacity-20 mb-2" />
            <span className="font-black tracking-[0.2em] uppercase text-[9px]">No Active Signals Found</span>
          </div>
        )}
        {filtered.map((caseItem, index) => (
          <motion.div
            key={caseItem.id}
            onClick={() => navigate(`/case/${caseItem.id}`)}
            className={`p-4 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 cursor-pointer transition-all hover:border-[#FF9933]/30 hover:bg-white/[0.06] group relative overflow-hidden ${ROW_GLOW[caseItem.emotion_level] || ""}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.04 }}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] font-black text-[#FF9933] tracking-tighter">#{caseItem.id}</span>
                  <span className="text-[8px] text-[#7B8FA8] font-bold uppercase tracking-widest">{timeAgo(caseItem.created_at)}</span>
                </div>
                <div className="h-6 w-px bg-white/10 mx-1" />
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest shadow-sm ${EMOTION_COLORS[caseItem.emotion_level] || "bg-gray-700 text-white"}`}>
                  {EMOTION_DISPLAY[caseItem.emotion_level] || caseItem.emotion_level?.toUpperCase()}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-md border text-[9px] font-black tracking-widest ${PRIORITY_COLORS[caseItem.priority] || "text-gray-400 border-gray-600"}`}>
                {caseItem.priority?.toUpperCase()}
              </span>
            </div>

            <p className="text-[13px] text-white font-bold mb-3 tracking-tight group-hover:text-[#FF9933] transition-colors">
              {caseItem.intent_type?.replace(/_/g, ' ').toUpperCase() || "UNKNOWN SIGNAL"}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#7B8FA8] uppercase tracking-tighter">
                  <MapPin size={12} className="text-[#FF9933]" />
                  {caseItem.location_area || "ZONE: UNKNOWN"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${caseItem.status === 'resolved' ? 'bg-[#00E676]' : 'bg-[#FF9933]'} animate-pulse`} />
                 <span className="text-[9px] font-black text-[#3D5068] uppercase tracking-widest">{caseItem.status}</span>
              </div>
            </div>
            
            {/* Subtle glow for critical items */}
            {caseItem.priority === 'critical' && (
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#FF2D55]/5 blur-2xl pointer-events-none" />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

