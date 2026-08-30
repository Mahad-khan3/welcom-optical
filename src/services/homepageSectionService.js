import api from './api'

export const homepageSectionService = {
  getActive: () => api.get('/homepage-sections/active'),
  getAll: () => api.get('/homepage-sections'),
  create: (data) => api.post('/homepage-sections', data),
  update: (id, data) => api.put(`/homepage-sections/${id}`, data),
  remove: (id) => api.delete(`/homepage-sections/${id}`),
}

export default homepageSectionService
