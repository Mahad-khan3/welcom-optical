import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import { getErrorMessage } from '../utils/format'

export default function Settings() {
  const { user, updateProfile, changePassword } = useAuth()
  const toast = useToast()
  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  })
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const saveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await updateProfile(profile)
      toast('Admin profile updated')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    if (pw.newPassword !== pw.confirm) {
      setError('New passwords do not match')
      setSaving(false)
      return
    }
    try {
      await changePassword(pw.currentPassword, pw.newPassword)
      toast('Password updated')
      setPw({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update password'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Settings</h1>

      {error && <div className="form-error" style={{ maxWidth: 560 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }} className="settings-grid">
        <div className="card" style={{ padding: 26 }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 16, marginBottom: 20 }}>Admin profile</h2>
          <form onSubmit={saveProfile}>
            <div className="field">
              <label>Name</label>
              <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={user?.email} disabled />
              <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>Email cannot be changed.</p>
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <button className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save profile'}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: 26 }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 16, marginBottom: 20 }}>Security</h2>
          <form onSubmit={savePassword}>
            <div className="field">
              <label>Current password</label>
              <input type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required />
            </div>
            <div className="field">
              <label>New password</label>
              <input type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required />
            </div>
            <div className="field">
              <label>Confirm new password</label>
              <input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required />
            </div>
            <button className="btn btn-outline" disabled={saving}>
              {saving ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      </div>

      <div className="card" style={{ padding: 26, marginTop: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 16, marginBottom: 8 }}>Store details</h2>
        <p style={{ color: 'var(--text-2)', fontSize: 14 }}>
          Store name, logo and contact details live in <code>frontend/src/components/Navbar.jsx</code> and{' '}
          <code>Footer.jsx</code>. Site-wide colors and the accent palette are defined as CSS variables in{' '}
          <code>frontend/src/index.css</code>.
        </p>
      </div>
    </div>
  )
}
