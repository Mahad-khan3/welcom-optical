import api from './api'

export const storageOptionsService = {
  get: () => api.get('/storage-options'),
  update: (data) => api.put('/storage-options', data),
}

export default storageOptionsService
