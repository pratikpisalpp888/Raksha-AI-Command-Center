import { Shield, LogOut, Clock, Calendar, LayoutDashboard, PhoneCall, PieChart, Activity } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { agent, logout } = useAuth()
  const [time, setTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { label: 'Live Calls', path: '/calls', icon: <PhoneCall size={16} /> },
    { label: 'Reports', path: '/reports', icon: <PieChart size={16} /> },
  ]
  
  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <header className="sticky top-0 z-[100] backdrop-blur-xl border-b border-white/5" style={{
      background: 'rgba(3, 8, 16, 0.85)',
    }}>
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-8 h-20">
        
        {/* Brand Section */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
          <div className="relative">
            <Shield 
              size={32} 
              className="text-[#FF9933] drop-shadow-[0_0_15px_rgba(255,153,51,0.5)]"
              fill="rgba(255,153,51,0.15)"
            />
          </div>
          <div>
            <h1 className="font-black tracking-[0.15em] text-xl leading-none"
              style={{
                background: 'linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #FF9933 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              RAKSHA AI
            </h1>
            <p className="text-[9px] tracking-[0.2em] font-bold text-[#3D5068] uppercase mt-1">
              National Command Center
            </p>
          </div>
        </div>
        
        {/* Navigation */}
        {agent && (
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/5 backdrop-blur-md">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 relative group overflow-hidden`}
                style={{
                  color: isActive(item.path) ? '#FF9933' : '#7B8FA8',
                }}
              >
                {isActive(item.path) && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-gradient-to-r from-[rgba(255,153,51,0.15)] to-transparent z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span className={`${isActive(item.path) ? 'text-[#FF9933]' : 'text-[#7B8FA8] group-hover:text-white'} transition-colors`}>
                    {item.icon}
                  </span>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        )}
        
        {/* Actions & Info Section */}
        <div className="flex items-center gap-6">
          {/* Real-time Clock Module */}
          <div className="hidden xl:flex items-center gap-4 px-6 py-2.5 bg-gradient-to-b from-white/[0.05] to-transparent rounded-[1.2rem] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)] group hover:border-[#FF9933]/30 transition-all duration-500">
            <div className="flex flex-col items-end border-r border-white/10 pr-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_8px_#00E676]" />
                <span className="text-[14px] font-black text-white tabular-nums tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  {time.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                  <span className="animate-pulse mx-0.5 opacity-50">:</span>
                  {time.toLocaleTimeString('en-IN', { second: '2-digit' })}
                </span>
              </div>
              <p className="text-[8px] font-black text-[#FF9933] tracking-[0.3em] uppercase opacity-80">Sync: Neural-Net</p>
            </div>
            
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black text-[#F5F0FF] uppercase tracking-widest">
                {time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }).toUpperCase()}
              </span>
              <span className="text-[8px] font-bold text-[#7B8FA8] uppercase tracking-[0.2em]">
                {time.toLocaleDateString('en-IN', { year: 'numeric' })}
              </span>
            </div>
          </div>
          
          {/* User Profile Badge */}
          {agent && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 px-4 py-1.5 bg-white/[0.02] rounded-[1.2rem] border border-white/5 hover:border-white/10 transition-all">
                <div className="text-right hidden sm:block">
                  <p className="text-[11px] font-black text-[#F5F0FF] uppercase tracking-wider">{agent.name}</p>
                  <div className="flex items-center justify-end gap-1">
                     <div className="w-1 h-1 rounded-full bg-[#FF9933]" />
                     <p className="text-[8px] font-bold text-[#7B8FA8] uppercase tracking-[0.1em]">{agent.role}</p>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-black bg-gradient-to-br from-[#FF9933]/20 to-transparent border border-[#FF9933]/40 text-[#FF9933] shadow-[0_5px_15px_rgba(255,153,51,0.1)]">
                  {agent.name?.charAt(0)}
                </div>
              </div>
              
              <button 
                onClick={logout} 
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[#7B8FA8] hover:text-[#FF2D55] hover:border-[#FF2D55]/30 hover:bg-[#FF2D55]/5 transition-all duration-300"
                title="Logout System"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Tricolor Line */}
      <div className="h-[2px] w-full flex">
        <div className="h-full w-1/3 bg-[#FF6B00]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>
    </header>
  )
}
