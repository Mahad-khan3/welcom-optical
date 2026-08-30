import { useEffect, useState } from 'react'
import { useRef } from 'react'
import { Upload, X, Box } from 'lucide-react'
import { productService } from '../services/productService'
import { categoryService } from '../services/categoryService'
import { getErrorMessage } from '../utils/format'

export default function ProductForm({ initial = {}, onSubmit, submitLabel = 'Save product', loading }) {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    name: '',
    price: '',
    compareAtPrice: '',
    stock: 0,
    category: '',
    featured: false,
    description: '',
    details: '',
    tags: '',
    frameColor: '',
    material: '',
    lensColor: '',
    dimensions: '',
    images: [],
    model: '',
    ...initial,
  })
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [modelUploading, setModelUploading] = useState(false)
  const imgInput = useRef(null)
  const modelInput = useRef(null)

  useEffect(() => {
    categoryService
      .getAll()
      .then((res) => setCategories(res.data.categories))
      .catch(() => {})
  }, [])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const uploadImages = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    setError('')
    try {
      const urls = []
      for (const file of files) {
        urls.push(await productService.upload(file, 'image'))
      }
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }))
    } catch (err) {
      setError(getErrorMessage(err, 'Image upload failed'))
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const uploadModel = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setModelUploading(true)
    setError('')
    try {
      const url = await productService.upload(file, 'model')
      setForm((f) => ({ ...f, model: url }))
    } catch (err) {
      setError(getErrorMessage(err, 'Model upload failed'))
    } finally {
      setModelUploading(false)
      e.target.value = ''
    }
  }

  const removeImage = (idx) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Product name is required')
    if (form.price === '' || Number(form.price) < 0) return setError('Enter a valid price')

    try {
      await onSubmit({
        name: form.name.trim(),
        price: Number(form.price),
        compareAtPrice: Number(form.compareAtPrice) || 0,
        stock: Number(form.stock) || 0,
        category: form.category || undefined,
        featured: !!form.featured,
        description: form.description,
        details: form.details,
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        frameColor: form.frameColor,
        material: form.material,
        lensColor: form.lensColor,
        dimensions: form.dimensions,
        images: form.images,
        model: form.model,
      })
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save product'))
    }
  }

  return (
    <form onSubmit={submit} className="admin-form">
      {error && <div className="form-error">{error}</div>}

      <div className="card">
        <h2>Basic information</h2>
        <div className="field">
          <label>Product name *</label>
          <input name="name" value={form.name} onChange={onChange} placeholder="e.g. Aria Round Optical" required />
        </div>
        <div className="grid-3">
          <div className="field">
            <label>Price (USD) *</label>
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={onChange} placeholder="199.00" required />
          </div>
          <div className="field">
            <label>Compare-at price</label>
            <input name="compareAtPrice" type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={onChange} placeholder="249.00" />
          </div>
          <div className="field">
            <label>Stock</label>
            <input name="stock" type="number" min="0" value={form.stock} onChange={onChange} />
          </div>
        </div>
        <div className="grid-2">
          <div className="field">
            <label>Category</label>
            <select name="category" value={form.category || ''} onChange={onChange}>
              <option value="">— No category —</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
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
              Featured on homepage
            </label>
          </div>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={onChange} placeholder="Short marketing description shown on product cards…" />
        </div>
        <div className="field">
          <label>Details</label>
          <textarea name="details" value={form.details} onChange={onChange} placeholder="Longer description, features, what makes this frame special…" />
        </div>
      </div>

      <div className="card">
        <h2>Media</h2>
        <div className="upload-zone" onClick={() => imgInput.current?.click()}>
          <Upload size={22} style={{ margin: '0 auto 8px' }} />
          <b>{uploading ? 'Uploading…' : 'Click to upload product images'}</b>
          <p style={{ fontSize: 12.5, marginTop: 4 }}>JPG, PNG, WEBP — up to 10 images</p>
          <input ref={imgInput} type="file" accept="image/*" multiple hidden onChange={uploadImages} />
        </div>
        {form.images.length > 0 && (
          <div className="upload-previews">
            {form.images.map((img, i) => (
              <div className="upload-preview" key={img + i}>
                <img src={img} alt="" />
                <button type="button" className="remove" onClick={() => removeImage(i)} aria-label="Remove image">
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        <h2 style={{ marginTop: 26 }}>3D model (GLB)</h2>
        <div className="upload-zone" onClick={() => modelInput.current?.click()}>
          <Box size={22} style={{ margin: '0 auto 8px' }} />
          <b>{modelUploading ? 'Uploading model…' : 'Click to upload a GLB model'}</b>
          <p style={{ fontSize: 12.5, marginTop: 4 }}>
            {form.model ? `Current model: ${form.model}` : 'If none is uploaded, the default glasses model is used'}
          </p>
          <input ref={modelInput} type="file" accept=".glb,.gltf,.bin" hidden onChange={uploadModel} />
        </div>
      </div>

      <div className="card">
        <h2>Product attributes</h2>
        <div className="grid-3">
          <div className="field">
            <label>Frame color</label>
            <input name="frameColor" value={form.frameColor} onChange={onChange} placeholder="e.g. Tortoise" />
          </div>
          <div className="field">
            <label>Material</label>
            <input name="material" value={form.material} onChange={onChange} placeholder="e.g. Bio-acetate" />
          </div>
          <div className="field">
            <label>Lens</label>
            <input name="lensColor" value={form.lensColor} onChange={onChange} placeholder="e.g. UV-400 clear" />
          </div>
        </div>
        <div className="grid-2">
          <div className="field">
            <label>Dimensions</label>
            <input name="dimensions" value={form.dimensions} onChange={onChange} placeholder="e.g. 50-21-145" />
          </div>
          <div className="field">
            <label>Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={onChange} placeholder="round, optical, acetate" />
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading || uploading || modelUploading}>
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
