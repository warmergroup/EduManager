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

    // Log error for debugging
    console.error('API Error:', {
      status: response?.status,
      message: response?.data?.message,
      url: error.config?.url
    })

    // Don't automatically logout or redirect
    // Let individual components handle authentication errors

    return Promise.reject(error)
  }
)

// User-related API calls
export const getUserProfile = () => api.get('/api/users/profile')
export const updateUserProfile = (data: any) => api.put('/api/users/profile', data)
export const getAllUsers = () => api.get('/api/users')

// Statistics API calls
export const getTeacherStats = () => api.get('/api/users/stats/teacher')
export const getStudentStats = () => api.get('/api/users/stats/student')