import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error

    // Authentication error
    if (response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    // Forbidden error
    if (response?.status === 403) {
      window.location.href = '/'
    }

    // Server error message or fallback
    const message = response?.data?.message || 'An unexpected error occurred'
    
    // You can implement a toast notification here
    console.error(message)

    return Promise.reject(error)
  }
)

// User management
export const getUserProfile = () => api.get('/users/profile')
export const updateUserProfile = (data: any) => api.put('/users/profile', data)
export const getAllUsers = () => api.get('/users')

// Statistics
export const getTeacherStats = () => api.get('/users/stats/teacher')
export const getStudentStats = () => api.get('/users/stats/student')