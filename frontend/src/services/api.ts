import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Vercel deployment uchun API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://your-vercel-app.vercel.app/api' 
    : 'http://localhost:5000/api'
  )

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
    }
    
    return Promise.reject(error)
  }
)

export { api }

// User-related API calls
export const getUserProfile = () => api.get('/api/users/profile')
export const updateUserProfile = (data: any) => api.put('/api/users/profile', data)
export const getAllUsers = () => api.get('/api/users')

// Statistics API calls
export const getTeacherStats = () => api.get('/api/users/stats/teacher')
export const getStudentStats = () => api.get('/api/users/stats/student')