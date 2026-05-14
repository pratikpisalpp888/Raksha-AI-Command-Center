"use client"

import { motion } from "framer-motion"
import { Search, Filter, MapPin, Clock, User } from "lucide-react"
import { useState } from "react"

type Severity = "PANIC" | "DISTRESSED" | "CONCERNED" | "CALM"
type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "RESOLVED"

interface Case {
  id: string
  emotion: Severity
  priority: Priority
  type: string
  location: string
  time: string
  officer: string
}

const cases: Case[] = [
  { id: "RK-1092-4847", emotion: "PANIC", priority: "CRITICAL", type: "Domestic Violence", location: "Koramangala, 5th Block", time: "2 min ago", officer: "Unit-K7" },
  { id: "RK-1092-4846", emotion: "DISTRESSED", priority: "HIGH", type: "Stalking", location: "Indiranagar, 100ft Road", time: "8 min ago", officer: "Unit-I3" },
  { id: "RK-1092-4845", emotion: "CONCERNED", priority: "MEDIUM", type: "Harassment", location: "Whitefield, ITPL", time: "15 min ago", officer: "Unit-W9" },
  { id: "RK-1092-4844", emotion: "DISTRESSED", priority: "HIGH", type: "Domestic Violence", location: "Jayanagar, 4th Block", time: "22 min ago", officer: "Unit-J2" },
  { id: "RK-1092-4843", emotion: "CALM", priority: "RESOLVED", type: "Info Request", location: "HSR Layout, Sector 2", time: "35 min ago", officer: "AI-Assist" },
]

const emotionColors: Record<Severity, string> = {
  PANIC: "bg-[#FF2D55] text-white",
  DISTRESSED: "bg-[#FF6B2B] text-white",
  CONCERNED: "bg-[#FFD60A] text-[#030810]",
  CALM: "bg-[#00E676] text-[#030810]",
}

const priorityColors: Record<Priority, string> = {
  CRITICAL: "text-[#FF2D55] border-[#FF2D55]",
  HIGH: "text-[#FF6B2B] border-[#FF6B2B]",
  MEDIUM: "text-[#FFD60A] border-[#FFD60A]",
  RESOLVED: "text-[#00E676] border-[#00E676]",
}

const rowGlowColors: Record<Severity, string> = {
  PANIC: "hover:shadow-[inset_0_0_30px_rgba(255,45,85,0.15)]",
  DISTRESSED: "hover:shadow-[inset_0_0_30px_rgba(255,107,43,0.15)]",
  CONCERNED: "hover:shadow-[inset_0_0_30px_rgba(255,214,10,0.1)]",
  CALM: "hover:shadow-[inset_0_0_30px_rgba(0,230,118,0.1)]",
}

export function EmergencyCases() {
  const [activeTab, setActiveTab] = useState("all")
  const tabs = ["all", "critical", "active", "resolved"]

  return (
    <motion.div
      className="glass-card h-[520px] flex flex-col overflow-hidden"
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      {/* Top accent line */}
      <div 
        className="h-[3px] w-full"
        style={{ background: "linear-gradient(90deg, #FF6B00, #FF9933)" }}
      />

      {/* Header */}
      <div className="p-4 border-b border-[rgba(255,107,0,0.15)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold tracking-wide text-[#F5F0FF]">
            🚨 EMERGENCY CASES
          </h3>
          <span className="text-xs text-[#FF9933] font-mono">
            LIVE MONITORING
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded transition-all ${
                activeTab === tab
                  ? "bg-[rgba(255,107,0,0.15)] text-[#FF9933] border-b-2 border-[#FF9933]"
                  : "text-[#7B8FA8] hover:text-[#FF9933]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8FA8]" size={14} />
            <input
              type="text"
              placeholder="Search cases..."
              className="w-full bg-[rgba(255,107,0,0.05)] border border-[rgba(255,107,0,0.15)] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F5F0FF] placeholder-[#7B8FA8] focus:outline-none focus:border-[#FF9933] focus:shadow-[0_0_10px_rgba(255,107,0,0.2)] transition-all"
            />
          </div>
          <button className="p-2 rounded-lg bg-[rgba(255,107,0,0.05)] border border-[rgba(255,107,0,0.15)] text-[#7B8FA8] hover:text-[#FF9933] hover:border-[#FF9933] transition-all">
            <Filter size={14} />
          </button>
        </div>
      </div>

      {/* Cases List */}
      <div className="flex-1 overflow-y-auto p-2">
        {cases.map((caseItem, index) => (
          <motion.div
            key={caseItem.id}
            className={`p-3 mb-2 rounded-lg bg-[rgba(4,14,30,0.6)] border border-[rgba(255,107,0,0.08)] cursor-pointer transition-all hover:border-[rgba(255,107,0,0.3)] ${rowGlowColors[caseItem.emotion]}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#FF9933]">{caseItem.id}</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${emotionColors[caseItem.emotion]}`}>
                  {caseItem.emotion}
                </span>
                <span className={`px-2 py-0.5 rounded border text-[8px] ${priorityColors[caseItem.priority]}`}>
                  {caseItem.priority}
                </span>
              </div>
            </div>

            <p className="text-sm text-[#F5F0FF] font-medium mb-2">{caseItem.type}</p>

            <div className="flex items-center gap-4 text-[10px] text-[#7B8FA8]">
              <span className="flex items-center gap-1">
                <MapPin size={10} className="text-[#FF9933]" />
                {caseItem.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {caseItem.time}
              </span>
              <span className="flex items-center gap-1">
                <User size={10} />
                {caseItem.officer}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
