import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Clock,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react'
import { orderService } from '../services/orderService'
import Loading from '../components/Loading'
import { formatCurrency, formatDateTime } from '../utils/format'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService
      .getStats()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />
  if (!data) return <div className="empty-state"><h3>Could not load statistics</h3></div>

  const { stats, recentOrders } = data
  const maxRevenue = Math.max(...stats.monthlyRevenue.map((m) => m.revenue), 1)
  const statusOrder = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div>
      <div className="stat-cards">
        <div className="stat-card">
          <div className="icon"><DollarSign size={19} /></div>
          <div className="label">Total revenue</div>
          <div className="value">{formatCurrency(stats.revenue)}</div>
          <div className="delta">{stats.paidOrders} paid orders</div>
        </div>
        <div className="stat-card">
          <div className="icon"><ShoppingCart size={19} /></div>
          <div className="label">Orders</div>
          <div className="value">{stats.orders}</div>
          <div className="delta">{stats.pending} pending now</div>
        </div>
        <div className="stat-card">
          <div className="icon"><Users size={19} /></div>
          <div className="label">Customers</div>
          <div className="value">{stats.customers}</div>
          <div className="delta">Registered accounts</div>
        </div>
        <div className="stat-card">
          <div className="icon"><Package size={19} /></div>
          <div className="label">Products</div>
          <div className="value">{stats.products}</div>
          <div className="delta">
            {stats.lowStock > 0 && (
              <span style={{ color: 'var(--warning)' }}>
                <AlertTriangle size={12} style={{ display: 'inline', verticalAlign: '-1px' }} /> {stats.lowStock} low stock
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 22, marginBottom: 26 }} className="dash-grid">
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 16, marginBottom: 8 }}>
            Revenue — last 6 months
          </h3>
          <div className="bar-chart">
            {stats.monthlyRevenue.map((m) => (
              <div className="col" key={m.month}>
                <span className="val">{m.revenue > 0 ? `$${Math.round(m.revenue / 1000)}k` : ''}</span>
                <div className="bar" style={{ height: `${Math.max((m.revenue / maxRevenue) * 100, 3)}%` }} />
                <span className="lbl">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 16, marginBottom: 16 }}>
            Orders by status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {statusOrder.map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className={`status status-${s}`} style={{ width: 120 }}>
                  {s}
                </span>
                <div style={{ flex: 1, height: 8, borderRadius: 6, background: 'var(--card-2)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(stats.statusCounts[s] || 0) / Math.max(stats.orders, 1) * 100}%`,
                      height: '100%',
                      background: 'var(--accent)',
                      borderRadius: 6,
                    }}
                  />
                </div>
                <b style={{ minWidth: 24, textAlign: 'right', fontSize: 14 }}>{stats.statusCounts[s] || 0}</b>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, color: 'var(--text-2)', fontSize: 13.5 }}>
            <Clock size={15} /> Low stock items flagged for restock
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 16 }}>
            Recent orders
          </h3>
          <Link to="/admin/orders" className="btn btn-ghost btn-sm">
            View all orders
          </Link>
        </div>
        <div className="admin-table-wrap" style={{ border: 'none' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o._id}>
                  <td>
                    <Link to={`/admin/orders/${o._id}`} style={{ fontWeight: 700 }}>
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td>{o.user?.name || '—'}</td>
                  <td>{formatDateTime(o.createdAt)}</td>
                  <td>
                    <span className={`status status-${o.status}`}>{o.status}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{formatCurrency(o.total)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ color: 'var(--text-2)', textAlign: 'center', padding: 30 }}>
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {stats.topProducts.length > 0 && (
        <div className="card" style={{ padding: 24, marginTop: 22 }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={17} /> Top selling products
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {stats.topProducts.map((p) => (
              <div key={p._id} style={{ background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{p._id}</div>
                <div style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 4 }}>
                  {p.sold} sold · {formatCurrency(p.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
