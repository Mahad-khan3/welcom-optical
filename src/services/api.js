import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    if (status === 401 && localStorage.getItem('token')) {
      const isAuthRoute = err.config?.url?.includes('/auth/login')
      if (!isAuthRoute) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.dispatchEvent(new Event('auth:logout'))
      }
    }
    return Promise.reject(err)
  }
)

export default api
