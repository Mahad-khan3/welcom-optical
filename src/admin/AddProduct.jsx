import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import ProductForm from './ProductForm'
import { useToast } from '../components/Toast'
import { getErrorMessage } from '../utils/format'

export default function AddProduct() {
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (payload) => {
    setLoading(true)
    try {
      const { data } = await productService.create(payload)
      toast('Product created')
      navigate(`/admin/products/${data.product._id}/edit`)
    } catch (err) {
      throw new Error(getErrorMessage(err, 'Could not create product'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Add product</h1>
      <ProductForm onSubmit={onSubmit} submitLabel="Create product" loading={loading} />
    </div>
  )
}
