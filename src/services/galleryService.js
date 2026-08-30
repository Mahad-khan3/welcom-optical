import api from './api'

export const galleryService = {
  getActive: () => api.get('/gallery/active'),
  get: () => api.get('/gallery'),
  update: (data) => api.put('/gallery', data),
}

export default galleryService
