import { useEffect, useState } from 'react'
import { Search, Trash2 } from 'lucide-react'
import { authService } from '../services/authService'
import Loading from '../components/Loading'
import Modal from '../components/Modal'
import { useToast } from '../components/Toast'
import { formatDate } from '../utils/format'

export default function Customers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const toast = useToast()

  const load = () =>
    authService
      .getUsers()
      .then((res) => setUsers(res.data.users))
      .catch(() => {})
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await authService.deleteUser(toDelete._id)
      toast('Customer removed')
      setToDelete(null)
      load()
    } catch (err) {
      toast(err?.response?.data?.message || 'Could not delete customer')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Customers</h1>
      <p style={{ color: 'var(--text-2)', fontSize: 13.5, marginBottom: 20 }}>{users.length} registered accounts</p>

      <div style={{ marginBottom: 18 }}>
        <div className="search-box" style={{ maxWidth: 320 }}>
          <Search size={16} />
          <input placeholder="Search customers…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Joined</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div
                        className="table-thumb"
                        style={{ display: 'grid', placeItems: 'center', background: 'var(--accent-soft)', color: 'var(--accent-text)', fontWeight: 700 }}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className="pill" style={u.role === 'admin' ? { background: 'var(--accent-soft)', color: 'var(--accent-text)', borderColor: 'rgba(224,71,42,0.3)' } : {}}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.phone || '—'}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: 13 }}>{formatDate(u.createdAt)}</td>
                  <td>
                    <button
                      className="thin-btn danger"
                      disabled={u.role === 'admin'}
                      title={u.role === 'admin' ? 'Cannot delete admin' : 'Delete customer'}
                      onClick={() => setToDelete(u)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-2)', padding: 36 }}>
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Delete customer">
        <p style={{ color: 'var(--text-2)' }}>
          Remove <b style={{ color: 'var(--text)' }}>{toDelete?.name}</b> ({toDelete?.email})? This will not delete their orders.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={() => setToDelete(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete customer'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
