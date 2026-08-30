import { useEffect, useState } from 'react'
import { Plus, Trash2, Upload, AlertCircle, Film } from 'lucide-react'
import { videoService } from '../services/videoService'
import { productService } from '../services/productService'
import { useToast } from '../components/Toast'
import Loading from '../components/Loading'

const MAX_VIDEOS = 5

export default function VideosManager() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploadingIdx, setUploadingIdx] = useState(null)
  const [uploadPct, setUploadPct] = useState(0)
  const toast = useToast()

  const load = () => {
    setLoading(true)
    setError(null)
    videoService
      .get()
      .then((res) => setData(res.data.videos))
      .catch(() => setError('Videos load nahi ho sake. Server ya internet check karein.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const videos = data?.videos || []

  const addItem = () => {
    if (!data || videos.length >= MAX_VIDEOS) return
    setData({ ...data, videos: [...videos, { video: '', link: '', label: '' }] })
  }

  const removeItem = (index) => {
    setData({ ...data, videos: videos.filter((_, i) => i !== index) })
  }

  const updateItem = (index, field, value) => {
    const list = [...videos]
    list[index] = { ...list[index], [field]: value }
    setData({ ...data, videos: list })
  }

  const handleUpload = async (index, file) => {
    if (!file) return
    setUploadingIdx(index)
    setUploadPct(0)
    try {
      const url = await productService.upload(file, 'video', (pct) => setUploadPct(pct))
      updateItem(index, 'video', url)
    } catch (err) {
      toast(err?.response?.data?.message || 'Upload failed — dobara koshish karein')
    } finally {
      setUploadingIdx(null)
      setUploadPct(0)
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      await videoService.update({
        videos,
        active: data.active !== false,
      })
      toast('Videos saved')
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
          <h1 style={{ fontSize: 24 }}>Videos</h1>
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

  return (
    <div>
      <div className="admin-topbar" style={{ marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Videos</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 13.5 }}>
            Homepage "Watch In Motion" section — portrait videos that autoplay muted and open a link on click ({videos.length}/{MAX_VIDEOS})
          </p>
        </div>
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="card" style={{ padding: 22, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 15 }}>
            Video List ({videos.length}/{MAX_VIDEOS})
          </h3>
          {videos.length < MAX_VIDEOS && (
            <button className="btn btn-outline btn-sm" onClick={addItem}>
              <Plus size={14} /> Add Video
            </button>
          )}
        </div>

        {videos.length === 0 ? (
          <p style={{ color: 'var(--text-2)', fontSize: 13 }}>
            No videos added yet. Click "Add Video" to start.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {videos.map((item, i) => (
              <div key={i} className="card" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <Film size={12} /> Video {i + 1}
                </span>

                <div
                  style={{
                    width: '100%',
                    aspectRatio: '9 / 16',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--card-2)',
                    overflow: 'hidden',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {item.video ? (
                    <video src={item.video} muted loop playsInline controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Film size={24} style={{ color: 'var(--text-2)' }} />
                  )}
                </div>

                <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', justifyContent: 'center' }}>
                  <Upload size={13} />{' '}
                  {uploadingIdx === i
                    ? `Uploading… ${uploadPct}%`
                    : item.video
                      ? 'Replace'
                      : 'Upload Video'}
                  <input
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={(e) => handleUpload(i, e.target.files?.[0])}
                  />
                </label>

                <input
                  value={item.label || ''}
                  onChange={(e) => updateItem(i, 'label', e.target.value)}
                  placeholder="Label (optional)"
                  style={{ fontSize: 12, padding: '6px 8px' }}
                />
                <input
                  value={item.link || ''}
                  onChange={(e) => updateItem(i, 'link', e.target.value)}
                  placeholder="Link on click (https://…)"
                  style={{ fontSize: 12, padding: '6px 8px' }}
                />

                <button className="thin-btn danger" onClick={() => removeItem(i)} style={{ alignSelf: 'flex-end' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
