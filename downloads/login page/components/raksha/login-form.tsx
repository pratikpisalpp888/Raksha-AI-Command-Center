"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Lock, Eye, EyeOff, AlertTriangle, Check } from "lucide-react"

type LoginState = "idle" | "loading" | "success"

export function LoginForm() {
  const [agentId, setAgentId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberDevice, setRememberDevice] = useState(false)
  const [loginState, setLoginState] = useState<LoginState>("idle")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [dotCount, setDotCount] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginState("loading")
    
    // Animate dots
    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1)
    }, 400)

    // Simulate authentication
    setTimeout(() => {
      clearInterval(dotInterval)
      setLoginState("success")
      
      // Reset after showing success
      setTimeout(() => {
        setLoginState("idle")
      }, 2000)
    }, 2500)
  }

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative w-full max-w-[420px]"
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
        style={{
          background: "rgba(4,14,30,0.92)",
          border: "1px solid rgba(255,107,0,0.2)",
          borderRadius: "24px",
          backdropFilter: "blur(24px)",
          boxShadow: `
            0 0 0 1px rgba(255,107,0,0.08),
            0 40px 80px rgba(0,0,0,0.6),
            0 0 60px rgba(255,107,0,0.06)
          `,
          overflow: "hidden",
        }}
      >
        {/* Indian flag tricolor bar at top */}
        <div
          className="w-full h-[3px]"
          style={{
            background: "linear-gradient(90deg, #FF9933, #FFFFFF, #138808)",
          }}
        />

        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#3D5068]" />
              <span className="text-[10px] tracking-[0.25em] text-[#7B8FA8]">
                SECURE ACCESS
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#3D5068]" />
            </div>
            <h2 className="text-lg font-bold text-white mb-3">
              AGENT AUTHENTICATION
            </h2>
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-[#00E676]"
                style={{ boxShadow: "0 0 10px #00E676" }}
              />
              <span className="text-xs text-[#00E676]">System Operational</span>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Agent ID Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
            >
              <label className="block text-[9px] tracking-wide text-[#FF6B00] mb-2 font-medium">
                AGENT ID
              </label>
              <div
                className="relative transition-all duration-300"
                style={{
                  boxShadow: focusedField === "agentId" 
                    ? "0 0 0 3px rgba(255,107,0,0.1), 0 0 20px rgba(255,107,0,0.08)"
                    : "none",
                  borderRadius: "10px",
                }}
              >
                <User 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF6B00] transition-all duration-300"
                  style={{
                    filter: focusedField === "agentId" || agentId 
                      ? "drop-shadow(0 0 8px #FF6B00)" 
                      : "none"
                  }}
                />
                <input
                  type="text"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  onFocus={() => setFocusedField("agentId")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your Agent ID"
                  className="w-full h-12 pl-12 pr-4 bg-black/40 border rounded-[10px] text-white placeholder:text-[#7B8FA8] outline-none transition-all duration-300"
                  style={{
                    borderColor: focusedField === "agentId" || agentId
                      ? "rgba(255,107,0,0.5)"
                      : "rgba(255,107,0,0.15)",
                  }}
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
            >
              <label className="block text-[9px] tracking-wide text-[#FF6B00] mb-2 font-medium">
                ACCESS CODE
              </label>
              <div
                className="relative transition-all duration-300"
                style={{
                  boxShadow: focusedField === "password" 
                    ? "0 0 0 3px rgba(255,107,0,0.1), 0 0 20px rgba(255,107,0,0.08)"
                    : "none",
                  borderRadius: "10px",
                }}
              >
                <Lock 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF6B00] transition-all duration-300"
                  style={{
                    filter: focusedField === "password" || password 
                      ? "drop-shadow(0 0 8px #FF6B00)" 
                      : "none"
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your Access Code"
                  className="w-full h-12 pl-12 pr-12 bg-black/40 border rounded-[10px] text-white placeholder:text-[#7B8FA8] outline-none transition-all duration-300"
                  style={{
                    borderColor: focusedField === "password" || password
                      ? "rgba(255,107,0,0.5)"
                      : "rgba(255,107,0,0.15)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7B8FA8] hover:text-[#FF6B00] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Remember + Forgot */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setRememberDevice(!rememberDevice)}
                  className="w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center cursor-pointer"
                  style={{
                    borderColor: rememberDevice ? "#FF6B00" : "rgba(255,107,0,0.3)",
                    backgroundColor: rememberDevice ? "#FF6B00" : "transparent",
                  }}
                >
                  {rememberDevice && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs text-[#7B8FA8] group-hover:text-[#9BA9BC] transition-colors">
                  Remember this device
                </span>
              </label>
              <button
                type="button"
                className="text-xs text-[#FF6B00] hover:underline transition-all"
              >
                Emergency Access?
              </button>
            </motion.div>

            {/* Login Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <motion.button
                type="submit"
                disabled={loginState !== "idle"}
                whileHover={loginState === "idle" ? { y: -2 } : {}}
                whileTap={loginState === "idle" ? { y: 0, scale: 0.99 } : {}}
                className="w-full h-[52px] rounded-xl font-bold tracking-widest text-white transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: loginState === "success"
                    ? "linear-gradient(135deg, #00E676, #00C853)"
                    : "linear-gradient(135deg, #FF6B00, #FF9933)",
                  boxShadow: loginState === "success"
                    ? "0 4px 20px rgba(0,230,118,0.4), 0 0 40px rgba(0,230,118,0.1)"
                    : "0 4px 20px rgba(255,107,0,0.4), 0 0 40px rgba(255,107,0,0.1)",
                }}
              >
                <AnimatePresence mode="wait">
                  {loginState === "idle" && (
                    <motion.span
                      key="authenticate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      AUTHENTICATE
                    </motion.span>
                  )}
                  {loginState === "loading" && (
                    <motion.span
                      key="verifying"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      VERIFYING{".".repeat(dotCount)}
                    </motion.span>
                  )}
                  {loginState === "success" && (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      ACCESS GRANTED
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="flex items-center gap-4 my-6"
          >
            <div className="flex-1 h-px bg-[#3D5068]" />
            <span className="text-xs text-[#7B8FA8]">OR</span>
            <div className="flex-1 h-px bg-[#3D5068]" />
          </motion.div>

          {/* Emergency Override */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
            className="text-center"
          >
            <p className="text-xs text-[#7B8FA8] mb-3">
              EMERGENCY OVERRIDE ACCESS
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/50 text-red-400 text-sm hover:bg-red-500/10 transition-all"
            >
              <AlertTriangle className="w-4 h-4" />
              Emergency Access
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
