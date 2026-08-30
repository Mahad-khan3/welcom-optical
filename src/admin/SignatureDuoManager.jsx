import { useEffect, useState } from 'react'
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { signatureDuoService } from '../services/signatureDuoService'
import { productService } from '../services/productService'
import { useToast } from '../components/Toast'
import Loading from '../components/Loading'

const DEFAULTS = [
  {
    image: '',
    heading: 'Clear Vision, Quiet Luxury',
    text: 'Lightweight acetate frames with precision lenses — designed for all-day comfort and a look that never tries too hard.',
    link: '/shop',
  },
  {
    image: '',
    heading: 'Bold Shades For Bright Days',
    text: 'UV400 protected lenses in sharp modern silhouettes — sun protection that looks as good as it feels.',
    link: '/collections',
  },
]

export default function SignatureDuoManager() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploadingIdx, setUploadingIdx] = useState(null)
  const toast = useToast()

  const load = () => {
    setLoading(true)
    setError(null)
    signatureDuoService
      .get()
      .then((res) => setData(res.data.signature))
      .catch(() => setError('Load nahi ho saka. Server ya internet check karein.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <Loading />
  if (error) {
    return (
      <div>
        <div className="admin-topbar" style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24 }}>Signature Sections</h1>
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
  if (!data) return null

  const panels = [0, 1].map((i) => ({ ...DEFAULTS[i], ...(data.panels?.[i] || {}) }))

  const updatePanel = (index, field, value) => {
    const list = [...(data.panels || [])]
    list[index] = { ...DEFAULTS[index], ...(list[index] || {}), [field]: value }
    setData({ ...data, panels: list })
  }

  const handleUpload = async (index, file) => {
    if (!file) return
    setUploadingIdx(index)
    try {
      const url = await productService.upload(file, 'image')
      updatePanel(index, 'image', url)
    } catch {
      toast('Upload failed')
    } finally {
      setUploadingIdx(null)
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      await signatureDuoService.update({
        panels,
        active: data.active !== false,
      })
      toast('Signature sections saved')
    } catch {
      toast('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="admin-topbar" style={{ marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Signature Sections</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 13.5 }}>
            Homepage ke dono rounded product sections — image, heading, text aur button link yahan se set karein (bina image ke line-art dikhta hai)
          </p>
        </div>
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {panels.map((panel, i) => (
          <div key={i} className="card" style={{ padding: 22 }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 15, marginBottom: 14 }}>
              Section {i + 1} {i === 0 ? '(image left)' : '(image right)'}
            </h3>

            <div
              style={{
                width: '100%',
                aspectRatio: '4 / 3',
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--card-2)',
                overflow: 'hidden',
                display: 'grid',
                placeItems: 'center',
                marginBottom: 12,
              }}
            >
              {panel.image ? (
                <img src={panel.image} alt="panel" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <ImageIcon size={26} style={{ color: 'var(--text-2)' }} />
              )}
            </div>

            <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', justifyContent: 'center', display: 'flex', marginBottom: 12 }}>
              <Upload size={13} /> {uploadingIdx === i ? 'Uploading…' : panel.image ? 'Replace Image' : 'Upload Image'}
              <input type="file" accept="image/*" hidden onChange={(e) => handleUpload(i, e.target.files?.[0])} />
            </label>

            {panel.image && (
              <button
                className="thin-btn"
                onClick={() => updatePanel(i, 'image', '')}
                style={{ marginBottom: 12 }}
              >
                Remove image (line-art par wapas)
              </button>
            )}

            <input
              value={panel.heading}
              onChange={(e) => updatePanel(i, 'heading', e.target.value)}
              placeholder="Heading"
              style={{ fontSize: 13, padding: '8px 10px', marginBottom: 8 }}
            />
            <textarea
              value={panel.text}
              onChange={(e) => updatePanel(i, 'text', e.target.value)}
              placeholder="Short description"
              rows={3}
              style={{ fontSize: 12.5, padding: '8px 10px', marginBottom: 8, resize: 'vertical' }}
            />
            <input
              value={panel.link}
              onChange={(e) => updatePanel(i, 'link', e.target.value)}
              placeholder="Shop Now button link (/shop)"
              style={{ fontSize: 12.5, padding: '8px 10px' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
