import { useEffect, useState } from 'react'
import { Plus, Trash2, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { galleryService } from '../services/galleryService'
import { productService } from '../services/productService'
import { useToast } from '../components/Toast'
import Loading from '../components/Loading'

export default function GalleryManager() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploadingIdx, setUploadingIdx] = useState(null)
  const toast = useToast()

  const load = () => {
    setLoading(true)
    setError(null)
    galleryService
      .get()
      .then((res) => setData(res.data.gallery))
      .catch(() => setError('Gallery load nahi ho saki. Server ya internet check karein.'))
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
          <h1 style={{ fontSize: 24 }}>Gallery</h1>
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

  const images = data.images || []

  const addImage = () => {
    setData({ ...data, images: [...images, { image: '', label: '' }] })
  }

  const removeImage = (index) => {
    setData({ ...data, images: images.filter((_, i) => i !== index) })
  }

  const updateItem = (index, field, value) => {
    const list = [...images]
    list[index] = { ...list[index], [field]: value }
    setData({ ...data, images: list })
  }

  const handleUpload = async (index, file) => {
    if (!file) return
    setUploadingIdx(index)
    try {
      const url = await productService.upload(file, 'image')
      updateItem(index, 'image', url)
    } catch {
      toast('Upload failed')
    } finally {
      setUploadingIdx(null)
    }
  }

  const move = (index, dir) => {
    const list = [...images]
    const target = index + dir
    if (target < 0 || target >= list.length) return
    ;[list[index], list[target]] = [list[target], list[index]]
    setData({ ...data, images: list })
  }

  const save = async () => {
    setSaving(true)
    try {
      await galleryService.update({
        images: images.filter((i) => i.image),
        active: data.active !== false,
      })
      toast('Gallery saved')
      load()
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
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Welcom Optical Gallery</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 13.5 }}>
            Homepage marquee gallery — pehli aadhi images upar wali row (right scroll), baqi neeche wali row (left scroll). Heights automatic vary hoti hain.
          </p>
        </div>
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 15 }}>
            Images ({images.filter((i) => i.image).length})
          </h3>
          <button className="btn btn-outline btn-sm" onClick={addImage}>
            <Plus size={14} /> Add Image
          </button>
        </div>

        {images.length === 0 ? (
          <p style={{ color: 'var(--text-2)', fontSize: 13 }}>
            Koi image nahi hai. Click "Add Image" — 6 se 12 images recommended hain.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
            {images.map((item, i) => (
              <div key={i} className="card" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div
                  style={{
                    width: '100%',
                    aspectRatio: i % 2 === 0 ? '3 / 4' : '4 / 3',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--card-2)',
                    overflow: 'hidden',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {item.image ? (
                    <img src={item.image} alt={item.label || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={22} style={{ color: 'var(--text-2)' }} />
                  )}
                </div>

                <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', justifyContent: 'center', display: 'flex', fontSize: 11, padding: '5px 8px' }}>
                  <Upload size={12} /> {uploadingIdx === i ? 'Uploading…' : item.image ? 'Replace' : 'Upload'}
                  <input type="file" accept="image/*" hidden onChange={(e) => handleUpload(i, e.target.files?.[0])} />
                </label>

                <input
                  value={item.label || ''}
                  onChange={(e) => updateItem(i, 'label', e.target.value)}
                  placeholder="Label (optional)"
                  style={{ fontSize: 11.5, padding: '5px 8px' }}
                />

                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="thin-btn" onClick={() => move(i, -1)} title="Move up">↑</button>
                  <button className="thin-btn" onClick={() => move(i, 1)} title="Move down">↓</button>
                  <button className="thin-btn danger" onClick={() => removeImage(i)} style={{ marginLeft: 'auto' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
