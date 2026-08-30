import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Printer } from 'lucide-react'
import { orderService } from '../services/orderService'
import Loading from '../components/Loading'
import { useToast } from '../components/Toast'
import { formatCurrency, formatDateTime } from '../utils/format'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function OrderDetails() {
  const { id } = useParams()
  const toast = useToast()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const load = () =>
    orderService
      .get(id)
      .then((res) => setOrder(res.data.order))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [id])

  const changeStatus = async (status) => {
    setUpdating(true)
    try {
      await orderService.updateStatus(id, status)
      toast(`Order marked as ${status}`)
      load()
    } catch (err) {
      toast(err?.response?.data?.message || 'Update failed')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <Loading />
  if (!order)
    return (
      <div className="empty-state">
        <h3>Order not found</h3>
        <Link to="/admin/orders" className="btn btn-outline" style={{ marginTop: 14 }}>
          Back to orders
        </Link>
      </div>
    )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <Link to="/admin/orders" style={{ color: 'var(--text-2)', fontSize: 13.5, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={15} /> Back to orders
          </Link>
          <h1 style={{ fontSize: 24, marginTop: 6 }}>{order.orderNumber}</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 13.5 }}>Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className={`status status-${order.status}`}>{order.status}</span>
          <button className="thin-btn" onClick={() => window.print()} title="Print order">
            <Printer size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }} className="order-detail-grid">
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 15, marginBottom: 14 }}>Update status</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {STATUSES.map((s) => (
              <button
                key={s}
                className={`btn ${order.status === s ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                onClick={() => changeStatus(s)}
                disabled={updating}
              >
                {s}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 16, color: 'var(--text-2)', fontSize: 13 }}>
            Payment: <b style={{ color: 'var(--text)' }}>{order.paymentMethod}</b> ·{' '}
            <span className={`status status-${order.paymentStatus === 'paid' ? 'delivered' : 'pending'}`} style={{ marginLeft: 4 }}>
              {order.paymentStatus}
            </span>
          </div>
          {order.notes && (
            <div style={{ marginTop: 14, background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, fontSize: 13.5, color: 'var(--text-2)' }}>
              <b style={{ color: 'var(--text)' }}>Notes: </b>
              {order.notes}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 15, marginBottom: 14 }}>Shipping to</h3>
          <div style={{ fontSize: 14, lineHeight: 1.8 }}>
            <b>{order.shippingAddress.name}</b>
            <br />
            {order.shippingAddress.email}
            <br />
            {order.shippingAddress.phone}
            <br />
            {order.shippingAddress.street}
            <br />
            {[order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.zip].filter(Boolean).join(', ')}
            <br />
            {order.shippingAddress.country}
          </div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Unit price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img src={item.image || '/images/product-placeholder.svg'} alt="" className="table-thumb" />
                    <span style={{ fontWeight: 500 }}>{item.name}</span>
                  </div>
                </td>
                <td>{formatCurrency(item.price)}</td>
                <td>{item.quantity}</td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} style={{ textAlign: 'right', color: 'var(--text-2)' }}>Subtotal</td>
              <td>{formatCurrency(order.subtotal)}</td>
            </tr>
            <tr>
              <td colSpan={3} style={{ textAlign: 'right', color: 'var(--text-2)' }}>Shipping</td>
              <td>{order.shipping === 0 ? 'Free' : formatCurrency(order.shipping)}</td>
            </tr>
            <tr>
              <td colSpan={3} style={{ textAlign: 'right', color: 'var(--text-2)' }}>Tax</td>
              <td>{formatCurrency(order.tax)}</td>
            </tr>
            <tr>
              <td colSpan={3} style={{ textAlign: 'right', fontWeight: 700 }}>Total</td>
              <td style={{ fontWeight: 700, color: 'var(--accent-text)', fontSize: 17 }}>{formatCurrency(order.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
