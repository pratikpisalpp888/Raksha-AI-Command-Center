import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Initialize particles
    const colors = [
      "rgba(255,107,0,0.4)",  // Saffron
      "rgba(41,121,255,0.4)"   // Blue
    ]
    
    particlesRef.current = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))

    let animationId: number

    const animate = () => {
      ctx.fillStyle = "#030810"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw circuit grid lines
      ctx.strokeStyle = "rgba(255,107,0,0.04)"
      ctx.lineWidth = 0.5
      const gridSize = 40

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Update and draw particles
      const particles = particlesRef.current
      
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(255,107,0,${0.1 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Layer 1: Canvas with particles and grid */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />

      {/* Layer 4: Corner glows */}
      <div 
        className="absolute top-0 left-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(circle at top left, rgba(255,107,0,0.12) 0%, transparent 60%)"
        }}
      />
      <div 
        className="absolute bottom-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(circle at bottom right, rgba(41,121,255,0.1) 0%, transparent 60%)"
        }}
      />
      <div 
        className="absolute top-0 right-0 w-[300px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(circle at top right, rgba(255,255,255,0.03) 0%, transparent 50%)"
        }}
      />

      {/* Layer 5: Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)"
        }}
      />

      {/* Ashoka Chakra Watermark */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none chakra-spin"
        style={{ opacity: 0.03 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#000080"
            strokeWidth="1"
          />
          {/* 24 spokes */}
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i * 15 * Math.PI) / 180
            const x1 = 50 + 20 * Math.cos(angle)
            const y1 = 50 + 20 * Math.sin(angle)
            const x2 = 50 + 40 * Math.cos(angle)
            const y2 = 50 + 40 * Math.sin(angle)
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#000080"
                strokeWidth="0.8"
              />
            )
          })}
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="#000080"
            strokeWidth="1"
          />
        </svg>
      </motion.div>
    </div>
  )
}
