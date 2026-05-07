import { motion } from "framer-motion"
import { Lock, Shield, Globe, Cpu, Activity, Terminal, Fingerprint, Search } from "lucide-react"
import { AnimatedBackground } from "../components/raksha/animated-background"
import { LoginForm } from "../components/raksha/login-form"

export default function LoginPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030810]">
      {/* Premium Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030810]/50 to-[#030810]" />
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      {/* Global Scanning Effects */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <div className="radar-sweep opacity-30" />
        <div className="absolute inset-0 bg-[length:100%_4px] bg-gradient-to-b from-transparent via-white/[0.01] to-transparent animate-scan pointer-events-none opacity-20" />
      </div>

      {/* Strategic Data Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] z-0 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,153,51,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,153,51,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
      </div>

      {/* Top Navigation - Tactical HUD */}
      <div className="absolute top-0 left-0 w-full p-8 md:p-12 flex items-center justify-between z-50">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl bg-[#030810]/80 border border-white/10 backdrop-blur-xl flex items-center justify-center overflow-hidden shadow-2xl transition-all group-hover:border-[#FF9933]/50">
               <motion.div 
                 className="absolute inset-0 bg-[#FF9933]/10"
                 animate={{ opacity: [0.1, 0.4, 0.1] }}
                 transition={{ duration: 3, repeat: Infinity }}
               />
               <Shield className="text-[#FF9933] relative z-10 drop-shadow-[0_0_12px_rgba(255,153,51,0.5)]" size={32} />
            </div>
            <motion.div 
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#00E676] border-[3px] border-[#030810] shadow-[0_0_15px_#00E676]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black tracking-[0.4em] text-white leading-tight uppercase">Raksha AI</h2>
              <span className="px-2 py-0.5 rounded bg-[#FF9933]/10 border border-[#FF9933]/20 text-[9px] font-black text-[#FF9933] tracking-widest">v4.0 HD</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
               <p className="text-[10px] tracking-[0.5em] text-[#7B8FA8] font-bold uppercase opacity-60">National Command Protocol</p>
               <span className="w-1.5 h-3 bg-[#FF9933]/60 animate-pulse" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex items-center gap-10"
        >
          <div className="flex flex-col items-end gap-2">
             <div className="flex items-center gap-3 text-[#7B8FA8]">
                <span className="text-[10px] font-black tracking-widest uppercase opacity-40">System Core</span>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <Activity size={12} className="text-[#00E676] animate-pulse" />
                  <span className="text-[10px] font-bold text-white tracking-widest uppercase">STABLE</span>
                </div>
             </div>
             <div className="flex items-center gap-3 text-[#7B8FA8]">
                <span className="text-[10px] font-black tracking-widest uppercase opacity-40">Sector ID</span>
                <span className="text-[10px] font-bold text-[#FF9933] tracking-widest uppercase">NCC-WEST-01</span>
             </div>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-[#3D5068] font-black tracking-widest mb-2 uppercase opacity-60">Security Level</span>
            <div className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <span className="text-[10px] font-black tracking-[0.2em] text-red-500 uppercase">CLASSIFIED</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Container - Dual Layer Glass */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-[500px] px-8">
        
        {/* Subtle Backdrop Glow */}
        <div className="absolute -inset-20 bg-[#FF9933]/5 blur-[120px] rounded-full opacity-50" />

        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 relative inline-block"
          >
            <div className="absolute -inset-8 bg-[#FF9933]/10 blur-2xl rounded-full animate-pulse" />
            <div className="relative p-7 rounded-[32px] bg-[#040E1E] border border-white/10 shadow-2xl backdrop-blur-3xl">
              <Fingerprint size={64} className="text-[#FF9933] drop-shadow-[0_0_15px_#FF9933]" />
              <motion.div 
                className="absolute inset-0 border-2 border-dashed border-[#FF9933]/20 rounded-full scale-125"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-5xl font-black tracking-tighter text-white mb-4 uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              Access Terminal
            </h1>
            <div className="flex items-center justify-center gap-4 text-[#7B8FA8]">
              <div className="h-px w-8 bg-white/10" />
              <p className="text-[11px] tracking-[0.4em] font-black uppercase opacity-60">
                Personnel Verification
              </p>
              <div className="h-px w-8 bg-white/10" />
            </div>
          </motion.div>
        </div>

        {/* The Enhanced Login Form */}
        <LoginForm />

        {/* Tactical Footer Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 w-full"
        >
          <div className="flex flex-col items-center gap-8">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" className="h-10 grayscale invert" alt="Emblem" />
               <div className="text-left">
                  <p className="text-[10px] font-black text-white tracking-widest uppercase">Ministry of Home Affairs</p>
                  <p className="text-[8px] text-[#7B8FA8] tracking-[0.2em] uppercase font-bold">Government of India // NCC Protocol</p>
               </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative UI Elements */}
      <div className="absolute bottom-10 left-10 hidden lg:block font-mono text-[9px] font-bold text-[#3D5068] tracking-[0.3em] opacity-40">
        <p>TERMINAL: STABLE</p>
        <p className="mt-1 uppercase text-[#FF9933]">SYNC: ACTIVE</p>
      </div>

      <div className="absolute bottom-10 right-10 hidden lg:block text-right font-mono text-[9px] font-bold text-[#3D5068] tracking-[0.3em] opacity-40">
        <p>© 2026 RAKSHA AI</p>
        <p className="mt-1">SECURITY CLEARANCE: LVL 4</p>
      </div>

      <style>{`
        @keyframes scan {
          from { background-position: 0 0; }
          to { background-position: 0 100%; }
        }
        .animate-scan {
          animation: scan 10s linear infinite;
        }
      `}</style>
    </main>
  )
}


