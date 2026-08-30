import { Link, useNavigate } from 'react-router-dom'
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'

export default function CartDrawer() {
  const { open, setOpen, items, updateQty, removeItem, subtotal, count } = useCart()
  const navigate = useNavigate()

  return (
    <>
      <div className={`drawer-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-label="Shopping cart">
        <div className="drawer-header">
          <h3>
            Your Cart <span style={{ color: 'var(--text-2)', fontWeight: 400 }}>({count})</span>
          </h3>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close cart">
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="empty-state" style={{ flex: 1 }}>
            <ShoppingBag size={46} />
            <h3>Your cart is empty</h3>
            <p>Discover premium frames you can view in 3D.</p>
            <Link
              to="/shop"
              className="btn btn-outline"
              style={{ marginTop: 18 }}
              onClick={() => setOpen(false)}
            >
              Browse the shop <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {items.map((item) => (
                <div className="drawer-item" key={item.product}>
                  <Link to={`/product/${item.product}`} onClick={() => setOpen(false)}>
                    <img src={item.image || '/images/product-placeholder.svg'} alt={item.name} />
                  </Link>
                  <div className="info">
                    <Link
                      to={`/product/${item.product}`}
                      className="name"
                      onClick={() => setOpen(false)}
                    >
                      {item.name}
                    </Link>
                    <div className="meta">
                      <div className="qty">
                        <button onClick={() => updateQty(item.product, item.qty - 1)} aria-label="Decrease">
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.product, item.qty + 1)} aria-label="Increase">
                          +
                        </button>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>
                        {formatCurrency(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                  <button
                    className="thin-btn danger"
                    onClick={() => removeItem(item.product)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div className="drawer-footer">
              <div className="drawer-total">
                <span style={{ color: 'var(--text-2)' }}>Subtotal</span>
                <b>{formatCurrency(subtotal)}</b>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Link
                  to="/cart"
                  className="btn btn-ghost"
                  style={{ flex: 1 }}
                  onClick={() => setOpen(false)}
                >
                  View cart
                </Link>
                <Link
                  to="/checkout"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setOpen(false)
                    navigate('/checkout')
                  }}
                >
                  Checkout <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
