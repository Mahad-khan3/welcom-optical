import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import { categoryService } from '../services/categoryService'
import Modal from '../components/Modal'
import Loading from '../components/Loading'
import { useToast } from '../components/Toast'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const toast = useToast()

  const load = () =>
    categoryService
      .getAll()
      .then((res) => setCategories(res.data.categories))
      .catch(() => {})
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await categoryService.remove(toDelete._id)
      toast('Category deleted')
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
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Categories</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 13.5 }}>{categories.length} collections</p>
        </div>
        <Link to="/admin/categories/new" className="btn btn-primary">
          <Plus size={17} /> Add category
        </Link>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Slug</th>
                <th>Products</th>
                <th>Sort</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      {c.image ? (
                        <img src={c.image} alt="" className="table-thumb" />
                      ) : (
                        <div className="table-thumb" style={{ display: 'grid', placeItems: 'center', color: 'var(--text-2)' }}>
                          —
                        </div>
                      )}
                      <span style={{ fontWeight: 600 }}>
                        {c.name}
                        {c.featured && <Star size={13} style={{ color: 'var(--accent)', display: 'inline', marginLeft: 8, verticalAlign: '-1px' }} />}
                      </span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-2)' }}>{c.slug}</td>
                  <td>{c.productCount}</td>
                  <td>{c.sortOrder}</td>
                  <td>
                    <span className="pill">{c.featured ? 'Featured' : 'Standard'}</span>
                  </td>
                  <td>
                    <div className="cell-actions">
                      <Link to={`/admin/categories/${c._id}/edit`} className="thin-btn" title="Edit">
                        <Pencil size={15} />
                      </Link>
                      <button className="thin-btn danger" onClick={() => setToDelete(c)} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-2)', padding: 36 }}>
                    No categories yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Delete category">
        <p style={{ color: 'var(--text-2)' }}>
          Delete <b style={{ color: 'var(--text)' }}>{toDelete?.name}</b>? Products in this category will be uncategorized.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={() => setToDelete(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete category'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
