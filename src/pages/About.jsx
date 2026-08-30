import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  HandHeart,
  Leaf,
  Ruler,
  Sparkles,
  Gem,
  Award,
  ShieldCheck,
  Truck,
} from 'lucide-react'

const VALUES = [
  { icon: HandHeart, title: 'Crafted by hand', text: 'Every frame is finished by master artisans with decades of optical experience.' },
  { icon: Eye, title: 'Optician-grade', text: 'Every pair is inspected against strict optical standards before dispatch.' },
  { icon: Gem, title: 'Premium materials', text: 'Hand-polished bio-acetate and recycled metals chosen for beauty and longevity.' },
  { icon: Ruler, title: 'Perfectly fitted', text: 'Detailed size guides and free adjustments at any partner store.' },
]

const CRAFT = [
  { icon: Gem, title: 'The frame', text: 'Each frame begins as raw acetate or metal, hand-selected for its depth of colour and finish, then shaped into a silhouette with personality.' },
  { icon: Award, title: 'The lenses', text: 'Premium lenses are cut, edged and aligned to your prescription with sub-millimetre precision — clarity you can feel the moment you put them on.' },
  { icon: ShieldCheck, title: 'The finish', text: 'Hinges are stress-tested, coatings are scratch-resistant, and every pair passes a final quality inspection before it reaches your hands.' },
  { icon: Truck, title: 'The delivery', text: 'Shipped in protective, premium packaging within 24 hours — followed by our 30-day return promise for total peace of mind.' },
]

const STATS = [
  { num: '2010', lbl: 'Founded' },
  { num: '120k+', lbl: 'Happy wearers' },
  { num: '4.9/5', lbl: 'Average rating' },
  { num: '30-day', lbl: 'Return promise' },
]

const MILESTONES = [
  { year: '2010', title: 'The first bench', text: 'Welcom Optical begins as a single workbench with one belief — eyewear should be precision, not compromise.' },
  { year: '2015', title: 'Going digital', text: 'We bring our frames online and introduce a 3D viewer so you can inspect every angle before you commit.' },
  { year: '2019', title: 'Premium line launches', text: 'Our signature premium collection debuts, pairing the finest acetates with optician-grade optics.' },
  { year: '2026', title: 'A community', text: 'More than 120,000 wearers strong, still hand-finished in small batches, still obsessed with the details.' },
]

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          io.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: 'translateY(28px)',
        transition: `opacity 0.8s var(--ease) ${delay}s, transform 0.8s var(--ease) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

export default function About() {
  return (
    <div className="container" style={{ paddingBottom: 90 }}>
      <div className="about-hero">
        <div className="about-orb o1" />
        <div className="about-orb o2" />
        <div className="about-orb o3" />
        <div className="about-gasmist" />
        <p className="section-kicker" style={{ position: 'relative', zIndex: 2 }}>The house of precision eyewear</p>
        <h1>We see the world<br />through better lenses.</h1>
        <p className="about-tagline">
          Since 2010 we’ve designed optical frames for people who notice the details —
          and let you inspect every single one in 3D before you commit.
        </p>
        <Link to="/premium-glasses" className="btn btn-primary btn-lg about-glow-btn">
          Explore the collection
        </Link>
      </div>

      <Reveal>
        <div className="about-corner">
          <p className="section-kicker">Our story</p>
          <h2>Eyewear is the first thing people see.<br />It should say everything about you.</h2>
          <p className="lead">
            We started Welcom Optical with a simple frustration: great frames were either
            mass-produced or unaffordable. So we built the house we wished existed — small-batch
            eyewear, obsessively finished, designed to be worn every single day.
          </p>
          <p className="lead" style={{ marginTop: 16 }}>
            From hand-polished acetate to optician-grade optics, every frame carries the same
            promise we made on day one: if you wouldn’t wear it, we won’t sell it.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="about-grid">
          {VALUES.map((v) => (
            <div className="about-card" key={v.title}>
              <div className="icon"><v.icon size={24} /></div>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="about-numbers">
          {STATS.map((s) => (
            <div className="about-stat" key={s.lbl}>
              <div className="num">{s.num}</div>
              <div className="lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="about-corner" style={{ marginTop: 64 }}>
          <p className="section-kicker">The craft</p>
          <h2>From bench to doorstep</h2>
          <p className="lead">Four steps stand between a raw block of material and a frame on your face.</p>
        </div>
        <div className="about-grid">
          {CRAFT.map((c, i) => (
            <div className="about-card" key={c.title}>
              <div className="icon"><c.icon size={24} /></div>
              <h3>{i + 1}. {c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="about-corner" style={{ marginTop: 64 }}>
          <p className="section-kicker">The journey</p>
          <h2>Milestones along the way</h2>
        </div>
        <div className="about-timeline">
          {MILESTONES.map((m) => (
            <div className="about-milestone" key={m.year}>
              <div className="year">{m.year}</div>
              <h4>{m.title}</h4>
              <p>{m.text}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="about-strip">
          <div className="about-orb o1" style={{ left: 'auto', right: '-100px', top: -80 }} />
          <div className="about-orb o2" style={{ left: -80 }} />
          <Sparkles size={34} style={{ margin: '0 auto 16px', display: 'block' }} />
          <h2>Where few are made. For the many who notice.</h2>
          <p>Join the Welcom circle for early access to new frames, private sales and 10% off your first order.</p>
          <Link to="/collections" className="btn btn-lg">Browse the collections</Link>
        </div>
      </Reveal>
    </div>
  )
}
