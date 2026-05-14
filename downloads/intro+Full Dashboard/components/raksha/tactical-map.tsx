"use client"

import { motion } from "framer-motion"
import { ZoomIn, ZoomOut, Layers, Navigation, Radio } from "lucide-react"

interface MapMarker {
  id: string
  x: number
  y: number
  severity: "critical" | "high" | "medium" | "resolved"
  type: string
  area: string
}

const markers: MapMarker[] = [
  { id: "1", x: 48, y: 42, severity: "critical", type: "DV", area: "Koramangala" },
  { id: "2", x: 55, y: 28, severity: "high", type: "STK", area: "Indiranagar" },
  { id: "3", x: 72, y: 45, severity: "medium", type: "HAR", area: "Whitefield" },
  { id: "4", x: 35, y: 55, severity: "high", type: "DV", area: "Jayanagar" },
  { id: "5", x: 62, y: 62, severity: "resolved", type: "INF", area: "HSR Layout" },
]

const severityColors = {
  critical: { bg: "#FF2D55", glow: "rgba(255,45,85,0.6)" },
  high: { bg: "#FF6B2B", glow: "rgba(255,107,43,0.5)" },
  medium: { bg: "#FFD60A", glow: "rgba(255,214,10,0.4)" },
  resolved: { bg: "#00E676", glow: "rgba(0,230,118,0.4)" },
}

