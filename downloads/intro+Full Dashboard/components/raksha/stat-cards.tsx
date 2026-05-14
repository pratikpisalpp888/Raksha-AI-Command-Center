"use client"

import { motion, useSpring, useTransform } from "framer-motion"
import { Phone, Activity, Clock, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

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

  useEffect(() => {
    const timer = setTimeout(() => setAnimateProgress(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      {/* Card 1: Total Calls */}
      <motion.div
        className="glass-card relative overflow-hidden p-5"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {/* Top accent line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
          style={{ background: "linear-gradient(90deg, #FF6B00, #FF9933)" }}
        />
        
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#7B8FA8] mb-2 font-medium">
              Total Calls Today
            </p>
            <div className="text-4xl font-black text-white tabular-nums">
              <AnimatedNumber value={247} />
            </div>
            <p className="text-xs text-[#00E676] mt-2 flex items-center gap-1">
              <span>+12%</span>
              <span className="text-[#7B8FA8]">from yesterday</span>
            </p>
          </div>
          <div className="p-2 rounded-lg bg-[rgba(255,107,0,0.1)] flex-shrink-0">
            <Phone className="text-[#FF9933]" size={20} />
          </div>
        </div>

        {/* Mini sparkline */}
        <div className="mt-4 flex items-end gap-1 h-8">
          {sparklineData.map((height, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-sm min-w-0"
              style={{ background: "linear-gradient(to top, #FF6B00, #FF9933)" }}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Card 2: Active Now */}
      <motion.div
        className="glass-card relative overflow-hidden p-5"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {/* Top accent line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
          style={{ background: "linear-gradient(90deg, #FF2D55, #FF6B00)" }}
        />
        
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#7B8FA8] mb-2 font-medium">
              Live Calls
            </p>
            <div className="relative inline-block">
              <span 
                className="text-4xl font-black text-[#FF2D55] tabular-nums"
                style={{ textShadow: "0 0 30px rgba(255,45,85,0.8)" }}
              >
                <AnimatedNumber value={3} duration={1} />
              </span>
              
              {/* Pulsing rings */}
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#FF6B00] pointer-events-none"
                  style={{ width: 50, height: 50 }}
                  animate={{
                    scale: [1, 2.5],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.7,
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-[#FF9933] mt-2">
              AI responding in real-time
            </p>
          </div>
          <div className="p-2 rounded-lg bg-[rgba(255,45,85,0.1)] flex-shrink-0">
            <Activity className="text-[#FF2D55]" size={20} />
          </div>
        </div>
      </motion.div>

      {/* Card 3: Response Time */}
      <motion.div
        className="glass-card relative overflow-hidden p-5"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {/* Top accent line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
          style={{ background: "linear-gradient(90deg, #2979FF, #00E676)" }}
        />
        
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#7B8FA8] mb-2 font-medium">
              Avg Response Time
            </p>
            <div className="flex items-baseline gap-1">
              <span 
                className="text-4xl font-black tabular-nums"
                style={{
                  background: "linear-gradient(90deg, #2979FF, #00E676)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                8.3
              </span>
              <span className="text-xl font-bold text-[#2979FF]">s</span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-[rgba(41,121,255,0.1)] flex-shrink-0">
            <Clock className="text-[#2979FF]" size={20} />
          </div>
        </div>

        {/* Arc gauge */}
        <div className="mt-3 flex justify-center">
          <svg width="100%" height="50" viewBox="0 0 120 55" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF9933" />
                <stop offset="100%" stopColor="#2979FF" />
              </linearGradient>
            </defs>
            {/* Background arc */}
            <path
              d="M 15 50 A 45 45 0 0 1 105 50"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <motion.path
              d="M 15 50 A 45 45 0 0 1 105 50"
              fill="none"
              stroke="url(#arcGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: animateProgress ? 0.83 : 0 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              style={{
                filter: "drop-shadow(0 0 6px rgba(41,121,255,0.5))"
              }}
            />
          </svg>
        </div>
        <p className="text-center text-[10px] text-[#00E676] font-medium">TARGET MET</p>
      </motion.div>

      {/* Card 4: Resolved */}
      <motion.div
        className="glass-card relative overflow-hidden p-5"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        {/* Top accent line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
          style={{ background: "linear-gradient(90deg, #00E676, #2979FF)" }}
        />
        
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#7B8FA8] mb-2 font-medium">
              Cases Resolved
            </p>
            <div className="text-4xl font-black text-[#00E676] tabular-nums">
              <AnimatedNumber value={189} />
            </div>
          </div>
          <div className="p-2 rounded-lg bg-[rgba(0,230,118,0.1)] flex-shrink-0">
            <CheckCircle className="text-[#00E676]" size={20} />
          </div>
        </div>

        {/* Horizontal progress bar */}
        <div className="mt-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
            <motion.div
              className="h-full rounded-full relative"
              style={{
                background: "linear-gradient(90deg, #00E676, #2979FF)"
              }}
              initial={{ width: "0%" }}
              animate={{ width: animateProgress ? "76%" : "0%" }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            >
              {/* Glowing tip */}
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white"
                style={{ boxShadow: "0 0 8px #00E676" }}
              />
            </motion.div>
          </div>
          <p className="text-[10px] text-[#7B8FA8] mt-2 font-medium">76% Resolution Rate</p>
        </div>
      </motion.div>
    </div>
  )
}
