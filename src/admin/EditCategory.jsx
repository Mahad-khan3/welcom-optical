import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { categoryService } from '../services/categoryService'
import CategoryForm from './CategoryForm'
import Loading from '../components/Loading'
import { useToast } from '../components/Toast'
import { getErrorMessage } from '../utils/format'

export default function EditCategory() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    categoryService
      .get(id)
      .then((res) => setCategory(res.data.category))
      .catch(() => navigate('/admin/categories'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading />

  const onSubmit = async (payload) => {
    setSaving(true)
    try {
      await categoryService.update(id, payload)
      toast('Category updated')
    } catch (err) {
      throw new Error(getErrorMessage(err, 'Could not update category'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Edit category</h1>
      <CategoryForm initial={category} onSubmit={onSubmit} submitLabel="Save changes" loading={saving} />
    </div>
  )
}
