import { useState, useEffect, useRef, useCallback, memo, lazy, Suspense } from 'react'
import { ArrowRight, Volume2, VolumeX } from 'lucide-react'

const ContactModal = lazy(() => import('./components/ContactModal'))

/* ── Glitch Text ── */
const GlitchText = memo(function GlitchText() {
  const target = 'ARCHETYPE \u2014 000'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const [text, setText] = useState(target)

  useEffect(() => {
    let iteration = 0
    const interval = setInterval(() => {
      const next = target
        .split('')
        .map((letter, index) => {
          if (letter === ' ' || letter === '\u2014') return letter
          if (index < iteration) return target[index]
          return chars[Math.floor(Math.random() * chars.length)]
        })
        .join('')

      setText(next)
      iteration += 1 / 3

      if (iteration >= target.length) {
        clearInterval(interval)
        setText(target)
      }
    }, 90)

    return () => clearInterval(interval)
  }, [])

  return (
    <p
      className="uppercase mb-[60px]"
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '14px',
        letterSpacing: '3px',
        color: 'rgba(255, 255, 255, 0.82)',
      }}
    >
      {text}
    </p>
  )
})

/* ── Brand Mark ── */
const BrandMark = memo(function BrandMark() {
  return (
    <img
      src="/images/logo-mark.png"
      alt=""
      className="absolute z-10"
      draggable={false}
      style={{
        top: '32px',
        left: '32px',
        width: '28px',
        height: 'auto',
        opacity: 0.9,
      }}
    />
  )
})

/* ── Navigation ── */
const Navigation = memo(function Navigation({ onOpenContact }: { onOpenContact: () => void }) {
  return (
    <nav className="absolute z-10" style={{ top: '32px', right: '32px' }}>
      <button
        onClick={onOpenContact}
        className="nav-link-glow"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        CONTACT
      </button>
    </nav>
  )
})

/* ── Floating Bubble ── */
const FloatingBubble = memo(function FloatingBubble() {
  return (
    <div className="floating-bubble">
      COMING SOON
    </div>
  )
})

/* ── Email Input ── */
const EmailInput = memo(function EmailInput() {
  const [email, setEmail] = useState('')

  return (
    <div className="email-underline">
      <input
        type="email"
        placeholder="Enter email for early access"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="button" aria-label="Submit email">
        <ArrowRight size={18} strokeWidth={1.5} />
      </button>
    </div>
  )
})

/* ── Wave Audio ── */
const WaveAudio = memo(function WaveAudio() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const interacted = useRef(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.08

    const handleInteraction = () => {
      if (interacted.current) return
      interacted.current = true
      audio.play().then(() => setPlaying(true)).catch(() => {})
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
      <audio ref={audioRef} src="/audio/waves.mp3" loop preload="metadata" />
      <button
        onClick={toggle}
        aria-label={playing ? 'Mute waves' : 'Play waves'}
        className="absolute bottom-6 right-6 z-20 opacity-30 hover:opacity-70 transition-opacity duration-300"
        style={{ color: 'rgba(255, 255, 255, 0.82)' }}
      >
        {playing ? <Volume2 size={16} strokeWidth={1} /> : <VolumeX size={16} strokeWidth={1} />}
      </button>
    </>
  )
})

/* ── Main App ── */
export default function App() {
  const [contactOpen, setContactOpen] = useState(false)
  const openContact = useCallback(() => setContactOpen(true), [])
  const closeContact = useCallback(() => setContactOpen(false), [])

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#0b0b0c' }}>
      {/* Background Image — loads instantly via CSS on body too */}
      <img
        src="/images/background.jpg"
        alt=""
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ filter: 'contrast(1.02) brightness(0.75)', transform: 'scale(1.02)' }}
      />

      {/* Brand mark — top-left watermark */}
      <BrandMark />

      {/* Navigation — CONTACT top-right */}
      <Navigation onOpenContact={openContact} />

      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10" style={{ zIndex: 3 }}>
        <GlitchText />
        <FloatingBubble />
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

      {/* Contact Modal — lazy loaded */}
      {contactOpen && (
        <Suspense fallback={null}>
          <ContactModal open={contactOpen} onClose={closeContact} />
        </Suspense>
      )}
    </div>
  )
}
