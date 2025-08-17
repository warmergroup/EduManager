import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../services/api'
import type { User, LoginData, RegisterData } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isStudent = computed(() => user.value?.role === 'student')
  const isTeacher = computed(() => user.value?.role === 'teacher')

  const login = async (credentials: LoginData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('api/auth/login', credentials)
      const { token: authToken, user: userData } = response.data.data
      
      token.value = authToken
      user.value = userData
      localStorage.setItem('token', authToken)
      
      return userData
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: RegisterData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('api/auth/register', userData)
      const { token: authToken, user: newUser } = response.data.data
      
      token.value = authToken
      user.value = newUser
      localStorage.setItem('token', authToken)
      
      return newUser
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCurrentUser = async () => {
    if (!token.value) {
      throw new Error('No token available')
    }
    
    try {
      const response = await api.get('api/auth/profile')
      
      if (response.data.success && response.data.data.user) {
        const userData = response.data.data.user
        
        // Ensure user has required fields
        if (!userData.role) {
          console.error('User data missing role:', userData)
          throw new Error('Invalid user data: missing role')
        }
        
        user.value = userData
        return userData
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err: any) {
      console.error('Failed to fetch current user:', err)
      logout()
      throw err
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    
    // Logout'dan keyin asosiy sahifaga qaytarish
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isStudent,
    isTeacher,
    login,
    register,
    fetchCurrentUser,
    logout
  }
})