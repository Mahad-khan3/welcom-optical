import { useEffect, useState, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Check, Minus, Plus, ShoppingBag, Box, Zap, CreditCard, Banknote, X, RotateCcw, ChevronDown } from 'lucide-react'
import { productService } from '../services/productService'
import { orderService } from '../services/orderService'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'
import ProductViewer from '../components/ProductViewer'
import ProductGrid from '../components/ProductGrid'
import Loading from '../components/Loading'
import ProductVideoStrip from '../components/ProductVideoStrip'
import bannerDesktop1 from '../assets/images/Clearlyvision.png'
import bannerMobile from '../assets/images/Clearlyvision mobile.png'
import { formatCurrency, getErrorMessage } from '../utils/format'

function SpinViewer({ images, name }) {
  const [idx, setIdx] = useState(0)
  const dragRef = useRef({ dragging: false, startX: 0, startIdx: 0 })

  const onDown = (e) => {
    dragRef.current = { dragging: true, startX: e.clientX, startIdx: idx }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const onMove = (e) => {
    if (!dragRef.current.dragging) return
    const dx = e.clientX - dragRef.current.startX
    const steps = Math.round(dx / 45)
    let i = (dragRef.current.startIdx - steps) % images.length
    if (i < 0) i += images.length
    setIdx(i)
  }

  const onUp = () => {
    dragRef.current.dragging = false
  }

  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '4 / 3',
        overflow: 'hidden',
        position: 'relative',
        touchAction: 'pan-y',
      }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
    >
      <img
        src={images[idx]}
        alt={`${name} 360 view ${idx + 1}`}
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'grab', userSelect: 'none' }}
      />
      <span
        style={{
          position: 'absolute',
          bottom: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '6px 14px',
          borderRadius: 999,
          background: 'var(--glass)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border)',
          fontSize: 11.5,
          color: 'var(--text-2)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        ⟲ Drag to rotate · 360°
      </span>
    </div>
  )
}