export function TacticalMap() {
  return (
    <motion.div
      className="glass-card h-[520px] flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      {/* Top accent line */}
      <div 
        className="h-[3px] w-full flex-shrink-0"
        style={{ background: "linear-gradient(90deg, #2979FF, #FF9933)" }}
      />

      {/* Header */}
      <div className="p-4 border-b border-[rgba(255,107,0,0.15)] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Radio size={14} className="text-[#FF9933]" />
          <h3 className="text-sm font-semibold tracking-wide text-[#F5F0FF]">
            TACTICAL MAP
          </h3>
          <span className="text-[10px] text-[#7B8FA8] font-mono">BENGALURU</span>
        </div>
        <div className="flex gap-2">
          <button className="p-1.5 rounded bg-[rgba(255,107,0,0.1)] text-[#7B8FA8] hover:text-[#FF9933] transition-colors">
            <ZoomIn size={14} />
          </button>
          <button className="p-1.5 rounded bg-[rgba(255,107,0,0.1)] text-[#7B8FA8] hover:text-[#FF9933] transition-colors">
            <ZoomOut size={14} />
          </button>
          <button className="p-1.5 rounded bg-[rgba(255,107,0,0.1)] text-[#7B8FA8] hover:text-[#FF9933] transition-colors">
            <Layers size={14} />
          </button>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-[#0a1628] overflow-hidden min-h-0">
        {/* Bengaluru city map SVG */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(41,121,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,107,0,0.3)" />
            </linearGradient>
            <filter id="mapGlow">
              <feGaussianBlur stdDeviation="0.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid pattern */}
          <pattern id="mapGridPattern" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(41,121,255,0.08)" strokeWidth="0.1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#mapGridPattern)" />

          {/* Outer Ring Road */}
          <motion.ellipse
            cx="50" cy="50" rx="42" ry="38"
            fill="none"
            stroke="rgba(255,107,0,0.25)"
            strokeWidth="0.8"
            filter="url(#mapGlow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />

          {/* NICE Road (Peripheral) */}
          <motion.path
            d="M 8 50 Q 20 20, 50 12 Q 80 20, 92 50 Q 80 80, 50 88 Q 20 80, 8 50"
            fill="none"
            stroke="rgba(0,230,118,0.2)"
            strokeWidth="0.5"
            strokeDasharray="2,1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, delay: 0.7 }}
          />

          {/* Major Roads - Radial */}
          {/* MG Road */}
          <motion.path
            d="M 50 50 L 70 35"
            stroke="url(#roadGradient)"
            strokeWidth="0.6"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1 }}
          />
          {/* Old Airport Road */}
          <motion.path
            d="M 50 50 L 75 55"
            stroke="url(#roadGradient)"
            strokeWidth="0.6"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
          />
          {/* Hosur Road */}
          <motion.path
            d="M 50 50 L 55 75"
            stroke="url(#roadGradient)"
            strokeWidth="0.6"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          />
          {/* Bannerghatta Road */}
          <motion.path
            d="M 50 50 L 42 78"
            stroke="url(#roadGradient)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
          />
          {/* Mysore Road */}
          <motion.path
            d="M 50 50 L 22 60"
            stroke="url(#roadGradient)"
            strokeWidth="0.6"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
          />
          {/* Tumkur Road */}
          <motion.path
            d="M 50 50 L 30 25"
            stroke="url(#roadGradient)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          />
          {/* Bellary Road */}
          <motion.path
            d="M 50 50 L 50 18"
            stroke="url(#roadGradient)"
            strokeWidth="0.6"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
          />

          {/* Inner Ring Road */}
          <motion.ellipse
            cx="50" cy="50" rx="18" ry="15"
            fill="none"
            stroke="rgba(255,153,51,0.35)"
            strokeWidth="0.6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 1.8 }}
          />

          {/* CBD Area */}
          <motion.circle
            cx="50" cy="50" r="5"
            fill="rgba(255,107,0,0.1)"
            stroke="rgba(255,153,51,0.4)"
            strokeWidth="0.3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          />

          {/* Area labels */}
          <text x="50" y="51" textAnchor="middle" fontSize="2" fill="rgba(255,153,51,0.6)" fontFamily="monospace">CBD</text>
          <text x="70" y="34" textAnchor="middle" fontSize="1.8" fill="rgba(123,143,168,0.5)" fontFamily="monospace">INDIRANAGAR</text>
          <text x="48" y="43" textAnchor="middle" fontSize="1.8" fill="rgba(123,143,168,0.5)" fontFamily="monospace">KORAMANGALA</text>
          <text x="75" y="48" textAnchor="middle" fontSize="1.8" fill="rgba(123,143,168,0.5)" fontFamily="monospace">WHITEFIELD</text>
          <text x="35" y="56" textAnchor="middle" fontSize="1.8" fill="rgba(123,143,168,0.5)" fontFamily="monospace">JAYANAGAR</text>
          <text x="62" y="64" textAnchor="middle" fontSize="1.8" fill="rgba(123,143,168,0.5)" fontFamily="monospace">HSR</text>
          <text x="50" y="15" textAnchor="middle" fontSize="1.5" fill="rgba(123,143,168,0.4)" fontFamily="monospace">AIRPORT</text>
        </svg>

        {/* Markers */}
        {markers.map((marker, index) => (
          <motion.div
            key={marker.id}
            className="absolute group"
            style={{ 
              left: `${marker.x}%`, 
              top: `${marker.y}%`,
              transform: "translate(-50%, -50%)"
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.2 + index * 0.15, ease: "backOut" }}
          >
            {/* Pulsing ring for critical/high */}
            {(marker.severity === "critical" || marker.severity === "high") && (
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 32,
                  height: 32,
                  left: -8,
                  top: -8,
                  background: severityColors[marker.severity].glow,
                }}
                animate={{
                  scale: [1, 2.5, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              />
            )}
            
            {/* Marker dot */}
            <div
              className="relative w-4 h-4 rounded-full flex items-center justify-center cursor-pointer hover:scale-150 transition-transform z-10"
              style={{
                backgroundColor: severityColors[marker.severity].bg,
                boxShadow: `0 0 12px ${severityColors[marker.severity].glow}`,
              }}
            >
              <span className="text-[6px] font-bold text-white">{marker.type}</span>
            </div>

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[rgba(3,8,16,0.95)] border border-[rgba(255,107,0,0.3)] rounded text-[8px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
              {marker.area}
            </div>
          </motion.div>
        ))}

        {/* Navigation indicator */}
        <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-[rgba(4,14,30,0.9)] border border-[rgba(255,107,0,0.2)]">
          <Navigation size={14} className="text-[#FF9933]" />
        </div>

        {/* Compass */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[rgba(4,14,30,0.9)] border border-[rgba(255,107,0,0.2)] flex items-center justify-center">
          <span className="text-[8px] font-bold text-[#FF9933]">N</span>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="p-3 border-t border-[rgba(255,107,0,0.15)] flex justify-between items-center text-[10px] flex-shrink-0">
        <div className="flex gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF2D55] shadow-[0_0_4px_#FF2D55]" />
            <span className="text-[#F5F0FF]">Critical: 1</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF6B2B] shadow-[0_0_4px_#FF6B2B]" />
            <span className="text-[#F5F0FF]">High: 2</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FFD60A]" />
            <span className="text-[#F5F0FF]">Medium: 1</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00E676]" />
            <span className="text-[#F5F0FF]">Resolved: 1</span>
          </span>
        </div>
        <span className="text-[#FF9933] font-mono tracking-wider">ZONE: BLR-CENTRAL</span>
      </div>
    </motion.div>
  )
}
