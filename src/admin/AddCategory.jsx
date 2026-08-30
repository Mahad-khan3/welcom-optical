import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { categoryService } from '../services/categoryService'
import CategoryForm from './CategoryForm'
import { useToast } from '../components/Toast'
import { getErrorMessage } from '../utils/format'

export default function AddCategory() {
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (payload) => {
    setLoading(true)
    try {
      const { data } = await categoryService.create(payload)
      toast('Category created')
      navigate(`/admin/categories/${data.category._id}/edit`)
    } catch (err) {
      throw new Error(getErrorMessage(err, 'Could not create category'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Add category</h1>
      <CategoryForm onSubmit={onSubmit} submitLabel="Create category" loading={loading} />
    </div>
  )
}
