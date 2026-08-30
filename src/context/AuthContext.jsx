import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'
import { safeGet, safeRemove, safeSet } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(safeGet('user')) || null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => safeGet('token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    let active = true
    api
      .get('/auth/me')
      .then((res) => {
        if (active) {
          setUser(res.data.user)
          safeSet('user', JSON.stringify(res.data.user))
        }
      })
      .catch(() => {
        if (active) logout()
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [token])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    safeSet('token', data.token)
    safeSet('user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    safeSet('token', data.token)
    safeSet('user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    safeRemove('token')
    safeRemove('user')
    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    const handler = () => logout()
    window.addEventListener('auth:logout', handler)
    return () => window.removeEventListener('auth:logout', handler)
  }, [])

  const updateProfile = async (payload) => {
    const { data } = await api.put('/auth/profile', payload)
    setUser(data.user)
    safeSet('user', JSON.stringify(data.user))
    return data.user
  }

  const changePassword = async (currentPassword, newPassword) => {
    const { data } = await api.put('/auth/password', { currentPassword, newPassword })
    return data
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