function ProductImageGallery({ images, name, modelUrl, frameColor, onFrameColor }) {
  const [active, setActive] = useState(0)
  const [show3D, setShow3D] = useState(false)
  const [showSpin, setShowSpin] = useState(false)

  if (show3D && modelUrl) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <ProductViewer modelUrl={modelUrl} frameColor={frameColor} onFrameColor={onFrameColor} />
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setShow3D(false)}
          style={{ margin: '12px auto 0' }}
        >
          ← Back to images
        </button>
      </div>
    )
  }

  if (showSpin && images.length > 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SpinViewer images={images} name={name} />
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setShowSpin(false)}
          style={{ margin: '0 auto' }}
        >
          ← Back to images
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'stretch', height: '100%', minHeight: 0 }}>
      {images.length > 1 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            maxHeight: '100%',
            overflowY: 'auto',
            paddingRight: 2,
            flexShrink: 0,
          }}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${name} thumb ${i + 1}`}
              onClick={() => setActive(i)}
              draggable={false}
              style={{
                width: 68,
                height: 88,
                objectFit: 'cover',
                cursor: 'pointer',
                opacity: active === i ? 1 : 0.5,
                transition: 'opacity 0.25s ease',
                userSelect: 'none',
              }}
            />
          ))}
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0, alignSelf: 'stretch' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {images[active] ? (
            <img
              src={images[active]}
              alt={`${name} ${active + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}
          {modelUrl ? (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShow3D(true)}
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                background: 'var(--glass)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border)',
              }}
            >
              <Box size={14} /> View in 3D
            </button>
          ) : images.length > 1 ? (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowSpin(true)}
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                background: 'var(--glass)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border)',
              }}
            >
              <RotateCcw size={14} /> 360° View
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [frameColor, setFrameColor] = useState('#1a1a1a')
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('details')
  const [descOpen, setDescOpen] = useState(true)
  const { addItem } = useCart()
  const toast = useToast()

  const [buyModal, setBuyModal] = useState(false)
  const [payMethod, setPayMethod] = useState('')
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState('')
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [shippingForm, setShippingForm] = useState({
    name: '', email: '', phone: '', street: '', city: '', state: '', zip: '', country: '',
  })

  const shipCost = (product?.price || 0) * qty > 200 ? 0 : 15
  const itemTotal = (product?.price || 0) * qty
  const tax = itemTotal * 0.08
  const grandTotal = itemTotal + shipCost + tax

  const handleBuyNow = () => {
    setPayMethod('')
    setPayError('')
    setCardForm({ number: '', expiry: '', cvv: '', name: '' })
    setShippingForm({
      name: '', email: '', phone: '',
      street: '', city: '',
      state: '', zip: '', country: '',
    })
    setBuyModal(true)
  }

  const confirmCashOrder = async () => {
    if (!shippingForm.street.trim() || !shippingForm.city.trim() || !shippingForm.zip.trim()) {
      setPayError('Please complete the shipping address')
      return
    }
    setPayLoading(true)
    setPayError('')
    try {
      const { data } = await orderService.create({
        items: [{ product: product._id, quantity: qty }],
        shippingAddress: shippingForm,
        paymentMethod: 'cash',
        notes: 'Cash on delivery - Buy Now',
      })
      setBuyModal(false)
      toast('Order placed successfully!')
      navigate(`/order-success/${data.order._id}`)
    } catch (err) {
      setPayError(getErrorMessage(err, 'Could not place order'))
    } finally {
      setPayLoading(false)
    }
  }

  const confirmOnlineOrder = async () => {
    if (!shippingForm.street.trim() || !shippingForm.city.trim() || !shippingForm.zip.trim()) {
      setPayError('Please complete the shipping address')
      return
    }
    if (!cardForm.number.trim() || !cardForm.expiry.trim() || !cardForm.cvv.trim() || !cardForm.name.trim()) {
      setPayError('Please fill in all card details')
      return
    }
    setPayLoading(true)
    setPayError('')
    try {
      const { data } = await orderService.create({
        items: [{ product: product._id, quantity: qty }],
        shippingAddress: shippingForm,
        paymentMethod: 'card',
        notes: 'Online payment - Buy Now',
      })
      setBuyModal(false)
      toast('Payment successful! Order placed.')
      navigate(`/order-success/${data.order._id}`)
    } catch (err) {
      setPayError(getErrorMessage(err, 'Could not process payment'))
    } finally {
      setPayLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    window.scrollTo({ top: 0 })
    productService
      .get(id)
      .then((res) => {
        setProduct(res.data.product)
        setQty(1)
        setTab('details')
        setDescOpen(true)
        return productService.getAll({ category: res.data.product.category?.slug || '', limit: 4 })
      })
      .then((rel) => setRelated(rel.data.products.filter((p) => p._id !== id)))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading full />
  if (!product)
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h1>Product not found</h1>
        <p style={{ color: 'var(--text-2)', margin: '16px 0 24px' }}>
          This frame may have sold out or been removed.
        </p>
        <Link to="/shop" className="btn btn-primary">
          Back to shop
        </Link>
      </div>
    )

  const outOfStock = product.stock <= 0
  const modelUrl = product.model || ''

  return (
    <>
      <section className="shop-banner">
        <picture>
          <source media="(max-width: 767px)" srcSet={bannerMobile} />
          <img src={bannerDesktop1} alt="Welcom Optical banner" loading="lazy" />
        </picture>
      </section>

      <div className="container" style={{ paddingBottom: 90 }}>
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <Link to="/shop">Shop</Link>
        {product.category && (
          <>
            <span className="sep">/</span>
            <Link to={`/shop?category=${product.category.slug}`}>{product.category.name}</Link>
          </>
        )}
        <span className="sep">/</span>
        <span>{product.name}</span>
      </div>

      <div className="pd-grid" style={{ marginTop: 28 }}>
        <div className="pd-viewer">
          {product.images && product.images.length > 0 ? (
            <ProductImageGallery images={product.images} name={product.name} modelUrl={modelUrl} frameColor={frameColor} onFrameColor={setFrameColor} />
          ) : modelUrl ? (
            <ProductViewer modelUrl={modelUrl} frameColor={frameColor} onFrameColor={setFrameColor} />
          ) : (
            <div
              style={{
                width: '100%',
                aspectRatio: '4 / 3',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Box size={48} style={{ color: 'var(--text-2)' }} />
            </div>
          )}
        </div>

        <div className="pd-info">
          <h1 className="pd-title">{product.name}</h1>

          <div className="pd-rating">
            <span className="stars">★★★★★</span>
            <span>(220 reviews)</span>
          </div>

          <div className="pd-price-row">
            <span className="pd-price">{formatCurrency(product.price)}</span>
            {product.compareAtPrice > product.price && (
              <>
                <span className="pd-price compare">{formatCurrency(product.compareAtPrice)}</span>
                <span className="pd-save-badge">
                  Save {formatCurrency(product.compareAtPrice - product.price)}
                </span>
              </>
            )}
          </div>

          <div className="pd-line" />

          <button
            type="button"
            className={`pd-desc-head ${descOpen ? 'open' : ''}`}
            onClick={() => setDescOpen(!descOpen)}
          >
            <span>Description</span>
            <ChevronDown size={18} />
          </button>
          <div className={`pd-desc-body ${descOpen ? 'open' : ''}`}>
            <div className="pd-desc-inner">
              <p>{product.description || 'No description provided yet.'}</p>
            </div>
          </div>

          <div className="pd-actions">
            <div className="pd-actions-row">
              <div className="qty" style={{ padding: '6px 10px' }}>
                <button onClick={() => setQty((v) => Math.max(1, v - 1))} aria-label="Decrease quantity">
                  <Minus size={15} />
                </button>
                <span style={{ minWidth: 34, fontSize: 16 }}>{qty}</span>
                <button onClick={() => setQty((v) => Math.min(99, v + 1))} aria-label="Increase quantity">
                  <Plus size={15} />
                </button>
              </div>

              <button
                className="pd-btn-cart"
                disabled={outOfStock}
                onClick={() => {
                  addItem(product, qty)
                  toast(`${product.name} added to cart`)
                }}
              >
                <ShoppingBag size={17} />
                {outOfStock ? 'Out of stock' : 'Add to Cart'}
              </button>
            </div>

            <button className="pd-btn-buy" disabled={outOfStock} onClick={handleBuyNow}>
              <Zap size={18} />
              {outOfStock ? 'Out of stock' : 'Buy Now'}
            </button>

            <ProductVideoStrip />
          </div>

          <p className={`stock-note ${outOfStock ? 'out' : 'in'}`}>
            {outOfStock ? (
              <>
                <Box size={15} /> Currently out of stock — check back soon.
              </>
            ) : (
              <>
                <Check size={15} /> In stock · ships in 24h
              </>
            )}
          </p>

          {product.model && (
            <p className="stock-note in" style={{ marginTop: 18 }}>
              <Box size={15} /> This product includes a custom 3D model.
            </p>
          )}

          <div className="pd-tabs">
            <div className="tab-list">
              {['details', 'specs'].map((t) => (
                <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                  {t === 'details' ? 'Details' : 'Specifications'}
                </button>
              ))}
            </div>
            <div className="tab-panel">
              {tab === 'details' && (
                <p>{product.details || 'Additional details coming soon. Contact us for more information.'}</p>
              )}
              {tab === 'specs' && (
                <div className="spec-list">
                  <div>
                    <b>Price</b>
                    {formatCurrency(product.price)}
                  </div>
                  <div>
                    <b>Category</b>
                    {product.category?.name || 'Eyewear'}
                  </div>
                  <div>
                    <b>Frame finish</b>
                    {product.frameColor || 'Standard'}
                  </div>
                  <div>
                    <b>Material</b>
                    {product.material || 'Acetate'}
                  </div>
                  <div>
                    <b>Lens</b>
                    {product.lensColor || 'Clear / UV protected'}
                  </div>
                  <div>
                    <b>Dimensions</b>
                    {product.dimensions || 'Standard'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section" style={{ padding: '70px 0 0' }}>
          <div className="section-head">
            <div>
              <p className="section-kicker">Complete the look</p>
              <h2 className="section-title">You may also like</h2>
            </div>
          </div>
          <ProductGrid products={related} />
        </section>
      )}

      {buyModal && (
        <div className="modal-overlay open" onClick={() => setBuyModal(false)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Complete your purchase</h3>
              <button className="thin-btn" onClick={() => setBuyModal(false)}><X size={16} /></button>
            </div>

            {!payMethod && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ color: 'var(--text-2)', fontSize: 14.5, marginBottom: 4 }}>
                  Choose payment method for <b style={{ color: 'var(--text)' }}>{product.name}</b> × {qty}
                </p>
                <div style={{ display: 'flex', gap: 14 }}>
                  <button
                    className="pay-option"
                    style={{ flex: 1, flexDirection: 'column', gap: 10, padding: 28 }}
                    onClick={() => setPayMethod('cash')}
                  >
                    <Banknote size={32} />
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Cash on Delivery</span>
                    <span style={{ fontSize: 12.5, color: 'var(--text-2)' }}>Pay when you receive</span>
                  </button>
                  <button
                    className="pay-option"
                    style={{ flex: 1, flexDirection: 'column', gap: 10, padding: 28 }}
                    onClick={() => setPayMethod('online')}
                  >
                    <CreditCard size={32} />
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Pay Online</span>
                    <span style={{ fontSize: 12.5, color: 'var(--text-2)' }}>Card / Debit card</span>
                  </button>
                </div>
              </div>
            )}

            {payMethod && (
              <div>
                <div style={{ background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 18, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-2)', fontSize: 13.5 }}>Total</span>
                  <span style={{ fontWeight: 700, fontSize: 17 }}>{formatCurrency(grandTotal)}</span>
                </div>

                <p style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Shipping address
                </p>
                <div className="grid-2">
                  <div className="field">
                    <label>Full name</label>
                    <input value={shippingForm.name} onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })} required />
                  </div>
                  <div className="field">
                    <label>Phone</label>
                    <input value={shippingForm.phone} onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })} />
                  </div>
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" value={shippingForm.email} onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })} required />
                </div>
                <div className="field">
                  <label>Street address</label>
                  <input value={shippingForm.street} onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })} required placeholder="123 Main St, Apt 4B" />
                </div>
                <div className="grid-3">
                  <div className="field">
                    <label>City</label>
                    <input value={shippingForm.city} onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })} required />
                  </div>
                  <div className="field">
                    <label>State</label>
                    <input value={shippingForm.state} onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>ZIP</label>
                    <input value={shippingForm.zip} onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })} required />
                  </div>
                </div>

                {payMethod === 'online' && (
                  <>
                    <p style={{ fontSize: 13.5, fontWeight: 600, margin: '20px 0 12px', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Card details
                    </p>
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
                  </>
                )}

                {payError && <div className="form-error">{payError}</div>}

                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  <button className="btn btn-ghost" onClick={() => setPayMethod('')} style={{ flex: 1 }}>
                    Back
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    style={{ flex: 2 }}
                    disabled={payLoading}
                    onClick={payMethod === 'cash' ? confirmCashOrder : confirmOnlineOrder}
                  >
                    {payLoading ? 'Processing…' : payMethod === 'cash' ? `Confirm Cash Order · ${formatCurrency(grandTotal)}` : `Pay Now · ${formatCurrency(grandTotal)}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </>
  )
}
