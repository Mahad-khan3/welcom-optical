import api from './api'

export const videoService = {
  getActive: () => api.get('/videos/active'),
  get: () => api.get('/videos'),
  update: (data) => api.put('/videos', data),
}

export default videoService
