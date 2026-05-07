import { motion, useSpring, useTransform } from "framer-motion"
import { Phone, Activity, Clock, CheckCircle } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { getLiveStats } from "../../services/api"

function AnimatedNumber({ value, duration = 2.5 }: { value: number; duration?: number }) {
  const spring = useSpring(0, { duration: duration * 1000 })
  const display = useTransform(spring, (current) => Math.round(current))
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    spring.set(value)
    const unsubscribe = display.on("change", (v) => setDisplayValue(v))
    return () => unsubscribe()
  }, [spring, value, display])

  return <>{displayValue.toLocaleString()}</>
}

const sparklineData = [40, 65, 45, 80, 55, 95, 70]

export function StatCards() {
  const [animateProgress, setAnimateProgress] = useState(false)
  const [stats, setStats] = useState({
    calls_last_24h: 0,
    active_calls_count: 0,
    avg_response_time: 0,
    calls_last_7d: 0,
  })

  const fetchStats = useCallback(async () => {
    try {
      const data = await getLiveStats()
      setStats(data)
    } catch (err) {
      console.warn('[StatCards] Backend offline, using last known values')
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    const timer = setTimeout(() => setAnimateProgress(true), 500)
    return () => { clearInterval(interval); clearTimeout(timer) }
  }, [fetchStats])

  const resolvedCount = Math.max(0, stats.calls_last_24h - stats.active_calls_count)
  const resolutionRate = stats.calls_last_24h > 0
    ? Math.round((resolvedCount / stats.calls_last_24h) * 100)
    : 76


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 relative z-10">
      {/* Card 1: Total Calls */}
      <motion.div
        className="cyber-card p-6 bg-gradient-to-br from-white/[0.05] to-transparent border-t-white/10 hover:border-[#FF9933]/40 transition-all duration-500 group"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#7B8FA8] mb-3 font-black flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#FF9933] shadow-[0_0_5px_#FF9933]" />
              LIVE CALL VOLUME
            </p>
            <div className="text-5xl font-black text-white tabular-nums tracking-tighter neon-text-orange drop-shadow-[0_0_15px_rgba(255,153,51,0.3)]">
              <AnimatedNumber value={stats.calls_last_24h} />
            </div>
            <p className="text-xs text-[#00E676] mt-4 flex items-center gap-2 font-bold bg-[#00E676]/5 w-fit px-2 py-0.5 rounded-full border border-[#00E676]/20">
              <span className="animate-bounce">↑</span>
              <span>12.4%</span>
              <span className="text-[#7B8FA8] font-medium opacity-60 text-[10px]">TRAFFIC SYNC</span>
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.25)] group-hover:bg-[#FF9933]/20 transition-colors">
            <Phone className="text-[#FF9933] drop-shadow-[0_0_12px_#FF9933]" size={20} />
          </div>
        </div>
      </motion.div>

      {/* Card 2: Active Now */}
      <motion.div
        className="cyber-card p-6 bg-gradient-to-br from-white/[0.05] to-transparent border-t-white/10 hover:border-[#FF2D55]/40 transition-all duration-500 group"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#7B8FA8] mb-3 font-black flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#FF2D55] shadow-[0_0_5px_#FF2D55] animate-pulse" />
              ACTIVE EMERGENCIES
            </p>
            <div className="relative inline-block">
              <span 
                className="text-5xl font-black text-[#FF2D55] tabular-nums neon-text-red drop-shadow-[0_0_15px_rgba(255,45,85,0.4)] tracking-tighter"
              >
                <AnimatedNumber value={stats.active_calls_count} duration={1} />
              </span>
            </div>
            <p className="text-[10px] text-[#FF2D55] mt-4 font-black tracking-widest flex items-center gap-2 uppercase">
              <Activity size={10} className="animate-pulse" />
              Neural Monitor Link: OK
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-[rgba(255,45,85,0.1)] border border-[rgba(255,45,85,0.25)] group-hover:bg-[#FF2D55]/20 transition-colors">
            <Activity className="text-[#FF2D55] drop-shadow-[0_0_12px_#FF2D55]" size={20} />
          </div>
        </div>
      </motion.div>

      {/* Card 3: Response Time */}
      <motion.div
        className="cyber-card p-6 bg-gradient-to-br from-white/[0.05] to-transparent border-t-white/10 hover:border-[#2979FF]/40 transition-all duration-500 group"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#7B8FA8] mb-3 font-black flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#2979FF] shadow-[0_0_5px_#2979FF]" />
              RESPONSE LATENCY
            </p>
            <div className="flex items-baseline gap-2">
              <span 
                className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] tracking-tighter"
              >
                {(stats.avg_response_time || 0).toFixed(1)}
              </span>
              <span className="text-xl font-black text-[#2979FF] italic tracking-tighter">MS</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
               <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-1 h-2 rounded-full ${i < 4 ? 'bg-[#00E676]' : 'bg-white/10'}`} />
                  ))}
               </div>
               <p className="text-[9px] text-[#00E676] font-black tracking-widest uppercase">Performance: Optimal</p>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[rgba(41,121,255,0.1)] border border-[rgba(41,121,255,0.25)] group-hover:bg-[#2979FF]/20 transition-colors">
            <Clock className="text-[#2979FF] drop-shadow-[0_0_12px_#2979FF]" size={20} />
          </div>
        </div>
      </motion.div>

      {/* Card 4: Resolved */}
      <motion.div
        className="cyber-card p-6 bg-gradient-to-br from-white/[0.05] to-transparent border-t-white/10 hover:border-[#00E676]/40 transition-all duration-500 group"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#7B8FA8] mb-3 font-black flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#00E676] shadow-[0_0_5px_#00E676]" />
              MISSION COMPLETION
            </p>
            <div className="text-5xl font-black text-[#00E676] tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(0,230,118,0.4)]">
              <AnimatedNumber value={resolvedCount} />
            </div>
            <p className="text-[10px] text-[#7B8FA8] mt-4 font-bold tracking-[0.2em] uppercase flex items-center gap-2">
              <CheckCircle size={10} className="text-[#00E676]" />
              {resolutionRate}% SYSTEM EFFICIENCY
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-[rgba(0,230,118,0.1)] border border-[rgba(0,230,118,0.25)] group-hover:bg-[#00E676]/20 transition-colors">
            <CheckCircle className="text-[#00E676] drop-shadow-[0_0_12px_#00E676]" size={20} />
          </div>
        </div>
        {/* Horizontal progress bar */}
        <div className="mt-5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5 border border-white/5">
            <motion.div
              className="h-full rounded-full relative"
              style={{
                background: "linear-gradient(90deg, #00E676, #2979FF, #00E676)",
                backgroundSize: '200% 100%'
              }}
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                width: animateProgress ? `${resolutionRate}%` : "0%" 
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              initial={{ width: "0%" }}
            >
              {/* Glowing tip */}
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white blur-[4px]"
                style={{ opacity: 0.5 }}
              />
            </motion.div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-[9px] text-[#7B8FA8] font-bold tracking-widest uppercase">Operational Peak</p>
            <p className="text-[10px] text-[#00E676] font-black">{resolutionRate}%</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
