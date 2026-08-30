import api from './api'

export const productSpotlightService = {
  get: () => api.get('/product-spotlight'),
  update: (data) => api.put('/product-spotlight', data),
}

export default productSpotlightService
