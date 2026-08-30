import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Package } from 'lucide-react'
import { orderService } from '../services/orderService'
import Loading from '../components/Loading'
import { formatCurrency, formatDate } from '../utils/format'

export default function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService
      .get(id)
      .then((res) => setOrder(res.data.order))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading full />

  return (
    <div className="container" style={{ padding: '80px 0' }}>
      <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }} className="fade-up">
        <CheckCircle2 size={64} style={{ color: 'var(--success)', margin: '0 auto 20px' }} />
        <h1 style={{ fontSize: 'clamp(30px, 4vw, 44px)', marginBottom: 12 }}>Thank you!</h1>
        <p style={{ color: 'var(--text-2)', fontSize: 16 }}>
          Your order has been placed successfully.           A confirmation email is on its way to{' '}
          <b style={{ color: 'var(--text)' }}>{order?.shippingAddress?.email}</b>.
        </p>

        {order && (
          <div className="card" style={{ padding: 26, marginTop: 32, textAlign: 'left' }}>
            <div className="order-head">
              <div>
                <span className="num">{order.orderNumber}</span>
                <div style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 2 }}>
                  Placed {formatDate(order.createdAt)}
                </div>
              </div>
              <span className={`status status-${order.status}`}>{order.status}</span>
            </div>

            {order.items.map((item, i) => (
              <div className="order-items-row" key={i} style={{ marginBottom: 10 }}>
                <img src={item.image || '/images/product-placeholder.svg'} alt={item.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                  <div style={{ color: 'var(--text-2)', fontSize: 13 }}>
                    Qty {item.quantity} · {formatCurrency(item.price)}
                  </div>
                </div>
                <b>{formatCurrency(item.price * item.quantity)}</b>
              </div>
            ))}

            <div className="order-meta">
              <span>Total paid</span>
              <span className="total">{formatCurrency(order.total)}</span>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <Link to="/shop" className="btn btn-primary btn-block">
                Continue shopping
              </Link>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginTop: 28, color: 'var(--text-2)', fontSize: 14 }}>
          <Package size={16} />
          Estimated delivery: 3–5 business days
        </div>
      </div>
    </div>
  )
}
