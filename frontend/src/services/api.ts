import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Vercel deployment uchun API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD 
    ? 'https://edumanager-backend-rust.vercel.app' 
    : 'http://localhost:5000'
  )

console.log('🔗 API Base URL:', API_BASE_URL)
console.log('🌍 Environment:', import.meta.env.PROD ? 'production' : 'development')

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
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`
    })
    
    const authStore = useAuthStore()
    const token = authStore.token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    })
    return response
  },
  (error) => {
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    })
    
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