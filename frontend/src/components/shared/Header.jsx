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
          <nav className="hidden lg:flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300`}
                style={{
                  color: isActive(item.path) ? '#FF9933' : '#7B8FA8',
                  background: isActive(item.path) ? 'rgba(255, 153, 51, 0.1)' : 'transparent',
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        )}
        
        {/* Actions & Info Section */}
        <div className="flex items-center gap-6">
          {/* Real-time Clock */}
          <div className="hidden xl:flex items-center gap-4 px-4 py-2 bg-white/5 rounded-xl border border-white/5 font-mono">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#FF9933]" />
              <span className="text-sm font-bold text-[#F5F0FF]">
                {time.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#7B8FA8]" />
              <span className="text-[11px] text-[#7B8FA8]">
                {time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* User Profile */}
          {agent && (
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-[#F5F0FF]">{agent.name}</p>
                  <p className="text-[9px] font-bold text-[#7B8FA8] uppercase tracking-tighter">{agent.role}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black bg-[#FF9933]/10 border border-[#FF9933]/30 text-[#FF9933]">
                  {agent.name?.charAt(0)}
                </div>
              </div>
              
              <button 
                onClick={logout} 
                className="p-2.5 rounded-xl bg-red-500/5 border border-red-500/10 text-[#7B8FA8] hover:text-[#FF2D55] transition-all duration-300"
              >
                <LogOut size={18} />
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
