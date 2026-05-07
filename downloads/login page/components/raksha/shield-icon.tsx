"use client"

import { motion } from "framer-motion"

export function ShieldIcon() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.2, 1], opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1],
        times: [0, 0.7, 1],
      }}
      className="relative"
    >
      {/* Glow explosion effect */}
      <motion.div
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: 2.5, opacity: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,107,0,0.6) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
      
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        style={{
          filter: "drop-shadow(0 0 20px #FF6B00) drop-shadow(0 0 40px rgba(255,107,0,0.5))",
        }}
      >
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="50%" stopColor="#FF9933" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
        </defs>
        <path
          d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z"
          fill="url(#shieldGradient)"
        />
        <path
          d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.5"
          fill="none"
        />
        {/* Checkmark inside shield */}
        <path
          d="M9 12L11 14L15 10"
          stroke="#030810"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  )
}
