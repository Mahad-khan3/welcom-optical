export const formatCurrency = (n) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(Number(n) || 0)

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

export const formatDateTime = (d) =>
  new Date(d).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

export const getErrorMessage = (err, fallback = 'Something went wrong') =>
  err?.response?.data?.message || err?.message || fallback

export const discountPercent = (price, compare) => {
  if (!compare || !price || compare <= price) return 0
  return Math.round(((compare - price) / compare) * 100)
}
