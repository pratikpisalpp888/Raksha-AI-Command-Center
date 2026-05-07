import { motion, AnimatePresence } from "framer-motion"
import { Shield } from "lucide-react"
import { useState, useEffect } from "react"

export default function CinematicIntro({ onComplete }) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const timers = []
    
    // Stage 1: Breathing light begins (0-1s)
    timers.push(setTimeout(() => setStage(1), 100))
    
    // Stage 2: Shield materializes (1-2s)
    timers.push(setTimeout(() => setStage(2), 1000))
    
    // Stage 3: Title reveals (2-3s)
    timers.push(setTimeout(() => setStage(3), 2000))
    
    // Stage 4: Tagline + pulse ring (3-4s)
    timers.push(setTimeout(() => setStage(4), 3000))
    
    // Stage 5: Final surge (4-5s)
    timers.push(setTimeout(() => setStage(5), 4000))
    
    // Complete
    timers.push(setTimeout(() => {
      if (onComplete) onComplete()
    }, 5200))
    
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(180deg, #020608 0%, #030810 50%, #020608 100%)" }}
        exit={{ 
          opacity: 0,
          transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
        }}
      >
        {/* Deep space ambient glow */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 60%)",
            }}
          />
        </motion.div>

        {/* Stage 1: Breathing center light */}
        {stage >= 1 && (
          <motion.div
            className="absolute"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 0.6, 0.4],
              scale: [0.8, 1.2, 1]
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div 
              className="w-[300px] h-[300px] rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(255,153,51,0.3) 0%, rgba(255,107,0,0.1) 40%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
          </motion.div>
        )}

        {/* Stage 2: Shield materializes with smooth reveal */}
        {stage >= 2 && (
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 200,
                height: 200,
                background: "radial-gradient(circle, transparent 40%, rgba(255,153,51,0.15) 60%, transparent 80%)",
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />

            {/* Rotating accent ring */}
            <motion.div
              className="absolute w-[180px] h-[180px] rounded-full"
              style={{
                border: "1px solid rgba(255,153,51,0.2)",
                borderTop: "1px solid rgba(255,153,51,0.6)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 360 }}
              transition={{ 
                scale: { duration: 0.6 },
                opacity: { duration: 0.6 },
                rotate: { duration: 10, repeat: Infinity, ease: "linear" }
              }}
            />

            {/* Shield with smooth scale up */}
            <motion.div
              className="relative"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2,
                ease: [0.34, 1.56, 0.64, 1]
              }}
            >
              {/* Glow behind shield */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.7] }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <div 
                  className="w-[120px] h-[120px] rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(255,107,0,0.5) 0%, transparent 70%)",
                    filter: "blur(20px)",
                  }}
                />
              </motion.div>

              <Shield 
                size={90} 
                className="relative z-10"
                style={{
                  fill: "url(#shieldGrad)",
                  stroke: "url(#shieldGrad)",
                  strokeWidth: 1.5,
                  filter: "drop-shadow(0 0 30px rgba(255,107,0,0.6))"
                }}
              />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FF9933" />
                    <stop offset="50%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#138808" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Stage 3: Title with smooth reveal */}
            {stage >= 3 && (
              <motion.div
                className="mt-10 text-center overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Title with mask reveal effect */}
                <motion.div
                  className="relative overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.h1
                    className="text-6xl md:text-7xl font-black tracking-[0.1em]"
                    initial={{ y: 60 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span 
                      style={{ 
                        background: "linear-gradient(180deg, #FF9933 0%, #FF6B00 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      RAKSHA
                    </span>
                    <span 
                      className="ml-4 text-white"
                      style={{ 
                        textShadow: "0 0 40px rgba(255,255,255,0.3)",
                      }}
                    >
                      AI
                    </span>
                  </motion.h1>
                </motion.div>

                {/* Decorative line under title */}
                <motion.div
                  className="mt-4 h-[2px] mx-auto bg-gradient-to-r from-transparent via-[#FF9933] to-transparent"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                />
              </motion.div>
            )}

            {/* Stage 4: Tagline with elegant fade */}
            {stage >= 4 && (
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.p
                  className="text-lg tracking-[0.4em] font-medium"
                  style={{
                    background: "linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  BHARAT SHIELD
                </motion.p>
                
                <motion.p
                  className="mt-3 text-sm tracking-[0.3em] text-[#6B7B8F]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  1092 Emergency Command Center
                </motion.p>

                {/* Subtle pulse rings */}
                <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {[0, 1].map((i) => (
                    <motion.div
                      key={`pulse-${i}`}
                      className="absolute w-[100px] h-[100px] rounded-full border border-[#FF9933]/30"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 3, opacity: 0 }}
                      transition={{ 
                        duration: 2, 
                        delay: i * 0.4,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Stage 5: Final activation surge */}
        {stage >= 5 && (
          <>
            {/* Expanding energy waves */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`wave-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 150,
                  height: 150,
                  border: `1px solid ${i === 0 ? "#FF9933" : i === 1 ? "rgba(255,255,255,0.5)" : "#138808"}`,
                }}
                initial={{ scale: 0.5, opacity: 0.8 }}
                animate={{ scale: 6, opacity: 0 }}
                transition={{ 
                  duration: 1.2, 
                  delay: i * 0.15, 
                  ease: [0.4, 0, 0.2, 1]
                }}
              />
            ))}

            {/* Bright flash */}
            <motion.div
              className="fixed inset-0 bg-white pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />

            {/* Final fade to dashboard color */}
            <motion.div
              className="fixed inset-0 bg-[#030810] pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            />
          </>
        )}

        {/* Subtle vignette */}
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
