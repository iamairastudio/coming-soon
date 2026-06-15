import { useState, useEffect, useRef } from 'react'
import { Instagram, ArrowRight } from 'lucide-react'

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

      // Create ~8 soft fog blobs concentrated in upper 60% of viewport
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

        // Wrap horizontally
        if (p.x - p.radiusX > w) p.x = -p.radiusX
        if (p.x + p.radiusX < 0) p.x = w + p.radiusX

        // Wrap vertically (stay in upper region)
        if (p.y > h * 0.65) p.y = -p.radiusY
        if (p.y < -p.radiusY) p.y = h * 0.65

        // Draw soft fog blob
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

function ComingSoonPill() {
  return (
    <div className="liquid-glass-pill">
      {/* Inner liquid highlight — glossy top refraction */}
      <div className="liquid-glass-highlight" />
      {/* Sparkle dots */}
      <div className="liquid-glass-sparkles" />
      <span className="relative z-10 text-[13px] md:text-[15px] tracking-[0.5em] text-white/90 font-normal uppercase" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        COMING SOON
      </span>
    </div>
  )
}

function EmailInput() {
  const [email, setEmail] = useState('')

  return (
    <div className="w-[85vw] max-w-[320px]">
      <div className="relative flex items-center h-[44px] rounded-full bg-black/[0.35] border border-white/[0.15] px-5 focus-within:border-white/30 transition-colors duration-300">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-transparent text-white text-[12px] md:text-[13px] tracking-wide placeholder:text-white/40 outline-none"
        />
        <button
          type="button"
          className="ml-2 text-white/70 hover:text-white transition-all duration-200 group"
          aria-label="Submit email"
        >
          <ArrowRight
            size={18}
            strokeWidth={1.5}
            className="group-hover:translate-x-0.5 transition-transform duration-200"
          />
        </button>
      </div>
    </div>
  )
}

function SocialLinks() {
  return (
    <div className="mt-10 flex items-center justify-center">
      <a
        href="#"
        aria-label="Instagram"
        className="ig-icon-glow"
      >
        <Instagram size={20} strokeWidth={1.5} />
      </a>
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
    >
      {/* Background Image */}
      <img
        src="/images/background.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Floating fog animation */}
      <FogCanvas />

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/10" style={{ zIndex: 2 }} />

      {/* Navigation */}
      <Navigation />

      {/* Content Layer */}
      <div className="absolute inset-0" style={{ zIndex: 3 }}>
        {/* Sky group — Coming Soon + Stay Updated in the sky */}
        <div className="absolute top-[32vh] left-0 right-0 flex flex-col items-center px-4">
          {/* Coming Soon Pill */}
          <ComingSoonPill />

          {/* Stay Updated */}
          <p className="mt-5 text-[10px] md:text-[11px] tracking-[0.2em] text-[#3a3a3a] uppercase font-normal">
            STAY UPDATED
          </p>
        </div>

        {/* Sand group — Email + Instagram on the black sand */}
        <div className="absolute bottom-[4vh] md:bottom-[6vh] left-0 right-0 flex flex-col items-center px-4">
          {/* Email Input */}
          <EmailInput />

          {/* Social Links */}
          <SocialLinks />
        </div>
      </div>
    </div>
  )
}
