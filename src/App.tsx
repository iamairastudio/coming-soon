import { useState, useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'

interface FogParticle {
  x: number
  y: number
  radiusX: number
  radiusY: number
  opacity: number
  speedX: number
  speedY: number
  phase: number
}

function FogCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<FogParticle[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      const w = canvas.width
      const h = canvas.height
      const particles: FogParticle[] = []

      for (let i = 0; i < 8; i++) {
        particles.push({
          x: Math.random() * w * 1.5 - w * 0.25,
          y: Math.random() * h * 0.55,
          radiusX: 150 + Math.random() * 400,
          radiusY: 40 + Math.random() * 120,
          opacity: 0.02 + Math.random() * 0.06,
          speedX: 0.05 + Math.random() * 0.15,
          speedY: -0.01 + Math.random() * 0.03,
          phase: Math.random() * Math.PI * 2,
        })
      }
      particlesRef.current = particles
    }

    resize()
    window.addEventListener('resize', resize)

    const animate = (time: number) => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      for (const p of particlesRef.current) {
        p.x += p.speedX
        p.y += p.speedY + Math.sin(time * 0.0003 + p.phase) * 0.02

        if (p.x - p.radiusX > w) p.x = -p.radiusX
        if (p.x + p.radiusX < 0) p.x = w + p.radiusX
        if (p.y > h * 0.65) p.y = -p.radiusY
        if (p.y < -p.radiusY) p.y = h * 0.65

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.filter = 'blur(60px)'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.beginPath()
        ctx.ellipse(p.x, p.y, p.radiusX, p.radiusY, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}

function Navigation() {
  const links = ['HOME', 'ABOUT', 'CONTACT']

  return (
    <nav className="absolute top-6 md:top-8 left-0 right-0 flex justify-center items-center gap-10 md:gap-16 z-10">
      {links.map((link) => (
        <a
          key={link}
          href="#"
          className="nav-link-glow"
        >
          {link}
        </a>
      ))}
    </nav>
  )
}

function FloatingBubble() {
  return (
    <div className="floating-bubble">
      COMING SOON
    </div>
  )
}

function EmailInput() {
  const [email, setEmail] = useState('')

  return (
    <div className="email-underline">
      <input
        type="email"
        placeholder="Enter email for early access"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="button"
        aria-label="Submit email"
      >
        <ArrowRight size={18} strokeWidth={1.5} />
      </button>
    </div>
  )
}

export default function App() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className={`relative w-full h-screen overflow-hidden ${mounted ? 'page-fade-in' : 'opacity-0'}`}
      style={{ background: '#0b0b0c' }}
    >
      {/* Background Image — dark sand with contrast */}
      <img
        src="/images/background.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ filter: 'contrast(1.1) brightness(0.45)', transform: 'scale(1.05)' }}
      />

      {/* Floating fog animation */}
      <FogCanvas />

      {/* Soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-10"
        style={{ zIndex: 3 }}
      >
        {/* Title */}
        <h1
          className="mb-1 opacity-95"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '52px',
            fontWeight: 300,
            letterSpacing: '2px',
            color: '#f2efe9',
          }}
        >
          The Look
        </h1>

        {/* Subtitle */}
        <p
          className="uppercase opacity-60 mb-[60px]"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            letterSpacing: '3px',
            color: '#f2efe9',
          }}
        >
          Modern Mystique
        </p>

        {/* Floating Glass Bubble */}
        <FloatingBubble />

        {/* Email Input */}
        <EmailInput />

        {/* Micro Text */}
        <p
          className="mt-3 opacity-40"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            letterSpacing: '1px',
            color: '#f2efe9',
          }}
        >
          Be first to enter the collection
        </p>
      </div>

      {/* Footer Brand */}
      <div
        className="absolute bottom-6 left-0 right-0 text-center lowercase opacity-25 pointer-events-none"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '10px',
          letterSpacing: '2px',
          color: '#f2efe9',
          zIndex: 3,
        }}
      >
        iamaira studio
      </div>
    </div>
  )
}
