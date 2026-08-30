import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const STEPS = [
  'Browse the Collection',
  'Try Frames in 3D',
  'Place Your Order',
  'Delivered to Your Door',
  'Perfect Fit Guaranteed',
]

export default function HowItWorks() {
  return (
    <section className="hw-section">
      <div className="hw-inner hw-grid">
        <div className="hw-left">
          <div className="hw-head">
            <span
              className="lux-eyebrow"
              style={{
                color: 'var(--text)',
                background: 'var(--bg)',
                display: 'inline-block',
                padding: '5px 12px',
                letterSpacing: 3,
                width: 'fit-content',
              }}
            >
              Simple Process
            </span>
            <h2 className="hw-title">How It Works</h2>
          </div>

          <Link to="/shop" className="hw-btn">
            <span>Get Started</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="hw-marquee">
          <div className="hw-track">
            {[...STEPS, ...STEPS].map((step, i) => (
              <div className="hw-item" key={`${step}-${i}`}>
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hw-inner">
        <span className="hw-bottom-line" />
      </div>
    </section>
  )
}
