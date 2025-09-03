import axios from 'axios'
// import { useAuthStore } from '@/stores/auth'

// Vercel deployment uchun API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (() => {
    // Environment detection
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    
    // Mobile qurilmalar uchun WiFi network IP
    if (hostname === '192.168.1.3') {
      return 'http://192.168.1.3:5000';
    }
    
    if (hostname === 'edumanager.sultonovdev.uz') {
      return 'https://edumanager-backend-rust.vercel.app';
    }
    
    // Default Vercel backend
    return 'https://edumanager-backend-rust.vercel.app';
  })()

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

// Task API functions
export const taskAPI = {
  // Get all tasks
  getTasks: (params?: { page?: number; limit?: number; search?: string }) => {
    return api.get('/api/tasks', { params })
  },

  // Get task by ID
  getTask: (id: string) => {
    return api.get(`/api/tasks/${id}`)
  },

  // Create new task
  createTask: (data: FormData) => {
    return api.post('/api/tasks', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Update task
  updateTask: (id: string, data: FormData) => {
    return api.put(`/api/tasks/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Delete task
  deleteTask: (id: string) => {
    return api.delete(`/api/tasks/${id}`)
  },

  // Get task statistics
  getTaskStats: (id: string) => {
    return api.get(`/api/tasks/${id}/stats`)
  }
}

// Submission API functions
export const submissionAPI = {
  // Get all submissions (for teachers)
  getAllSubmissions: (params?: { page?: number; limit?: number; status?: string }) => {
    return api.get('/api/submissions', { params })
  },

  // Get submissions for a specific task
  getSubmissions: (taskId: string) => {
    return api.get(`/api/submissions/${taskId}`)
  },

  // Get single submission
  getSubmission: (id: string) => {
    return api.get(`/api/submissions/single/${id}`)
  },

  // Submit assignment
  submitAssignment: (taskId: string, data: FormData) => {
    return api.post(`/api/submissions/${taskId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Grade submission
  gradeSubmission: (id: string, data: { score: number; feedback: string }) => {
    return api.put(`/api/submissions/${id}/grade`, data)
  },

  // Get student progress
  getStudentProgress: () => {
    return api.get('/api/submissions/progress')
  }
}

// Video API functions
export const videoAPI = {
  // Get all videos
  getVideos: (params?: { page?: number; limit?: number; search?: string }) => {
    return api.get('/api/videos', { params })
  },

  // Get video by ID
  getVideo: (id: string) => {
    return api.get(`/api/videos/${id}`)
  },

  // Create new video
  createVideo: (data: { title: string; url: string; description?: string }) => {
    return api.post('/api/videos', data)
  },

  // Update video
  updateVideo: (id: string, data: { title?: string; url?: string; description?: string }) => {
    return api.put(`/api/videos/${id}`, data)
  },

  // Delete video
  deleteVideo: (id: string) => {
    return api.delete(`/api/videos/${id}`)
  },

  // Get videos by teacher
  getVideosByTeacher: (teacherId: string) => {
    return api.get(`/api/videos/teacher/${teacherId}`)
  }
}

// User API functions
export const userAPI = {
  // Get user profile
  getProfile: () => {
    return api.get('/api/users/profile')
  },

  // Update user profile
  updateProfile: (data: { fullName?: string; email?: string; currentPassword?: string; newPassword?: string }) => {
    return api.put('/api/users/profile', data)
  },

  // Get all users (for teachers)
  getAllUsers: () => {
    return api.get('/api/users')
  },

  // Get teacher statistics
  getTeacherStats: () => {
    return api.get('/api/users/stats/teacher')
  },

  // Get student statistics
  getStudentStats: () => {
    return api.get('/api/users/stats/student')
  }
}