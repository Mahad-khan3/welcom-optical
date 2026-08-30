import { useEffect, useState } from 'react'
import { Plus, Trash2, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { showcaseService } from '../services/showcaseService'
import { productService } from '../services/productService'
import { useToast } from '../components/Toast'
import Loading from '../components/Loading'

function ItemCard({ item, type, index, onUpdate, onRemove }) {
  const [uploadingImg, setUploadingImg] = useState(false)
  const [uploadingCenter, setUploadingCenter] = useState(false)
  const toast = useToast()

  const handleUpload = async (field, file) => {
    if (!file) return
    if (field === 'image') setUploadingImg(true)
    else setUploadingCenter(true)
    try {
      const url = await productService.upload(file, 'image')
      onUpdate(index, field, url)
    } catch {
      toast('Upload failed')
    } finally {
      setUploadingImg(false)
      setUploadingCenter(false)
    }
  }

  return (
    <div className="card" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Thumbnail (frame or lens image) */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {type === 'frame' ? 'Frame' : 'Lens'} Image
          </span>
          <div
            style={{
              width: '100%',
              aspectRatio: '1',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--card-2)',
              overflow: 'hidden',
              display: 'grid',
              placeItems: 'center',
              marginTop: 4,
            }}
          >
            {item.image ? (
              <img src={item.image} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <ImageIcon size={22} style={{ color: 'var(--text-2)' }} />
            )}
          </div>
        </div>
        {/* Center image */}
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Center Image
          </span>
          <div
            style={{
              width: '100%',
              aspectRatio: '1',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--card-2)',
              overflow: 'hidden',
              display: 'grid',
              placeItems: 'center',
              marginTop: 4,
            }}
          >
            {item.centerImage ? (
              <img src={item.centerImage} alt="center" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <ImageIcon size={22} style={{ color: 'var(--text-2)' }} />
            )}
          </div>
        </div>
      </div>

      {/* Label */}
      <input
        value={item.label || ''}
        onChange={(e) => onUpdate(index, 'label', e.target.value)}
        placeholder="Label (optional)"
        style={{ fontSize: 12, padding: '6px 8px' }}
      />

      {/* Upload buttons */}
      <div style={{ display: 'flex', gap: 4 }}>
        <label className="btn btn-outline btn-sm" style={{ flex: 1, cursor: 'pointer', fontSize: 11, padding: '5px 8px' }}>
          <Upload size={12} /> {uploadingImg ? '…' : `${type === 'frame' ? 'Frame' : 'Lens'} img`}
          <input type="file" accept="image/*" hidden onChange={(e) => handleUpload('image', e.target.files?.[0])} />
        </label>
        <label className="btn btn-outline btn-sm" style={{ flex: 1, cursor: 'pointer', fontSize: 11, padding: '5px 8px' }}>
          <Upload size={12} /> {uploadingCenter ? '…' : 'Center img'}
          <input type="file" accept="image/*" hidden onChange={(e) => handleUpload('centerImage', e.target.files?.[0])} />
        </label>
        <button className="thin-btn danger" onClick={() => onRemove(index)}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

export default function ShowcaseManager() {
  const [showcase, setShowcase] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(null)
  const toast = useToast()

  const load = () => {
    setLoading(true)
    setError(null)
    showcaseService
      .get()
      .then((res) => setShowcase(res.data.showcase))
      .catch(() =>
        setError('Showcase load nahi ho saka. Server ya internet check karein.')
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateItem = (type, index, field, value) => {
    setShowcase((prev) => {
      const updated = { ...prev }
      const list = type === 'frame' ? [...(updated.frames || [])] : [...(updated.lenses || [])]
      list[index] = { ...list[index], [field]: value }
      if (type === 'frame') updated.frames = list
      else updated.lenses = list
      return updated
    })
  }

  const addItem = (type) => {
    setShowcase((prev) => {
      const updated = { ...prev }
      const list = type === 'frame' ? [...(updated.frames || [])] : [...(updated.lenses || [])]
      list.push({ image: '', centerImage: '', label: '' })
      if (type === 'frame') updated.frames = list
      else updated.lenses = list
      return updated
    })
  }

  const removeItem = (type, index) => {
    setShowcase((prev) => {
      const updated = { ...prev }
      if (type === 'frame') updated.frames = (updated.frames || []).filter((_, i) => i !== index)
      else updated.lenses = (updated.lenses || []).filter((_, i) => i !== index)
      return updated
    })
  }

  const handleCenterUpload = async (file) => {
    if (!file) return
    setUploading('center')
    try {
      const url = await productService.upload(file, 'image')
      setShowcase((prev) => ({ ...prev, centerDefault: url }))
    } catch {
      toast('Upload failed')
    } finally {
      setUploading(null)
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      await showcaseService.update({
        frames: showcase.frames,
        lenses: showcase.lenses,
        centerDefault: showcase.centerDefault,
      })
      toast('Showcase saved')
    } catch {
      toast('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />
  if (error) {
    return (
      <div>
        <div className="admin-topbar" style={{ marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, marginBottom: 4 }}>Product Showcase</h1>
          </div>
        </div>
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 20px',
            borderColor: 'var(--danger)',
          }}
        >
          <AlertCircle size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <span style={{ fontSize: 14 }}>{error}</span>
          <button className="thin-btn" onClick={load} style={{ marginLeft: 'auto' }}>
            Retry
          </button>
        </div>
      </div>
    )
  }
  if (!showcase) return <div className="empty-state"><h3>Could not load showcase</h3></div>

  const frames = showcase.frames || []
  const lenses = showcase.lenses || []

  return (
    <div>
      <div className="admin-topbar" style={{ marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Product Showcase</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 13.5 }}>
            Each frame &amp; lens has its own center image — clicking changes the center smoothly
          </p>
        </div>
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {/* Default center image */}
      <div className="card" style={{ padding: 22, marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 15, marginBottom: 12 }}>
          Default Center Image
        </h3>
        <p style={{ fontSize: 12.5, color: 'var(--text-2)', marginBottom: 12 }}>
          Shown when no frame or lens is selected
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--card-2)',
              overflow: 'hidden',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            {showcase.centerDefault ? (
              <img src={showcase.centerDefault} alt="Center default" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <ImageIcon size={26} style={{ color: 'var(--text-2)' }} />
            )}
          </div>
          <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
            <Upload size={14} /> {uploading === 'center' ? 'Uploading…' : 'Upload Image'}
            <input type="file" accept="image/*" hidden onChange={(e) => handleCenterUpload(e.target.files?.[0])} />
          </label>
        </div>
      </div>

      {/* Frames */}
      <div className="card" style={{ padding: 22, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 15 }}>
            Frames ({frames.length}/5)
          </h3>
          {frames.length < 5 && (
            <button className="btn btn-outline btn-sm" onClick={() => addItem('frame')}>
              <Plus size={14} /> Add Frame
            </button>
          )}
        </div>
        {frames.length === 0 ? (
          <p style={{ color: 'var(--text-2)', fontSize: 13 }}>No frames added yet. Click "Add Frame" to start.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {frames.map((frame, i) => (
              <ItemCard
                key={i}
                item={frame}
                type="frame"
                index={i}
                onUpdate={(idx, field, val) => updateItem('frame', idx, field, val)}
                onRemove={(idx) => removeItem('frame', idx)}
                uploading={uploading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lenses */}
      <div className="card" style={{ padding: 22, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 15 }}>
            Lenses ({lenses.length}/5)
          </h3>
          {lenses.length < 5 && (
            <button className="btn btn-outline btn-sm" onClick={() => addItem('lens')}>
              <Plus size={14} /> Add Lens
            </button>
          )}
        </div>
        {lenses.length === 0 ? (
          <p style={{ color: 'var(--text-2)', fontSize: 13 }}>No lenses added yet. Click "Add Lens" to start.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {lenses.map((lens, i) => (
              <ItemCard
                key={i}
                item={lens}
                type="lens"
                index={i}
                onUpdate={(idx, field, val) => updateItem('lens', idx, field, val)}
                onRemove={(idx) => removeItem('lens', idx)}
                uploading={uploading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
