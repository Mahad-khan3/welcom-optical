import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { signatureDuoService } from '../services/signatureDuoService'

const DEFAULTS = [
  {
    image: '',
    heading: 'Clear Vision, Quiet Luxury',
    text: 'Lightweight acetate frames with precision lenses — designed for all-day comfort and a look that never tries too hard.',
    link: '/shop',
  },
  {
    image: '',
    heading: 'Bold Shades For Bright Days',
    text: 'UV400 protected lenses in sharp modern silhouettes — sun protection that looks as good as it feels.',
    link: '/collections',
  },
]

function RoundFrames() {
  return (
    <svg viewBox="0 0 420 260" fill="none" className="sg-art" aria-hidden="true">
      <ellipse cx="140" cy="130" rx="86" ry="62" stroke="var(--text)" strokeWidth="6" />
      <ellipse cx="280" cy="130" rx="86" ry="62" stroke="var(--text)" strokeWidth="6" />
      <path d="M210 118c8 7 22 7 30 0" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
      <path d="M54 122L18 104M366 122l36-18" stroke="var(--text)" strokeWidth="6" strokeLinecap="round" />
      <path d="M54 148c-16 10-24 26-22 44M366 148c16 10 24 26 22 44" stroke="var(--text)" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
    </svg>
  )
}

function SquareSunnies() {
  return (
    <svg viewBox="0 0 460 250" fill="none" className="sg-art" aria-hidden="true">
      <path
        d="M40 92c60-14 320-14 380 0l-14 74c-4 20-20 34-42 34h-84c-20 0-36-12-42-30l-8-24h-2l-8 24c-6 18-22 30-42 30H96c-22 0-38-14-42-34L40 92z"
        stroke="var(--text)"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="M150 108h160" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
      <path d="M40 96L14 78M420 96l26-18" stroke="var(--text)" strokeWidth="6" strokeLinecap="round" />
      <circle cx="120" cy="150" r="5" fill="var(--accent)" opacity="0.9" />
      <circle cx="340" cy="150" r="5" fill="var(--accent)" opacity="0.9" />
    </svg>
  )
}

function Panel({ data, index }) {
  const d = { ...DEFAULTS[index], ...data }
  return (
    <div className={`sg-panel ${index === 1 ? 'sg-reverse' : ''}`}>
      <div className="sg-media">
        {d.image ? (
          <img src={d.image} alt={d.heading || 'Product'} className="sg-art sg-photo" />
        ) : index === 0 ? (
          <RoundFrames />
        ) : (
          <SquareSunnies />
        )}
      </div>
      <div className="sg-body">
        <h2>{d.heading}</h2>
        <p>{d.text}</p>
        <Link to={d.link || '/shop'} className="btn btn-primary sg-btn">
          Shop Now
        </Link>
      </div>
    </div>
  )
}

export default function SignatureDuo() {
  const [panels, setPanels] = useState(null)

  useEffect(() => {
    let alive = true
    signatureDuoService
      .getActive()
      .then((res) => {
        if (alive) setPanels(res.data.signature?.panels || [])
      })
      .catch(() => alive && setPanels([]))
    return () => {
      alive = false
    }
  }, [])

  if (!panels) return null

  return (
    <section className="sg-section">
      <Panel data={panels[0]} index={0} />
      <Panel data={panels[1]} index={1} />
    </section>
  )
}
