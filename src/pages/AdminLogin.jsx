import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/format'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      if (user.role !== 'admin') {
        setError('This account does not have admin access')
        return
      }
      navigate('/admin')
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid email or password'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-icon">
          <ShieldCheck size={36} />
        </div>
        <h1>Admin Panel</h1>
        <p className="sub">Sign in with your admin credentials to access the dashboard.</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={submit}>
          <div className="field input-icon">
            <Mail />
            <input
              name="email"
              type="email"
              placeholder="Admin email"
              value={form.email}
              onChange={onChange}
              required
              autoComplete="email"
            />
          </div>
          <div className="field input-icon">
            <Lock />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              required
              autoComplete="current-password"
            />
          </div>
          <button className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}
