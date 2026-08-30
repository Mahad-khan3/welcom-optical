import { useEffect, useRef, useState } from 'react'
import { Eye, EyeOff, Save, ArrowRight, LayoutList, AlertCircle, Sparkles, Plus, X, Boxes, Images, Sun, CircleDot } from 'lucide-react'
import { homepageSectionService } from '../services/homepageSectionService'
import { productSpotlightService } from '../services/productSpotlightService'
import { storageOptionsService } from '../services/storageOptionsService'
import { horizontalSliderService } from '../services/horizontalSliderService'
import { productService } from '../services/productService'
import { categoryService } from '../services/categoryService'
import { useToast } from '../components/Toast'
import Loading from '../components/Loading'

const DEFAULTS = []

function HsSliderCard({
  icon,
  title,
  subtitle,
  slider,
  form,
  setForm,
  saving,
  savingKey,
  onSave,
  onToggle,
  categories,
}) {
  const isSaving = saving === savingKey

  return (
    <div
      className="card adjust-section-card"
      style={{
        padding: 0,
        overflow: 'hidden',
        marginBottom: 24,
        opacity: slider.active ? 1 : 0.55,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 22px',
          borderBottom: '1px solid var(--border)',
          background: slider.active ? 'var(--card)' : 'var(--card-2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'var(--accent-soft)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--accent-text)',
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{title}</div>
            <div style={{ color: 'var(--text-2)', fontSize: 12.5, marginTop: 1 }}>
              {subtitle}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            className="pill"
            style={{
              fontSize: 10,
              background: slider.active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: slider.active ? 'var(--success)' : 'var(--danger)',
              borderColor: slider.active ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
            }}
          >
            {slider.active ? 'Visible' : 'Hidden'}
          </span>
          <button
            className="thin-btn"
            onClick={() => onToggle(!slider.active)}
            title={slider.active ? 'Hide section' : 'Show section'}
          >
            {slider.active ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
        </div>
      </div>

      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="grid-2">
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Section heading ka naam</label>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Experience Welcom"
              disabled={isSaving}
            />
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label>Category (iski products slide me show hogi)</label>
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              disabled={isSaving}
            >
              <option value="">— Select category —</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-primary"
            onClick={onSave}
            disabled={isSaving}
            style={{ width: 'auto', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Save size={15} /> Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default function HomepageSections() {
  const [sections, setSections] = useState([])
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [spotlight, setSpotlight] = useState(null)
  const [storageOpts, setStorageOpts] = useState(null)
  const [hsSlider, setHsSlider] = useState(null)
  const [hsForm, setHsForm] = useState({ title: 'Experience Welcom', category: '' })
  const [hsSlider2, setHsSlider2] = useState(null)
  const [hsForm2, setHsForm2] = useState({ title: 'Sun Glasses', category: '' })
  const [hsCta, setHsCta] = useState(null)
  const [hsFormCta, setHsFormCta] = useState({ title: 'Explore Collection', category: '' })
  const [soPick, setSoPick] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(null)
  const loadOnce = useRef(false)
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [secRes, catRes, prodRes, spotRes, soRes, hsRes, hsRes2, hsRes3] = await Promise.all([
        homepageSectionService.getAll(),
        categoryService.getAll(),
        productService.getAll({ limit: 500 }),
        productSpotlightService.get(),
        storageOptionsService.get(),
        horizontalSliderService.getAdmin('primary'),
        horizontalSliderService.getAdmin('secondary'),
        horizontalSliderService.getAdmin('cta'),
      ])
      let secs = secRes.data.sections || []
      const cats = catRes.data.categories || []
      setCategories(cats)
      setProducts(prodRes.data.products || [])
      setSpotlight(spotRes.data.spotlight || null)
      setStorageOpts(soRes.data.options || null)
      setHsSlider(hsRes.data.slider || null)
      setHsForm({
        title: hsRes.data.slider?.title || 'Experience Welcom',
        category: hsRes.data.slider?.category?._id || '',
      })
      setHsSlider2(hsRes2.data.slider || null)
      setHsForm2({
        title: hsRes2.data.slider?.title || 'Sun Glasses',
        category: hsRes2.data.slider?.category?._id || '',
      })
      setHsCta(hsRes3.data.slider || null)
      setHsFormCta({
        title: hsRes3.data.slider?.title || 'Explore Collection',
        category: hsRes3.data.slider?.category?._id || '',
      })

      // Dedupe (safety): keep one section per title
      const seen = new Set()
      secs = secs.filter((s) => {
        const key = s.title?.trim().toLowerCase()
        if (!key || seen.has(key)) return false
        seen.add(key)
        return true
      })

      const missing = DEFAULTS.filter(
        (d) => !secs.find((s) => s.title === d.title)
      )
      for (const def of missing) {
        try {
          const res = await homepageSectionService.create({
            title: def.title,
            category: cats[0]?._id || '',
            limit: 5,
            buttonLabel: 'See More',
            buttonLink: '',
            sortOrder: def.sortOrder,
            active: true,
          })
          secs.push(res.data.section)
        } catch {}
      }

      secs.sort((a, b) => a.sortOrder - b.sortOrder)
      setSections(secs)
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Session expired — please log in again.'
          : 'Sections load nahi ho saki. Server ya internet check karein.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (loadOnce.current) return
    loadOnce.current = true
    load()
  }, [])

  const updateField = async (sec, field, value) => {
    setSaving(sec._id)
    try {
      await homepageSectionService.update(sec._id, { [field]: value })
      setSections((prev) =>
        prev.map((s) =>
          s._id === sec._id ? { ...s, [field]: value } : s
        )
      )
      if (field === 'active') {
        toast(value ? 'Section is now visible on homepage' : 'Section hidden from homepage')
      } else {
        toast('Saved')
      }
    } catch {
      toast('Failed to save')
    } finally {
      setSaving(null)
    }
  }

  const updateSpotlight = async (fields, msg) => {
    if (!spotlight) return
    setSaving('spotlight')
    try {
      const res = await productSpotlightService.update(fields)
      setSpotlight(res.data.spotlight)
      toast(msg || 'Saved')
    } catch {
      toast('Failed to save')
    } finally {
      setSaving(null)
    }
  }

  const updateStorageOptions = async (fields, msg) => {
    if (!storageOpts) return
    setSaving('storage')
    try {
      const res = await storageOptionsService.update(fields)
      setStorageOpts(res.data.options)
      toast(msg || 'Saved')
    } catch {
      toast('Failed to save')
    } finally {
      setSaving(null)
    }
  }

  const addStorageCollection = () => {
    const current = (storageOpts?.collections || []).map((c) => c._id || c)
    if (!soPick) {
      toast('Pehle collection select karein')
      return
    }
    if (current.includes(soPick)) {
      toast('Ye collection pehle se add hai')
      return
    }
    updateStorageOptions({ collections: [...current, soPick] }, 'Collection added')
    setSoPick('')
  }

  const removeStorageCollection = (id) => {
    const current = (storageOpts?.collections || []).map((c) => c._id || c)
    updateStorageOptions(
      { collections: current.filter((c) => c !== id) },
      'Collection removed'
    )
  }

  const updateHs = async (placement, setter, fields, msg) => {
    const key = placement === 'secondary' ? 'hs2' : placement === 'cta' ? 'hscta' : 'hs'
    setSaving(key)
    try {
      const res = await horizontalSliderService.update({ ...fields, placement })
      setter(res.data.slider)
      toast(msg || 'Saved')
    } catch {
      toast('Failed to save')
    } finally {
      setSaving(null)
    }
  }

  const saveHs = () => {
    if (!hsForm.title?.trim()) {
      toast('Heading ka naam likhein')
      return
    }
    updateHs(
      'primary',
      setHsSlider,
      { title: hsForm.title, category: hsForm.category || null },
      'Section submit ho gaya — homepage par show ho jayega'
    )
  }

  const saveHs2 = () => {
    if (!hsForm2.title?.trim()) {
      toast('Heading ka naam likhein')
      return
    }
    updateHs(
      'secondary',
      setHsSlider2,
      { title: hsForm2.title, category: hsForm2.category || null },
      'Sun Glasses section submit ho gaya — homepage par show ho jayega'
    )
  }

  const saveHsCta = () => {
    if (!hsFormCta.category) {
      toast('Category select karein')
      return
    }
    updateHs(
      'cta',
      setHsCta,
      { title: hsFormCta.title || 'Explore Collection', category: hsFormCta.category },
      'Circle button set ho gaya — ab woh collection kholta hai'
    )
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="admin-topbar" style={{ marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Adjust Homepage</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 13.5 }}>
            Select which category shows in each homepage section
          </p>
        </div>
      </div>

      {error && (
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 20px',
            borderColor: 'var(--danger)',
            marginBottom: 16,
          }}
        >
          <AlertCircle size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <span style={{ fontSize: 14 }}>{error}</span>
          <button className="thin-btn" onClick={load} style={{ marginLeft: 'auto' }}>
            Retry
          </button>
        </div>
      )}

      {!error && sections.length === 0 && (
        <div
          className="card"
          style={{
            padding: '20px 24px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 26 }}>✨</span>
          <span style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
            Homepage sections ab neeche un do horizontal sliders se control hoti hain — upar wale balls
            headings + categories set karein.
          </span>
        </div>
      )}

      {/* Featured Product Detail Section */}
      {spotlight && (
        <div
          className="card adjust-section-card"
          style={{
            padding: 0,
            overflow: 'hidden',
            marginBottom: 24,
            opacity: spotlight.active ? 1 : 0.55,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 22px',
              borderBottom: '1px solid var(--border)',
              background: spotlight.active ? 'var(--card)' : 'var(--card-2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'var(--accent-soft)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--accent-text)',
                  flexShrink: 0,
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>Featured Product Detail Section</div>
                <div style={{ color: 'var(--text-2)', fontSize: 12.5, marginTop: 1 }}>
                  Latest Frames section ke baad show hota hai ·{' '}
                  <span style={{ color: 'var(--accent-text)' }}>
                    {products.find((p) => p._id === spotlight.product?._id)?.name || spotlight.product?.name || 'No product selected'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                className="pill"
                style={{
                  fontSize: 10,
                  background: spotlight.active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  color: spotlight.active ? 'var(--success)' : 'var(--danger)',
                  borderColor: spotlight.active ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                }}
              >
                {spotlight.active ? 'Visible' : 'Hidden'}
              </span>
              <button
                className="thin-btn"
                onClick={() => updateSpotlight({ active: !spotlight.active }, spotlight.active ? 'Section hidden' : 'Section is now visible on homepage')}
                title={spotlight.active ? 'Hide section' : 'Show section'}
              >
                {spotlight.active ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>
          </div>

          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Select product to feature (admin panel se koi bhi product choose karein)</label>
              <select
                value={spotlight.product?._id || ''}
                onChange={(e) => updateSpotlight({ product: e.target.value || null })}
                disabled={saving === 'spotlight'}
              >
                <option value="">— No product —</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}{p.brand ? ` · ${p.brand}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {spotlight.product && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  background: 'var(--card-2)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 13,
                  color: 'var(--text-2)',
                }}
              >
                {spotlight.product.images?.[0] && (
                  <img
                    src={spotlight.product.images[0]}
                    alt=""
                    style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 8 }}
                  />
                )}
                <span>
                  Showing <b style={{ color: 'var(--text)' }}>{spotlight.product.name}</b> with{' '}
                  {spotlight.product.images?.length || 0} images in the detail section
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Storage Options Marquee Section */}
      {storageOpts && (
        <div
          className="card adjust-section-card"
          style={{
            padding: 0,
            overflow: 'hidden',
            marginBottom: 24,
            opacity: storageOpts.active ? 1 : 0.55,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 22px',
              borderBottom: '1px solid var(--border)',
              background: storageOpts.active ? 'var(--card)' : 'var(--card-2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'var(--accent-soft)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--accent-text)',
                  flexShrink: 0,
                }}
              >
                <Boxes size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>Storage Options Section</div>
                <div style={{ color: 'var(--text-2)', fontSize: 12.5, marginTop: 1 }}>
                  How It Works ke neeche horizontal marquee ·{' '}
                  <span style={{ color: 'var(--accent-text)' }}>
                    {storageOpts.collections?.length || 0} collections selected
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                className="pill"
                style={{
                  fontSize: 10,
                  background: storageOpts.active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  color: storageOpts.active ? 'var(--success)' : 'var(--danger)',
                  borderColor: storageOpts.active ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                }}
              >
                {storageOpts.active ? 'Visible' : 'Hidden'}
              </span>
              <button
                className="thin-btn"
                onClick={() => updateStorageOptions({ active: !storageOpts.active }, storageOpts.active ? 'Section hidden' : 'Section is now visible on homepage')}
                title={storageOpts.active ? 'Hide section' : 'Show section'}
              >
                {storageOpts.active ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>
          </div>

          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ fontSize: 12.5, color: 'var(--text-2)', fontWeight: 600 }}>
              Add collections one by one (name + first image automatically show in marquee)
            </label>

            <div style={{ display: 'flex', gap: 10 }}>
              <select
                value={soPick}
                onChange={(e) => setSoPick(e.target.value)}
                disabled={saving === 'storage'}
                style={{ marginBottom: 0 }}
              >
                <option value="">— Select collection —</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <button
                className="btn btn-primary"
                onClick={addStorageCollection}
                disabled={saving === 'storage' || !soPick}
                style={{ width: 'auto', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Plus size={15} /> Add
              </button>
            </div>

            {(storageOpts.collections || []).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {storageOpts.collections.map((c) => (
                  <span
                    key={c._id}
                    className="pill"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 8px 6px 6px' }}
                  >
                    {c.image && (
                      <img
                        src={c.image}
                        alt=""
                        style={{ width: 26, height: 26, objectFit: 'cover', borderRadius: 6 }}
                      />
                    )}
                    {c.name}
                    <button
                      onClick={() => removeStorageCollection(c._id)}
                      disabled={saving === 'storage'}
                      title="Remove"
                      style={{ display: 'grid', placeItems: 'center', padding: 2, borderRadius: 50, transition: 'background .2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Horizontal Slider Gallery (Top) */}
      {hsSlider && (
        <HsSliderCard
          icon={<Images size={18} />}
          title="Horizontal Slider Gallery"
          subtitle="Top par · heading + category select karein, phir Submit"
          slider={hsSlider}
          form={hsForm}
          setForm={setHsForm}
          saving={saving}
          savingKey="hs"
          onSave={saveHs}
          onToggle={(active) =>
            updateHs(
              'primary',
              setHsSlider,
              { active },
              active ? 'Section visible' : 'Section hidden'
            )
          }
          categories={categories}
        />
      )}

      {/* Sun Glasses Slider (Latest Goggles ki jagah) */}
      {hsSlider2 && (
        <HsSliderCard
          icon={<Sun size={18} />}
          title="Sun Glasses Slider"
          subtitle="Latest Goggles ki jagah · heading + category select karein, phir Submit"
          slider={hsSlider2}
          form={hsForm2}
          setForm={setHsForm2}
          saving={saving}
          savingKey="hs2"
          onSave={saveHs2}
          onToggle={(active) =>
            updateHs(
              'secondary',
              setHsSlider2,
              { active },
              active ? 'Section visible' : 'Section hidden'
            )
          }
          categories={categories}
        />
      )}

      {/* Parallax Intro Circle Button */}
      {hsCta && (
        <HsSliderCard
          icon={<CircleDot size={18} />}
          title="Parallax Intro Circle Button"
          subtitle="Home page wale circle button ki collection yahan se set karein"
          slider={hsCta}
          form={hsFormCta}
          setForm={setHsFormCta}
          saving={saving}
          savingKey="hscta"
          onSave={saveHsCta}
          onToggle={(active) =>
            updateHs(
              'cta',
              setHsCta,
              { active },
              active ? 'Circle button active' : 'Circle button hidden'
            )
          }
          categories={categories}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sections.map((sec) => {
          const catName = categories.find((c) => c._id === sec.category?._id)?.name
            || sec.category?.name
            || 'Not set'
          const catSlug = categories.find((c) => c._id === sec.category?._id)?.slug
            || sec.category?.slug
            || ''
          const linkPreview = sec.buttonLink || (catSlug ? `/shop?category=${catSlug}` : '/shop')
          const isSaving = saving === sec._id

          return (
            <div
              key={sec._id}
              className="card adjust-section-card"
              style={{ padding: 0, overflow: 'hidden' }}
            >
              {/* Header row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 22px',
                  borderBottom: '1px solid var(--border)',
                  background: sec.active ? 'var(--card)' : 'var(--card-2)',
                  opacity: sec.active ? 1 : 0.55,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: 'var(--accent-soft)',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'var(--accent-text)',
                      flexShrink: 0,
                    }}
                  >
                    <LayoutList size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{sec.title}</div>
                    <div style={{ color: 'var(--text-2)', fontSize: 12.5, marginTop: 1 }}>
                      {sec.limit} products ·{' '}
                      <span style={{ color: 'var(--accent-text)' }}>{catName}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    className="pill"
                    style={{
                      fontSize: 10,
                      background: sec.active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      color: sec.active ? 'var(--success)' : 'var(--danger)',
                      borderColor: sec.active ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                    }}
                  >
                    {sec.active ? 'Visible' : 'Hidden'}
                  </span>
                  <button
                    className="thin-btn"
                    onClick={() => updateField(sec, 'active', !sec.active)}
                    title={sec.active ? 'Hide section' : 'Show section'}
                  >
                    {sec.active ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
              </div>

              {/* Settings */}
              <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Category select */}
                <div className="grid-2">
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Category</label>
                    <select
                      value={sec.category?._id || ''}
                      onChange={(e) => updateField(sec, 'category', e.target.value)}
                      disabled={isSaving}
                    >
                      <option value="">— Select category —</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Products to show</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={sec.limit}
                      onChange={(e) => updateField(sec, 'limit', Number(e.target.value) || 5)}
                      disabled={isSaving}
                    />
                  </div>
                </div>

                {/* Button settings */}
                <div className="grid-2">
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>See More Button Label</label>
                    <input
                      value={sec.buttonLabel}
                      onChange={(e) => {
                        setSections((prev) =>
                          prev.map((s) =>
                            s._id === sec._id ? { ...s, buttonLabel: e.target.value } : s
                          )
                        )
                      }}
                      onBlur={() => updateField(sec, 'buttonLabel', sec.buttonLabel)}
                      placeholder="See More"
                      disabled={isSaving}
                    />
                  </div>

                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>See More Button Link</label>
                    <select
                      value={sec.buttonLink}
                      onChange={(e) => updateField(sec, 'buttonLink', e.target.value)}
                      disabled={isSaving}
                    >
                      <option value="">— Auto (based on category) —</option>
                      {categories.map((c) => (
                        <option key={c._id} value={`/shop?category=${c.slug}`}>{c.name}</option>
                      ))}
                      <option value="/shop">All Products</option>
                      <option value="/collections">Collections</option>
                    </select>
                  </div>
                </div>

                {/* Preview */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    background: 'var(--card-2)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                    color: 'var(--text-2)',
                  }}
                >
                  <ArrowRight size={14} style={{ flexShrink: 0 }} />
                  Button preview:{' '}
                  <b style={{ color: 'var(--text)' }}>{sec.buttonLabel || 'See More'}</b>
                  {' → '}
                  <span style={{ color: 'var(--accent-text)' }}>{linkPreview}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {saving && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            color: 'var(--accent-text)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <Save size={14} /> Saving…
        </div>
      )}
    </div>
  )
}
