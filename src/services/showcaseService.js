import api from './api'

export const showcaseService = {
  getActive: () => api.get('/product-showcase/active'),
  get: () => api.get('/product-showcase'),
  update: (data) => api.put('/product-showcase', data),
}

export default showcaseService
