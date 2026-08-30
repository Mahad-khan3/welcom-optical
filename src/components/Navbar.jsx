import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShoppingBag, X, Sun, Moon } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Premium Glasses', to: '/premium-glasses' },
  { label: 'Sunglasses', to: '/sunglasses' },
  { label: 'Collections', to: '/collections' },
  { label: 'New Arrivals', to: '/shop?sort=newest' },
]

function LogoIcon() {
  return (
    <div className="nd-logo-box">
      <span className="nd-logo-dot" />
      <span>W</span>
    </div>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollPct, setScrollPct] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  const { count, setOpen: openCart } = useCart()
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY
      setScrolled(top > 20)
      const total = document.documentElement.scrollHeight - window.innerHeight
      setScrollPct(total > 0 ? Math.min(Math.round((top / total) * 100), 100) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeAll = () => { setMenuOpen(false) }

  return (
    <>
      <header className={`nd-header ${scrolled ? 'nd-scrolled' : ''}`}>
        <nav className="nd-inner">
          <Link to="/" className="nd-brand" onClick={closeAll}>
            <LogoIcon />
            <span className="nd-brand-text">Welcom Optical</span>
          </Link>

          <div className="nd-pill">
            <button
              className={`nd-pill-btn nd-hamburger ${menuOpen ? 'is-open' : ''}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="nd-ham-line nd-ham-l1" />
              <span className="nd-ham-line nd-ham-l2" />
              <span className="nd-ham-line nd-ham-l3" />
            </button>
            <span className="nd-pill-sep" />
            <button className="nd-pill-btn nd-theme-pill" onClick={toggle} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <span className="nd-pill-sep" />
            <span className="nd-pill-pct">
              <span className="nd-pct-bar" style={{ width: `${scrollPct}%` }} />
              <span className="nd-pct-text">{scrollPct}%</span>
            </span>
          </div>

          <div className="nd-right">
            <button className="nd-icon-btn nd-cart" onClick={() => openCart(true)} aria-label="Open cart">
              <ShoppingBag size={18} />
              {count > 0 && <span className="nd-cart-badge">{count}</span>}
            </button>
          </div>
        </nav>
      </header>

      <div className={`nd-overlay ${menuOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div className="nd-overlay-bar">
          <Link to="/" className="nd-brand" onClick={closeAll}>
            <LogoIcon />
            <span className="nd-brand-text">Welcom Optical</span>
          </Link>
          <button className="nd-overlay-x" onClick={closeAll} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <div className="nd-overlay-body">
          <div className="nd-overlay-nav">
            {NAV_LINKS.map((l, i) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `nd-overlay-link ${isActive ? 'active' : ''}`}
                onClick={closeAll}
                style={{ animationDelay: `${0.05 + i * 0.06}s` }}
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <span className="nd-overlay-line" />

          <div className="nd-overlay-actions">
            <button className="nd-overlay-theme-btn" onClick={toggle} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button className="nd-overlay-cart-btn" onClick={() => { openCart(true); closeAll() }} aria-label="Open cart">
              <ShoppingBag size={18} />
              <span>Cart</span>
              {count > 0 && <span className="nd-overlay-cart-badge">{count}</span>}
            </button>
          </div>

          <div className="nd-overlay-btns">
          </div>
        </div>
      </div>
    </>
  )
}
