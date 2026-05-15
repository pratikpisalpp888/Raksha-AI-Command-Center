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
  const mouseRef = useRef({ x: 0, y: 0 })
    
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

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
      "rgba(255,107,0,0.3)",  // Saffron
      "rgba(41,121,255,0.2)"   // Blue
    ]
    
    particlesRef.current = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))

    let animationId: number

    const animate = () => {
      ctx.fillStyle = "#030810"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw Interactive Dot Grid
      const gridSize = 50
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const dx = x - mouseRef.current.x
          const dy = y - mouseRef.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const opacity = Math.max(0.02, 0.2 * (1 - dist / 300))
          
          ctx.beginPath()
          ctx.arc(x, y, 1, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 153, 51, ${opacity})`
          ctx.fill()
        }
      }

      // Update and draw neural particles
      const particles = particlesRef.current
      
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()

        // Neural connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(255,107,0,${0.05 * (1 - dist / 150)})`
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
