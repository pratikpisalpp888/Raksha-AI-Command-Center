"use client"

import { motion } from "framer-motion"
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip } from "recharts"
import { CheckCircle, Shield, Mic } from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"
import { getLiveStats } from "../../services/api"

export function LiveStats() {
  const [stats, setStats] = useState<any>(null)
  const [currentTranscript, setCurrentTranscript] = useState("Awaiting incoming signal...")
  const [currentTranslation, setCurrentTranslation] = useState("")
  const [displayedText, setDisplayedText] = useState("Awaiting incoming signal...")
  const [displayedTranslation, setDisplayedTranslation] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const fetchStats = useCallback(async () => {
    try {
      const data = await getLiveStats()
      setStats(data)
    } catch (err) {
      console.warn('[LiveStats] Failed to fetch live stats')
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [fetchStats])

  // Typewriter Engine
  useEffect(() => {
    if (!isTyping) return;

    let i = 0;
    let j = 0;
    setDisplayedText("");
    setDisplayedTranslation("");

    const interval = setInterval(() => {
      if (i < currentTranscript.length) {
        setDisplayedText(currentTranscript.slice(0, i + 1));
        i++;
      } else if (j < currentTranslation.length) {
        setDisplayedTranslation(currentTranslation.slice(0, j + 1));
        j++;
      } else {
        clearInterval(interval);
      }
      
      // Safe Scroll Logic
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 25);

    return () => clearInterval(interval);
  }, [currentTranscript, currentTranslation, isTyping]);

  useEffect(() => {
    const handleTranscript = (e: any) => {
      const text = e.detail?.transcript
      const trans = e.detail?.translation
      if (text) {
        setIsTyping(true)
        setCurrentTranscript(text)
        setCurrentTranslation(trans || "")
        // Hold for 10 seconds before allowing reset
        setTimeout(() => setIsTyping(false), 10000)
      }
    }
    window.addEventListener('raksha-emergency', handleTranscript)
    return () => window.removeEventListener('raksha-emergency', handleTranscript)
  }, [])

  const emotionData = stats ? [
    { name: "Panic", value: stats.emotion_distribution.panic, color: "#FF2D55" },
    { name: "Distressed", value: stats.emotion_distribution.distressed, color: "#FF6B2B" },
    { name: "Concerned", value: stats.emotion_distribution.concerned, color: "#FFD60A" },
    { name: "Calm", value: stats.emotion_distribution.calm, color: "#00E676" },
  ] : []

  return (
    <div className="grid grid-cols-3 gap-5 px-6 mb-5">
      {/* 1. Impact Analytics */}
      <div className="glass-card p-4 flex flex-col hover:border-[rgba(0,230,118,0.3)] transition-all duration-300 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[rgba(0,230,118,0.15)]">
              <CheckCircle size={14} className="text-[#00E676]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F5F0FF] uppercase tracking-wide">Impact Analytics</h4>
              <p className="text-[10px] text-[#7B8FA8]">Social safety metrics</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center space-y-4 px-2">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[9px] text-[#7B8FA8] font-bold uppercase tracking-widest mb-1">Lives Secured</p>
              <h5 className="text-2xl font-black text-white">{stats?.resolved_count || 0}</h5>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-[#7B8FA8] font-bold uppercase tracking-widest mb-1">Time Saved</p>
              <h5 className="text-2xl font-black text-[#00E676]">{((stats?.resolved_count || 0) * 12.5).toFixed(0)}<span className="text-[10px] ml-1">MIN</span></h5>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[8px] font-bold text-[#7B8FA8] uppercase tracking-widest">
              <span>Resolution Rate</span>
              <span>99.2%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00E676] to-[#2979FF]" style={{ width: '99.2%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Emotion Analysis */}
      <div className="glass-card p-4 flex flex-col hover:border-[rgba(41,121,255,0.3)] transition-all duration-300 shadow-lg">
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
        <div className="h-[100px] w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={emotionData} layout="vertical" barSize={20}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" hide />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Neural Transcript Card */}
      <div className="glass-card p-4 flex flex-col hover:border-[rgba(255,153,51,0.3)] transition-all duration-300 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[rgba(255,107,0,0.15)] relative">
              <Mic size={14} className={`text-[#FF9933] ${isTyping ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F5F0FF] uppercase tracking-wide">Neural Transcript</h4>
              <p className="text-[10px] text-[#7B8FA8]">Live AI processing feed</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <div className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-[#00E676] animate-pulse' : 'bg-[#FF9933]'} shadow-[0_0_8px_currentColor]`} />
             <span className="text-[9px] font-black text-[#7B8FA8] uppercase tracking-widest">{isTyping ? 'Live' : 'Standby'}</span>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex-1 bg-black/30 rounded-[1.2rem] p-4 border border-white/5 relative group overflow-y-auto max-h-[140px] custom-scrollbar"
        >
           <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] z-10 opacity-30" />
           <div className="relative z-20 space-y-3">
              <p className="text-[15px] font-bold text-[#F5F0FF] leading-relaxed tracking-tight italic">
                <span className="text-[#FF9933] mr-2">&gt;&gt;&gt;</span>
                {displayedText}
                {isTyping && displayedTranslation === "" && <span className="inline-block w-2 h-4 bg-[#FF9933] ml-1 animate-pulse" />}
              </p>

              {displayedTranslation && (
                <div className="text-[12px] font-black text-[#00E676] leading-relaxed tracking-[0.05em] uppercase border-l-2 border-[#00E676]/30 pl-3 py-1 bg-[#00E676]/5 rounded-r-lg animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-[9px] opacity-60 mr-2 block mb-1">TRANSLATION:</span>
                  {displayedTranslation}
                  {isTyping && <span className="inline-block w-2 h-3 bg-[#00E676] ml-1 animate-pulse" />}
                </div>
              )}
           </div>
        </div>
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-[9px] text-[#7B8FA8] font-black uppercase tracking-widest tracking-widest">Processing Signal</span>
          <span className="text-[9px] text-[#FF9933] font-black uppercase tracking-widest opacity-60">Raksha AI v4.0</span>
        </div>
      </div>
    </div>
  )
}
