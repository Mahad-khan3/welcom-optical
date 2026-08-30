import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CreditCard, Lock, Banknote } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { orderService } from '../services/orderService'
import { getErrorMessage, formatCurrency } from '../utils/format'

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [step, setStep] = useState('shipping')
  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('')
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const shipCost = subtotal > 200 ? 0 : 15
  const tax = subtotal * 0.08
  const total = subtotal + shipCost + tax

  const onChange = (e) => setShipping({ ...shipping, [e.target.name]: e.target.value })

  const goToPayment = (e) => {
    e.preventDefault()
    if (!shipping.street.trim() || !shipping.city.trim() || !shipping.zip.trim()) {
      return setError('Please complete the shipping address fields')
    }
    setError('')
    setStep('payment')
  }

  const submit = async () => {
    setError('')
    if (paymentMethod === 'online') {
      if (!cardForm.number.trim() || !cardForm.expiry.trim() || !cardForm.cvv.trim() || !cardForm.name.trim()) {
        return setError('Please fill in all card details')
      }
    }
    setLoading(true)
    try {
      const { data } = await orderService.create({
        items,
        shippingAddress: shipping,
        paymentMethod: paymentMethod === 'online' ? 'card' : 'cash',
        notes,
      })
      clearCart()
      navigate(`/order-success/${data.order._id}`)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not place the order'))
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <div className="empty-state">
          <h1 style={{ fontFamily: 'var(--font-serif)', marginBottom: 10 }}>Your cart is empty</h1>
          <p>Add some frames before checking out.</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: 18 }}>
            Go to shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingBottom: 90 }}>
      <div className="page-hero">
        <p className="section-kicker">Almost there</p>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-layout">
        <div>
          {step === 'shipping' && (
            <form onSubmit={goToPayment}>
              <div className="checkout-step">
                <h2>
                  <span className="num">1</span> Shipping address
                </h2>
                <div className="grid-2">
                  <div className="field">
                    <label>Full name</label>
                    <input name="name" value={shipping.name} onChange={onChange} required />
                  </div>
                  <div className="field">
                    <label>Phone</label>
                    <input name="phone" value={shipping.phone} onChange={onChange} />
                  </div>
                </div>
                <div className="field">
                  <label>Email</label>
                  <input name="email" type="email" value={shipping.email} onChange={onChange} required />
                </div>
                <div className="field">
                  <label>Street address</label>
                  <input name="street" value={shipping.street} onChange={onChange} required placeholder="123 Main Street, Apt 4B" />
                </div>
                <div className="grid-3">
                  <div className="field">
                    <label>City</label>
                    <input name="city" value={shipping.city} onChange={onChange} required />
                  </div>
                  <div className="field">
                    <label>State / Province</label>
                    <input name="state" value={shipping.state} onChange={onChange} />
                  </div>
                  <div className="field">
                    <label>ZIP / Postal code</label>
                    <input name="zip" value={shipping.zip} onChange={onChange} required />
                  </div>
                </div>
                <div className="field">
                  <label>Country</label>
                  <input name="country" value={shipping.country} onChange={onChange} placeholder="United States" />
                </div>
              </div>

              <div className="checkout-step">
                <h2>
                  <span className="num">2</span> Order notes <span style={{ fontWeight: 400, fontSize: 13 }}>(optional)</span>
                </h2>
                <textarea
                  placeholder="Gift wrapping, prescription notes, delivery instructions…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {error && <div className="form-error">{error}</div>}

              <button type="submit" className="btn btn-primary btn-lg btn-block">
                Continue to payment <Lock size={17} />
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div>
              <div className="checkout-step">
                <h2>
                  <span className="num">2</span> Choose payment method
                </h2>
                <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
                  <button
                    className={`pay-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
                    style={{ flex: 1, flexDirection: 'column', gap: 10, padding: 28 }}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <Banknote size={28} />
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Cash on Delivery</span>
                    <span style={{ fontSize: 12.5, color: 'var(--text-2)' }}>Pay when you receive your order</span>
                  </button>
                  <button
                    className={`pay-option ${paymentMethod === 'online' ? 'selected' : ''}`}
                    style={{ flex: 1, flexDirection: 'column', gap: 10, padding: 28 }}
                    onClick={() => setPaymentMethod('online')}
                  >
                    <CreditCard size={28} />
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Pay Online</span>
                    <span style={{ fontSize: 12.5, color: 'var(--text-2)' }}>Credit / Debit card</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'online' && (
                <div className="checkout-step">
                  <h2>
                    <span className="num">3</span> Card details
                  </h2>
                  <div className="field">
                    <label>Card number</label>
                    <input placeholder="4242 4242 4242 4242" maxLength={19} value={cardForm.number} onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })} />
                  </div>
                  <div className="grid-3">
                    <div className="field">
                      <label>Expiry</label>
                      <input placeholder="MM/YY" maxLength={5} value={cardForm.expiry} onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })} />
                    </div>
                    <div className="field">
                      <label>CVV</label>
                      <input placeholder="123" maxLength={4} type="password" value={cardForm.cvv} onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })} />
                    </div>
                    <div className="field">
                      <label>Cardholder name</label>
                      <input placeholder="John Doe" value={cardForm.name} onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })} />
                    </div>
                  </div>
                </div>
              )}

              {error && <div className="form-error">{error}</div>}

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button className="btn btn-ghost btn-lg" onClick={() => { setStep('shipping'); setError('') }} style={{ flex: 1 }}>
                  Back
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ flex: 2 }}
                  disabled={loading || !paymentMethod}
                  onClick={submit}
                >
                  <Lock size={17} />
                  {loading ? 'Placing order…' : paymentMethod === 'cash' ? `Confirm Cash Order · ${formatCurrency(total)}` : `Pay Now · ${formatCurrency(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="card summary-card">
          <h3>Order summary</h3>
          {items.map((item) => (
            <div key={item.product} className="drawer-item" style={{ borderBottom: 'none', padding: '8px 0' }}>
              <img src={item.image || '/images/product-placeholder.svg'} alt={item.name} style={{ width: 52, height: 52 }} />
              <div className="info">
                <div className="name">{item.name}</div>
                <div className="meta">
                  <span style={{ color: 'var(--text-2)', fontSize: 13 }}>Qty {item.qty}</span>
                  <span style={{ fontWeight: 700, fontSize: 13.5 }}>{formatCurrency(item.price * item.qty)}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipCost === 0 ? 'Free' : formatCurrency(shipCost)}</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
