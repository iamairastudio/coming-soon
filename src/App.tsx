import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Volume2, VolumeX } from 'lucide-react'

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

      for (let i = 0; i < 0; i++) {
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
  return (
    <nav className="absolute top-6 md:top-8 left-0 right-0 flex justify-center items-center z-10">
      <a href="#" className="nav-link-glow">CONTACT</a>
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

function WaveAudio() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.08

    const tryPlay = () => {
      audio.play().then(() => {
        setPlaying(true)
      }).catch(() => {
        // Browser blocked autoplay — wait for user interaction
        setPlaying(false)
      })
    }

    tryPlay()

    const handleInteraction = () => {
      if (audio.paused) {
        audio.play().then(() => setPlaying(true)).catch(() => {})
      }
      document.removeEventListener('click', handleInteraction)
    }

    document.addEventListener('click', handleInteraction)
    return () => document.removeEventListener('click', handleInteraction)
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/waves.mp3" loop preload="auto" />
      <button
        onClick={toggle}
        aria-label={playing ? 'Mute waves' : 'Play waves'}
        className="absolute bottom-6 right-6 z-20 opacity-30 hover:opacity-70 transition-opacity duration-300"
        style={{ color: '#f2efe9' }}
      >
        {playing ? <Volume2 size={16} strokeWidth={1} /> : <VolumeX size={16} strokeWidth={1} />}
      </button>
    </>
  )
}

export default function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#0b0b0c' }}>
      {/* Background Image — dark sand with contrast */}
      <img
        src="/images/background.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ filter: 'contrast(1.02) brightness(0.75)', transform: 'scale(1.02)' }}
      />

      {/* Floating fog animation */}
      <FogCanvas />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-10"
        style={{ zIndex: 3 }}
      >
        {/* Subtitle */}
        <p
          className="uppercase opacity-60 mb-[60px]"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            letterSpacing: '3px',
            color: 'rgba(255, 255, 255, 0.82)',
          }}
        >
          ARCHETYPE — 000 : THE BIRTH
        </p>

        {/* Floating Glass Bubble */}
        <FloatingBubble />

        {/* Email Input */}
        <EmailInput />


      </div>

      {/* Footer Brand */}
      <div
        className="absolute bottom-6 left-0 right-0 text-center lowercase opacity-25 pointer-events-none"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '10px',
          letterSpacing: '2px',
          color: 'rgba(255, 255, 255, 0.82)',
          zIndex: 3,
        }}
      >
        iamaira studio
      </div>

      {/* Ambient wave sounds */}
      <WaveAudio />
    </div>
  )
}
