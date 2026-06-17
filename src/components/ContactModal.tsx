import { useState, useEffect, useCallback } from 'react'

export function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleClose = useCallback(() => {
    onClose()
    setTimeout(() => {
      setStatus('idle')
      setEmail('')
      setMessage('')
    }, 300)
  }, [onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) handleClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, handleClose])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
        method: 'POST',
        body: new FormData(e.target as HTMLFormElement),
        headers: { Accept: 'application/json' },
      })

      if (response.ok) {
        setStatus('sent')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center"
      style={{
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={handleClose}
    >
      <div
        className="relative w-[90%] max-w-[420px]"
        style={{
          background: 'rgba(20, 20, 20, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '2.5rem',
          animation: 'slideUp 0.4s ease',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute transition-colors duration-300"
          style={{
            top: '1.2rem',
            right: '1.2rem',
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '1.5rem',
            cursor: 'pointer',
            lineHeight: 1,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)')}
        >
          &times;
        </button>

        {status === 'sent' ? (
          <div className="text-center" style={{ padding: '2rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>&#10003;</div>
            <h3
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1.5rem',
                fontWeight: 300,
                letterSpacing: '0.05em',
                marginBottom: '0.5rem',
                color: 'rgba(255,255,255,0.82)',
              }}
            >
              Message Sent
            </h3>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              We'll get back to you
            </p>
          </div>
        ) : (
          <div>
            <h2
              className="text-center"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1.5rem',
                fontWeight: 300,
                letterSpacing: '0.05em',
                marginBottom: '0.5rem',
                color: 'rgba(255,255,255,0.82)',
              }}
            >
              Get in Touch
            </h2>
            <p
              className="text-center"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '2rem',
              }}
            >
              studio@iamaira.co
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.2rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '0.9rem 1rem',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.3s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Message
                </label>
                <textarea
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  required
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '0.9rem 1rem',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.3s',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  width: '100%',
                  padding: '1rem',
                  marginTop: '0.5rem',
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  opacity: status === 'sending' ? 0.6 : 1,
                  transition: 'all 0.3s',
                }}
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'error' && (
                <p
                  className="text-center"
                  style={{
                    color: '#ff6b6b',
                    fontSize: '0.85rem',
                    marginTop: '0.5rem',
                  }}
                >
                  Something went wrong. Try again.
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
