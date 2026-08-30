import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productService } from '../services/productService'
import ProductForm from './ProductForm'
import Loading from '../components/Loading'
import { useToast } from '../components/Toast'
import { getErrorMessage } from '../utils/format'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    productService
      .get(id)
      .then((res) => setProduct(res.data.product))
      .catch(() => navigate('/admin/products'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading />

  const initial = {
    ...product,
    category: product.category?._id || '',
    tags: Array.isArray(product.tags) ? product.tags.join(', ') : product.tags || '',
    compareAtPrice: product.compareAtPrice || '',
  }

  const onSubmit = async (payload) => {
    setSaving(true)
    try {
      await productService.update(id, payload)
      toast('Product updated')
    } catch (err) {
      throw new Error(getErrorMessage(err, 'Could not update product'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Edit product</h1>
      <ProductForm initial={initial} onSubmit={onSubmit} submitLabel="Save changes" loading={saving} />
    </div>
  )
}
