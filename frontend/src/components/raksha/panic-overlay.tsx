"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export function PanicOverlay() {
  const [showPanic, setShowPanic] = useState(false)

  useEffect(() => {
    // Listen for custom "emergency" event triggered by the WebSocket or Simulation
    const handleEmergency = (e: any) => {
      const priority = e.detail?.priority
      // ONLY trigger for critical emergencies
      if (priority === 'critical') {
        setShowPanic(true)
        // Flash for 2.5 seconds for maximum impact
        setTimeout(() => setShowPanic(false), 2500)
      }
    }

    window.addEventListener('raksha-emergency', handleEmergency)

    return () => {
      window.removeEventListener('raksha-emergency', handleEmergency)
    }
  }, [])

  return (
    <AnimatePresence>
      {showPanic && (
        <>
          {/* Red vignette flash - Full Screen */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-[9999]"
            style={{
              background: "radial-gradient(ellipse at center, transparent 20%, rgba(255,45,85,0.4) 100%)",
              boxShadow: "inset 0 0 100px rgba(255,45,85,0.5)"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.4, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, repeat: 1 }}
          />

          {/* Emergency Text Overlay */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[10000] pointer-events-none"
          >
            <div className="bg-[#FF2D55] text-white px-6 py-2 rounded-full font-black tracking-[0.3em] text-sm shadow-[0_0_30px_rgba(255,45,85,0.6)] flex items-center gap-3">
               <span className="animate-pulse">🚨</span>
               NEW EMERGENCY DETECTED
               <span className="animate-pulse">🚨</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
