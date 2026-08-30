import api from './api'

export const signatureDuoService = {
  getActive: () => api.get('/signature-duo/active'),
  get: () => api.get('/signature-duo'),
  update: (data) => api.put('/signature-duo', data),
}

export default signatureDuoService
