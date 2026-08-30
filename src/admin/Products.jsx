import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, Star } from 'lucide-react'
import { productService } from '../services/productService'
import Modal from '../components/Modal'
import Loading from '../components/Loading'
import { useToast } from '../components/Toast'
import { formatCurrency } from '../utils/format'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const toast = useToast()

  const load = () => {
    setLoading(true)
    productService
      .getAll({ q: q || undefined, page, limit: 15 })
      .then((res) => {
        setProducts(res.data.products)
        setPages(res.data.pages)
        setTotal(res.data.total)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(load, [q, page])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await productService.remove(toDelete._id)
      toast('Product deleted')
      setToDelete(null)
      load()
    } catch (err) {
      toast(err?.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="admin-topbar" style={{ marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Products</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 13.5 }}>{total} products</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">
          <Plus size={17} /> Add product
        </Link>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div className="search-box" style={{ maxWidth: 320 }}>
          <Search size={16} />
          <input placeholder="Search products…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt="" className="table-thumb" />
                      ) : (
                        <div className="table-thumb" style={{ display: 'grid', placeItems: 'center', color: 'var(--text-2)' }}>
                          —
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {p.name}
                          {p.featured && <Star size={13} style={{ color: 'var(--accent)', display: 'inline', marginLeft: 8, verticalAlign: '-1px' }} />}
                        </div>
                        {p.model && <div style={{ color: 'var(--text-2)', fontSize: 12 }}>3D model attached</div>}
                      </div>
                    </div>
                  </td>
                  <td>{p.category?.name || '—'}</td>
                  <td>
                    {formatCurrency(p.price)}
                    {p.compareAtPrice > p.price && (
                      <div style={{ color: 'var(--text-2)', fontSize: 12, textDecoration: 'line-through' }}>
                        {formatCurrency(p.compareAtPrice)}
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ color: p.stock <= 10 ? 'var(--warning)' : 'inherit', fontWeight: 600 }}>{p.stock}</span>
                  </td>
                  <td>
                    <span className={`pill ${p.stock > 0 ? '' : 'status-cancelled'}`}>
                      {p.stock > 0 ? 'Active' : 'Out of stock'}
                    </span>
                  </td>
                  <td>
                    <div className="cell-actions">
                      <Link to={`/admin/products/${p._id}/edit`} className="thin-btn" title="Edit">
                        <Pencil size={15} />
                      </Link>
                      <button className="thin-btn danger" onClick={() => setToDelete(p)} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-2)', padding: 36 }}>
                    No products found
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

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Delete product">
        <p style={{ color: 'var(--text-2)' }}>
          Are you sure you want to permanently delete <b style={{ color: 'var(--text)' }}>{toDelete?.name}</b>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={() => setToDelete(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete product'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
