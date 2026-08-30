import { Link } from 'react-router-dom'
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag, ShieldCheck, Truck, RotateCw } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, clearCart } = useCart()
  const shipping = items.length === 0 || subtotal > 200 ? 0 : 15
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="container" style={{ paddingBottom: 90 }}>
      <div className="page-hero">
        <p className="section-kicker">Your selection</p>
        <h1>Cart</h1>
      </div>

      {items.length === 0 ? (
        <div className="empty-state" style={{ padding: '60px 20px' }}>
          <ShoppingBag size={46} />
          <h3>Your cart is empty</h3>
          <p>Add a few premium frames and they’ll show up here.</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: 18 }}>
            Start shopping <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="hide-mobile">Unit</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.product}>
                    <td>
                      <div className="item-cell">
                        <Link to={`/product/${item.product}`}>
                          <img src={item.image || '/images/product-placeholder.svg'} alt={item.name} />
                        </Link>
                        <div>
                          <Link to={`/product/${item.product}`} className="name">
                            {item.name}
                          </Link>
                          <div className="unit">{item.price.toFixed(2)} each</div>
                        </div>
                      </div>
                    </td>
                    <td className="hide-mobile">{formatCurrency(item.price)}</td>
                    <td>
                      <div className="qty">
                        <button onClick={() => updateQty(item.product, item.qty - 1)} aria-label="Decrease">
                          <Minus size={14} />
                        </button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.product, item.qty + 1)} aria-label="Increase">
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(item.price * item.qty)}</td>
                    <td>
                      <button className="thin-btn danger" onClick={() => removeItem(item.product)} aria-label="Remove">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={clearCart}>
                Clear cart
              </button>
            </div>
          </div>

          <aside className="card summary-card">
            <h3>Order summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
            </div>
            <div className="summary-row">
              <span>Estimated tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary btn-lg btn-block" style={{ marginTop: 20 }}>
              Proceed to checkout <ArrowRight size={17} />
            </Link>
            <p style={{ fontSize: 13, color: 'var(--text-2)', textAlign: 'center', marginTop: 14 }}>
              Free shipping on orders over $200
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
              <div style={{ textAlign: 'center', color: 'var(--text-2)', fontSize: 12 }}>
                <ShieldCheck size={18} style={{ margin: '0 auto 4px' }} /> Secure checkout
              </div>
              <div style={{ textAlign: 'center', color: 'var(--text-2)', fontSize: 12 }}>
                <Truck size={18} style={{ margin: '0 auto 4px' }} /> Fast delivery
              </div>
              <div style={{ textAlign: 'center', color: 'var(--text-2)', fontSize: 12 }}>
                <RotateCw size={18} style={{ margin: '0 auto 4px' }} /> Easy returns
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
