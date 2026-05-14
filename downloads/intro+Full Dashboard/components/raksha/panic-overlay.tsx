"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export function PanicOverlay() {
  const [showPanic, setShowPanic] = useState(false)

  useEffect(() => {
    // Trigger panic effect after dashboard loads
    const timer = setTimeout(() => {
      setShowPanic(true)
      // Hide after 1.5 seconds
      setTimeout(() => setShowPanic(false), 1500)
    }, 6500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {showPanic && (
        <>
          {/* Red vignette flash */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-40"
            style={{
              background: "radial-gradient(ellipse at center, transparent 30%, rgba(255,45,85,0.3) 100%)"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />

          {/* Sound wave visual in header area */}
          <motion.div
            className="fixed top-[80px] left-1/2 -translate-x-1/2 flex items-end gap-1 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-[#FF6B00] rounded-full"
                animate={{
                  height: [8, 20 + Math.random() * 20, 8],
                }}
                transition={{
                  duration: 0.3,
                  repeat: 3,
                  delay: i * 0.05,
                }}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
