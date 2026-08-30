import { useEffect, useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  LayoutList,
  SlidersHorizontal,
  Clapperboard,
  Images,
  GalleryHorizontal,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import { orderService } from '../services/orderService'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/adjust', label: 'Adjust', icon: LayoutList },
  { to: '/admin/showcase', label: 'Showcase', icon: SlidersHorizontal },
  { to: '/admin/videos', label: 'Videos', icon: Clapperboard },
  { to: '/admin/signature', label: 'Signature', icon: Images },
  { to: '/admin/gallery', label: 'Gallery', icon: GalleryHorizontal },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const [counts, setCounts] = useState({})

  useEffect(() => {
    orderService
      .getStats()
      .then((res) =>
        setCounts({
          orders: res.data.stats.orders,
          pending: res.data.stats.pending,
          products: res.data.stats.products,
        })
      )
      .catch(() => {})
  }, [])

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="brand">
          <span className="brand-logo">
            <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
              <ellipse cx="21" cy="30" rx="9" ry="6.5" stroke="currentColor" strokeWidth="4" />
              <ellipse cx="43" cy="30" rx="9" ry="6.5" stroke="currentColor" strokeWidth="4" />
              <path d="M28 28.5c2.5 1 5.5 1 8 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>
          <span>
            Admin
            <small>Welcom Optical</small>
          </span>
        </Link>

        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `admin-nav ${isActive ? 'active' : ''}`}
          >
            <item.icon />
            {item.label}
            {item.label === 'Orders' && counts.pending > 0 && (
              <span className="count">{counts.pending}</span>
            )}
          </NavLink>
        ))}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <NavLink to="/" className="admin-nav">
            <ExternalLink /> View store
          </NavLink>
          <button className="admin-nav" onClick={logout}>
            <LogOut /> Log out
          </button>
          <div style={{ padding: '10px 14px' }}>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <div>
            <p style={{ color: 'var(--text-2)', fontSize: 13 }}>Signed in as {user?.name}</p>
            <h1 style={{ fontSize: 26, marginTop: 2 }}>Admin panel</h1>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
