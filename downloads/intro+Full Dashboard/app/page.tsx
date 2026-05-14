"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CinematicIntro } from "@/components/raksha/cinematic-intro"
import { AnimatedBackground } from "@/components/raksha/animated-background"
import { Header } from "@/components/raksha/header"
import { StatCards } from "@/components/raksha/stat-cards"
import { EmergencyCases } from "@/components/raksha/emergency-cases"
import { TacticalMap } from "@/components/raksha/tactical-map"
import { MissionAlerts } from "@/components/raksha/mission-alerts"
import { AnalyticsRow } from "@/components/raksha/analytics-row"
import { LiveStats } from "@/components/raksha/live-stats"
import { PanicOverlay } from "@/components/raksha/panic-overlay"

export default function RakshaAIDashboard() {
  const [introComplete, setIntroComplete] = useState(false)

  return (
    <div className="min-h-screen bg-[#030810] text-[#F5F0FF] overflow-hidden">
      {/* Cinematic Intro */}
      <AnimatePresence>
        {!introComplete && (
          <CinematicIntro onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

      {/* Main Dashboard */}
      {introComplete && (
        <>
          {/* Animated Background */}
          <AnimatedBackground />

          {/* Panic Overlay Effect */}
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

            {/* Stat Cards Row */}
            <StatCards />

            {/* Live Stats Row */}
            <LiveStats />

            {/* Main 3-Column Layout */}
            <div className="grid grid-cols-[40%_35%_25%] gap-5 px-6">
              <EmergencyCases />
              <TacticalMap />
              <MissionAlerts />
            </div>

            {/* Analytics Row */}
            <div className="mt-5">
              <AnalyticsRow />
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
