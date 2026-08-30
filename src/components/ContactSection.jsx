import { useEffect, useState } from 'react'
import { X, Send, Check, MessageCircle } from 'lucide-react'

export default function ContactSection() {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const toggle = () => {
    setSent(false)
    setOpen((o) => !o)
  }

  const close = () => setOpen(false)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setForm({ name: '', email: '', message: '' })
    }, 4000)
  }

  return (
    <section className="ct4">
      <div className={`ct4-inner ${open ? 'open' : ''}`}>
        {/* ---------- LEFT / TOP PANEL (cover) ---------- */}
        <button type="button" className="ct4-cover" onClick={toggle} aria-label="Toggle contact form">
          <span className="ct4-eyebrow">Contact Us</span>
          <h2 className="ct4-title">We&apos;d love to hear from you</h2>
          <p className="ct4-sub">Ask us anything — we reply within 24 hours.</p>
          <span className="ct4-hint">
            <MessageCircle size={14} />
            Tap anywhere to open
          </span>
        </button>

        {/* ---------- RIGHT PANEL peek (visible from below) ---------- */}
        <button type="button" className="ct4-peek" onClick={() => setOpen(true)}>
          <MessageCircle size={18} />
          <span>Get in Touch</span>
        </button>

        {/* ---------- FORM (slides open inside the section, right side) ---------- */}
        <aside className="ct4-form" role="dialog" aria-modal aria-label="Contact form">
          <div className="ct4-form-head">
            <div>
              <span className="ct4-form-eyebrow">Send a Message</span>
              <h3>How can we help?</h3>
            </div>
            <button type="button" className="ct4-close" onClick={close} aria-label="Close">
              <X size={20} />
            </button>
          </div>

          <form className="ct4-form-body" onSubmit={handleSubmit}>
            <div className="ct4-field">
              <label htmlFor="ct4-name">Full Name</label>
              <input
                id="ct4-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="ct4-field">
              <label htmlFor="ct4-email">Email</label>
              <input
                id="ct4-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="ct4-field">
              <label htmlFor="ct4-msg">Message</label>
              <textarea
                id="ct4-msg"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us a little more…"
                required
              />
            </div>

            <button type="submit" className="ct4-send">
              {sent ? (
                <>
                  <Check size={17} strokeWidth={2.5} />
                  Message Sent
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send size={15} />
                </>
              )}
            </button>

            <p className="ct4-note">We typically reply within one business day.</p>
          </form>
        </aside>
      </div>
    </section>
  )
}