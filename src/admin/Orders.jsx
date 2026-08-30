import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { orderService } from '../services/orderService'
import Loading from '../components/Loading'
import { formatCurrency, formatDateTime } from '../utils/format'

const STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('all')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    orderService
      .getAll({ status, q: q || undefined, page, limit: 20 })
      .then((res) => {
        setOrders(res.data.orders)
        setPages(res.data.pages)
        setTotal(res.data.total)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [status, q, page])

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Orders</h1>
      <p style={{ color: 'var(--text-2)', fontSize: 13.5, marginBottom: 20 }}>{total} orders</p>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
        <div className="search-box" style={{ flex: 1, minWidth: 240, maxWidth: 340 }}>
          <Search size={16} />
          <input
            placeholder="Search order #, name or email…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1) }}
          />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} style={{ width: 'auto' }} aria-label="Filter by status">
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All statuses' : s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>
                    <Link to={`/admin/orders/${o._id}`} style={{ fontWeight: 700 }}>
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{o.shippingAddress?.name || o.user?.name}</div>
                    <div style={{ color: 'var(--text-2)', fontSize: 12 }}>{o.shippingAddress?.email || o.user?.email}</div>
                  </td>
                  <td>{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: 13 }}>{formatDateTime(o.createdAt)}</td>
                  <td>
                    <span className={`status status-${o.status}`}>{o.status}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{formatCurrency(o.total)}</td>
                  <td>
                    <Link to={`/admin/orders/${o._id}`} className="btn btn-ghost btn-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-2)', padding: 36 }}>
                    No orders match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="pagination">
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
