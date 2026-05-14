"use client"

import { motion } from "framer-motion"
import { Shield } from "lucide-react"
import { useState, useEffect } from "react"

export function Header() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata"
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata"
    }).toUpperCase()
  }

  const tickerItems = [
    { text: "SYSTEM ACTIVE", color: "text-[#FF9933]" },
    { text: "247 CALLS TODAY", color: "text-white" },
    { text: "3 ACTIVE NOW", color: "text-[#FF2D55]" },
    { text: "EMOTION ENGINE ONLINE", color: "text-white" },
    { text: "ALL 1092 CHANNELS MONITORED", color: "text-white" },
    { text: "ALL SYSTEMS NOMINAL", color: "text-[#00E676]" },
  ]

  return (
    <motion.header
      className="relative bg-[rgba(3,8,16,0.97)] backdrop-blur-xl border-b border-[rgba(255,107,0,0.2)] flex-shrink-0"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Tricolor animated line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] tricolor-line" />

      <div className="flex h-16 items-center justify-between px-4 lg:px-6 gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Shield icon with breathing glow */}
          <motion.div
            className="breathing-glow flex-shrink-0"
            style={{
              filter: "drop-shadow(0 0 10px rgba(255,107,0,0.8))"
            }}
          >
            <Shield 
              size={32} 
              className="text-transparent"
              style={{
                fill: "url(#headerShieldGradient)",
                stroke: "url(#headerShieldGradient)",
                strokeWidth: 1.5
              }}
            />
            <svg width="0" height="0">
              <defs>
                <linearGradient id="headerShieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF9933" />
                  <stop offset="100%" stopColor="#FF6B00" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <div className="min-w-0">
            <h1 className="text-xl lg:text-2xl font-black tracking-[0.08em] text-shimmer whitespace-nowrap">
              RAKSHA AI
            </h1>
            <p className="text-[8px] lg:text-[9px] tracking-[0.2em] text-[#7B8FA8] whitespace-nowrap">
              1092 WOMEN&apos;S EMERGENCY COMMAND CENTER
            </p>
          </div>
        </div>

        {/* Center Section - Scrolling Ticker */}
        <div className="hidden md:flex flex-1 mx-4 max-w-md lg:max-w-xl overflow-hidden">
          <div className="overflow-hidden rounded-full border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.06)] px-4 py-1.5 w-full">
            <motion.div
              className="flex gap-8 whitespace-nowrap"
              animate={{ x: [0, -800] }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className={`text-[11px] ${item.color} font-medium`}>
                  {item.text}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 lg:gap-5 flex-shrink-0">
          {/* Clock */}
          <div className="text-right hidden sm:block">
            <div className="font-mono text-lg lg:text-xl text-white tabular-nums">
              {formatTime(time)} <span className="text-[#7B8FA8] text-xs">IST</span>
            </div>
            <div className="text-[9px] lg:text-[10px] text-[#7B8FA8] tracking-wide">
              {formatDate(time)}
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 rounded-full border border-[rgba(0,230,118,0.25)] bg-[rgba(0,230,118,0.08)] px-3 py-1.5">
            <motion.span
              className="inline-block h-2 w-2 rounded-full bg-[#00E676]"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[10px] lg:text-xs text-[#00E676] font-semibold whitespace-nowrap">
              ACTIVE
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
