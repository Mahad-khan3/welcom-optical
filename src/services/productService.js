import api from './api'

const SINGLE_SHOT_LIMIT = 5 * 1024 * 1024
const CHUNK_SIZE = 4 * 1024 * 1024

async function singleShotUpload(file, field) {
  const form = new FormData()
  form.append('file', file)
  form.append('field', field)
  const { data } = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.url
}

async function chunkedUpload(file, field, onProgress) {
  const init = await api.post('/upload/init', { field, filename: file.name })
  const uploadId = init.data.uploadId
  const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE))

  try {
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE
      const blob = file.slice(start, Math.min(start + CHUNK_SIZE, file.size))
      await sendChunkWithRetry(uploadId, blob)
      onProgress?.(Math.round(((i + 1) / totalChunks) * 100))
    }
    const done = await api.post('/upload/complete', { uploadId, filename: file.name })
    return done.data.url
  } catch (err) {
    api.post('/upload/abort', { uploadId }).catch(() => {})
    throw err
  }
}

async function sendChunkWithRetry(uploadId, blob, maxAttempts = 3) {
  let lastErr
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const form = new FormData()
      form.append('chunk', blob)
      form.append('uploadId', uploadId)
      await api.post('/upload/chunk', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return
    } catch (err) {
      lastErr = err
      await new Promise((r) => setTimeout(r, 500 * attempt))
    }
  }
  throw lastErr
}

export const productService = {
  getAll: (params = {}) => api.get('/products', { params }),
  get: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
  upload: async (file, field = 'image', onProgress) => {
    if (!onProgress && file.size <= SINGLE_SHOT_LIMIT) return singleShotUpload(file, field)
    return chunkedUpload(file, field, onProgress)
  },
}

export default productService
