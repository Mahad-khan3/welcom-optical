import { useEffect, useRef, useState } from 'react'
import { Upload, X, Search, Check } from 'lucide-react'
import { productService } from '../services/productService'
import { getErrorMessage } from '../utils/format'

export default function CategoryForm({ initial = {}, onSubmit, submitLabel = 'Save category', loading }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    featured: false,
    sortOrder: 0,
    ...initial,
  })
  const [selectedProducts, setSelectedProducts] = useState(initial.products?.map((p) => p._id) || [])
  const [allProducts, setAllProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const input = useRef(null)

  useEffect(() => {
    productService
      .getAll({ limit: 500 })
      .then((res) => setAllProducts(res.data.products))
      .catch(() => {})
      .finally(() => setProductsLoading(false))
  }, [])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const toggleProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    )
  }

  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const uploadImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const url = await productService.upload(file, 'image')
      setForm((f) => ({ ...f, image: url }))
    } catch (err) {
      setError(getErrorMessage(err, 'Upload failed'))
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Category name is required')
    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description,
        image: form.image,
        featured: !!form.featured,
        sortOrder: Number(form.sortOrder) || 0,
        products: selectedProducts,
      })
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save category'))
    }
  }

  return (
    <form onSubmit={submit} className="admin-form">
      {error && <div className="form-error">{error}</div>}

      <div className="card">
        <h2>Category details</h2>
        <div className="field">
          <label>Category name *</label>
          <input name="name" value={form.name} onChange={onChange} placeholder="e.g. Sunglasses" required />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={onChange} />
        </div>
        <div className="grid-2">
          <div className="field">
            <label>Sort order</label>
            <input name="sortOrder" type="number" value={form.sortOrder} onChange={onChange} />
          </div>
          <div className="field">
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 22, cursor: 'pointer' }}>
              <span className="switch">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                <span className="track" />
              </span>
              Featured collection
            </label>
          </div>
        </div>
        <div className="upload-zone" onClick={() => input.current?.click()}>
          <Upload size={22} style={{ margin: '0 auto 8px' }} />
          <b>{uploading ? 'Uploading…' : 'Click to upload a cover image'}</b>
          <input ref={input} type="file" accept="image/*" hidden onChange={uploadImage} />
        </div>
        {form.image && (
          <div style={{ marginTop: 14 }}>
            <div className="upload-preview" style={{ maxWidth: 200 }}>
              <img src={form.image} alt="" />
              <button type="button" className="remove" onClick={() => setForm({ ...form, image: '' })}>
                <X size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Products</h2>
        <p style={{ color: 'var(--text-2)', fontSize: 13.5, marginBottom: 16 }}>
          Select products to include in this category ({selectedProducts.length} selected)
        </p>

        <div className="cat-search-box">
          <Search size={16} />
          <input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" className="cat-search-clear" onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </div>

        {productsLoading ? (
          <p style={{ color: 'var(--text-2)', fontSize: 13, padding: '20px 0' }}>Loading products…</p>
        ) : filteredProducts.length === 0 ? (
          <p style={{ color: 'var(--text-2)', fontSize: 13, padding: '20px 0' }}>
            {search ? 'No products match your search' : 'No products available. Create products first.'}
          </p>
        ) : (
          <div className="cat-product-list">
            {filteredProducts.map((p) => {
              const isSelected = selectedProducts.includes(p._id)
              return (
                <button
                  type="button"
                  key={p._id}
                  className={`cat-product-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleProduct(p._id)}
                >
                  <div className="cat-product-check">
                    {isSelected ? <Check size={14} /> : <span className="cat-product-empty" />}
                  </div>
                  <img
                    src={p.images?.[0] || '/images/product-placeholder.svg'}
                    alt=""
                    className="cat-product-thumb"
                  />
                  <div className="cat-product-info">
                    <span className="cat-product-name">{p.name}</span>
                    <span className="cat-product-price">
                      ${Number(p.price).toFixed(2)}
                      {p.stock > 0 ? ` · ${p.stock} in stock` : ' · Out of stock'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading || uploading}>
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
