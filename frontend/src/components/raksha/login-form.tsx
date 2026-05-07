import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Eye, EyeOff, AlertTriangle, Check, Mail, RefreshCw } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

export function LoginForm({ onLoginSuccess }) {
  const { login: authLogin } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberDevice, setRememberDevice] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginState, setLoginState] = useState("idle")
  const [error, setError] = useState("")
  const [focusedField, setFocusedField] = useState(null)
  const [dotCount, setDotCount] = useState(1)

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    
    setLoginState("loading")
    setIsLoading(true)
    setError('')
    
    // Simulate loading delay (makes it feel real)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    try {
      // Try to login using context
      const result = await authLogin(email, password)
      
      if (result && result.success) {
        setLoginState("success")
        setIsLoading(false)
        // Reset after showing success
        setTimeout(() => {
          setLoginState("idle")
          if (onLoginSuccess) {
            onLoginSuccess()
          }
        }, 1000)
      } else {
        throw new Error(result?.message || 'Invalid credentials')
      }
    } catch (err) {
      setLoginState("idle")
      setIsLoading(false)
      setError(err.message || 'Invalid email or password. Use demo credentials below.')
    }
  }

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="w-full relative"
    >
      <div
        className="relative p-10 rounded-[40px] overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(4,14,30,0.95), rgba(2,6,14,0.98))",
          border: "1px solid rgba(255,153,51,0.15)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255,153,51,0.05)",
          backdropFilter: "blur(40px)"
        }}
      >
        {/* Subtle Inner Glow */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF9933]/30 to-transparent" />
        
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#FF9933] tracking-[0.3em] uppercase ml-1">
                Security ID
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3D5068] group-focus-within:text-[#FF9933] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@raksha.gov.in"
                  className="w-full h-14 pl-12 pr-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-[#3D5068] outline-none focus:border-[#FF9933]/40 focus:bg-white/[0.05] transition-all font-medium text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#FF9933] tracking-[0.3em] uppercase ml-1">
                Access Code
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3D5068] group-focus-within:text-[#FF9933] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-12 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-[#3D5068] outline-none focus:border-[#FF9933]/40 focus:bg-white/[0.05] transition-all font-medium text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3D5068] hover:text-[#FF9933] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => setRememberDevice(!rememberDevice)}
              className="flex items-center gap-3 group"
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${rememberDevice ? 'bg-[#FF9933] border-[#FF9933]' : 'bg-white/5 border-white/10 group-hover:border-white/20'}`}>
                {rememberDevice && <Check size={14} className="text-[#030810]" />}
              </div>
              <span className="text-[10px] font-bold text-[#7B8FA8] uppercase tracking-widest group-hover:text-white transition-colors">Remember Device</span>
            </button>
            <button type="button" className="text-[10px] font-bold text-[#FF9933] uppercase tracking-widest hover:underline opacity-60 hover:opacity-100 transition-all">
              Lost Access?
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
              >
                <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-tight">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            className="w-full h-16 rounded-[24px] bg-gradient-to-r from-[#FF6B00] to-[#FF9933] text-white font-black tracking-[0.3em] uppercase text-xs shadow-[0_15px_30px_rgba(255,107,0,0.3)] hover:shadow-[0_20px_40px_rgba(255,107,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isLoading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : loginState === "success" ? (
                <>
                  <Check size={18} />
                  Access Granted
                </>
              ) : (
                "Authorize Access"
              )}
            </span>
          </motion.button>

          {/* Tactical Demo Helper */}
          <div className="pt-8 border-t border-white/5 space-y-4">
            <p className="text-[9px] font-black text-[#3D5068] tracking-[0.4em] uppercase text-center">Authorized Personnel</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { email: 'agent@raksha.gov.in', password: 'Raksha@1092', name: 'Pratik Pisal', role: 'AGENT' },
                { email: 'supervisor@raksha.gov.in', password: 'Super@1092', name: 'Raman Yadav', role: 'SUPERVISOR' },
              ].map((cred, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setEmail(cred.email)
                    setPassword(cred.password)
                  }}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-[#FF9933]/30 transition-all text-left group"
                >
                  <p className="text-[10px] font-black text-white group-hover:text-[#FF9933] transition-colors uppercase">{cred.name}</p>
                  <p className="text-[8px] font-bold text-[#3D5068] uppercase tracking-widest mt-0.5">{cred.role}</p>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  )
}
