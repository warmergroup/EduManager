import axios from 'axios'
// import { useAuthStore } from '@/stores/auth'

// Vercel deployment uchun API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://edumanager-backend-rust.vercel.app'
    : 'http://localhost:5000'
  )

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for local development
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token')
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
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// User-related API calls
export const getUserProfile = () => api.get('/api/users/profile')
export const updateUserProfile = (data: any) => api.put('/api/users/profile', data)
export const getAllUsers = () => api.get('/api/users')

// Statistics API calls
export const getTeacherStats = () => api.get('/api/users/stats/teacher')
export const getStudentStats = () => api.get('/api/users/stats/student')