import api from './api'

export const orderService = {
  create: (payload) => api.post('/orders', payload),
  getMyOrders: () => api.get('/orders/my'),
  getAll: (params = {}) => api.get('/orders', { params }),
  getStats: () => api.get('/orders/stats'),
  get: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
}

export default orderService
