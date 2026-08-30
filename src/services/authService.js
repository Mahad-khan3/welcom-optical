import api from './api'

export const authService = {
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (payload) => api.put('/auth/profile', payload),
  changePassword: (currentPassword, newPassword) =>
    api.put('/auth/password', { currentPassword, newPassword }),
  getUsers: () => api.get('/auth/users'),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
}

export default authService
