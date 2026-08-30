import api from './api'

export const horizontalSliderService = {
  get:      (placement) => api.get('/horizontal-slider', { params: { placement } }),
  getAdmin: (placement) => api.get('/horizontal-slider/admin', { params: { placement } }),
  update:   (data) => api.put('/horizontal-slider', data),
}
