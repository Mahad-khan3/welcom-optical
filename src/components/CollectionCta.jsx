import { Link } from 'react-router-dom'

export default function CollectionCta() {
  return (
    <section className="cta-section">
      <div className="cta-inner">
        <div className="cta-left">
          <h2 className="cta-title">Find Your Signature Frame</h2>
          <h3 className="cta-sub">Explore the complete collection</h3>
          <p className="cta-text">
            From timeless classics to bold modern designs — browse premium
            frames, goggles and lenses crafted for every look.
          </p>
        </div>

        <Link to="/shop" className="cta-all" aria-label="All Collection">
          All Collection
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
