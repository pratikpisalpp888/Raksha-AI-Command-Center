import { motion } from "framer-motion"
import { AnimatedBackground } from "@/components/raksha/animated-background"
import Header from "../components/shared/Header"
import DemoControls from "../components/shared/DemoControls"
import { StatCards } from "@/components/raksha/stat-cards"
import { EmergencyCases } from "@/components/raksha/emergency-cases"
import { TacticalMap } from "@/components/raksha/tactical-map"
import { MissionAlerts } from "@/components/raksha/mission-alerts"
import { AnalyticsRow } from "@/components/raksha/analytics-row"
import { LiveStats } from "@/components/raksha/live-stats"
import { PanicOverlay } from "@/components/raksha/panic-overlay"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#030810] text-[#F5F0FF] overflow-y-auto relative">
      {/* Tactical CRT Overlay Effect */}
      <div className="fixed inset-0 pointer-events-none z-[1000] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="fixed inset-0 pointer-events-none z-[1000] bg-gradient-to-b from-transparent via-white/[0.01] to-transparent bg-[length:100%_4px] animate-scan" />

      {/* Animated Background */}
      <AnimatedBackground />

      {/* Panic Overlay Effect (Pulses red when critical cases arrive) */}
      <PanicOverlay />

      {/* Dashboard Content */}
      <motion.div
        className="relative z-10 min-h-screen flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Header />

        <div className="flex-1 max-w-[1700px] mx-auto w-full flex flex-col">
          {/* Top Stats Cards */}
          <StatCards />

          {/* Live System Performance Stats */}
          <LiveStats />

          {/* Main 3-Column Tactical Layout */}
          <div className="grid grid-cols-[40%_35%_25%] gap-6 px-6 mb-6 flex-1">
            {/* Column 1: Live Feed of Incoming Cases */}
            <EmergencyCases />
            
            {/* Column 2: Geographic Tactical Map */}
            <TacticalMap />
            
            {/* Column 3: Global System Alerts */}
            <MissionAlerts />
          </div>

          {/* Bottom Data Analytics Section */}
          <div className="px-6 pb-8">
            <AnalyticsRow />
          </div>
        </div>
      </motion.div>

      {/* Global System Status Indicator */}
      <div className="fixed bottom-6 left-6 z-[2000] flex items-center gap-3 px-4 py-2 bg-[#030810]/80 backdrop-blur-xl border border-white/5 rounded-full shadow-2xl pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-[#00E676] status-led shadow-[0_0_10px_#00E676]" />
        <span className="text-[9px] font-black tracking-[0.3em] text-white/40 uppercase">System Status: Operational</span>
      </div>

      {/* Demo Controls Panel — Fixed bottom-right, always visible */}
      <DemoControls />

      <style>{`
        @keyframes scan {
          from { background-position: 0 0; }
          to { background-position: 0 100%; }
        }
        .animate-scan {
          animation: scan 10s linear infinite;
        }
      `}</style>
    </div>
  )
}
