"use client"

import { motion } from "framer-motion"
import { Lock } from "lucide-react"
import { FloatingParticles } from "@/components/raksha/floating-particles"
import { ShieldIcon } from "@/components/raksha/shield-icon"
import { LoginForm } from "@/components/raksha/login-form"

export default function LoginPage() {
  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
      style={{ backgroundColor: "#030810" }}
    >
      {/* Background gradients */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 800px 600px at 15% 10%, rgba(255,107,0,0.12) 0%, transparent 50%),
            radial-gradient(ellipse 800px 600px at 85% 90%, rgba(41,121,255,0.1) 0%, transparent 50%)
          `,
        }}
      />

      {/* Circuit grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,107,0,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,0,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[420px]">
        {/* Shield Icon */}
        <ShieldIcon />

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 text-4xl font-black tracking-wider"
          style={{
            background: "linear-gradient(90deg, #FF6B00, #FFFFFF, #FF6B00)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 3s linear infinite",
          }}
        >
          RAKSHA AI
        </motion.h1>

        {/* Hindi subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-2 text-sm text-[#7B8FA8] tracking-widest"
        >
          रक्षा • सुरक्षा • न्याय
        </motion.p>

        {/* Command center text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-2 text-[10px] tracking-[0.3em] text-[#7B8FA8] flex items-center gap-2"
        >
          <span>🇮🇳</span>
          <span>1092 WOMEN&apos;S EMERGENCY COMMAND CENTER</span>
        </motion.p>

        {/* Login Form */}
        <div className="mt-8 w-full">
          <LoginForm />
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-[#3D5068]">
            <Lock className="w-3 h-3" />
            <span>Authorized Personnel Only</span>
          </div>
          <p className="mt-2 text-[9px] text-[#3D5068]">
            Government of India • Ministry of Women &amp; Child Development
          </p>
          <p className="mt-2 text-lg">🇮🇳</p>
        </motion.div>
      </div>

      {/* Shimmer animation keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
      `}</style>
    </main>
  )
}
