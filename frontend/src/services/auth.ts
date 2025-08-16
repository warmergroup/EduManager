import { api } from './api'
import type { LoginData, RegisterData } from '../types'

export const authService = {
  async login(credentials: LoginData) {
    const response = await api.post('/api/auth/login', credentials)
    return response.data
  },

  async register(userData: RegisterData) {
    const response = await api.post('/api/auth/register', userData)
    return response.data
  },

  async getProfile() {
    const response = await api.get('/api/auth/profile')
    return response.data
  }
} 
