import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'
import type { User } from '@/types'

export interface TeacherStats {
  totalTasks: number
  totalVideos: number
  totalSubmissions: number
  gradedSubmissions: number
}

export interface StudentData extends User {
  totalSubmissions?: number
  averageScore?: number
  completionRate?: number
}

export const useTeacherStore = defineStore('teacher', () => {
  const stats = ref<TeacherStats>({
    totalTasks: 0,
    totalVideos: 0,
    totalSubmissions: 0,
    gradedSubmissions: 0
  })

  const students = ref<StudentData[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  const fetchTeacherStats = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/users/stats/teacher')
      
      // Backend returns: { success: true, data: { stats: {...} } }
      if (response.data.success && response.data.data.stats) {
        stats.value = response.data.data.stats
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Statistikani yuklashda xatolik yuz berdi'
      console.error('Teacher stats fetch error:', err)
      
      // Mock data for development
      stats.value = {
        totalTasks: 15,
        totalVideos: 8,
        totalSubmissions: 45,
        gradedSubmissions: 38
      }
    } finally {
      loading.value = false
    }
  }

  const fetchStudents = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/users')
      
      // Backend returns: { success: true, data: { users: [...] } }
      if (response.data.success && response.data.data.users) {
        const studentUsers = response.data.data.users.filter((user: User) => user.role === 'student')
        
        // Transform to StudentData format
        students.value = studentUsers.map((user: User) => ({
          ...user,
          totalSubmissions: 0, // TODO: Calculate from submissions
          averageScore: 0,     // TODO: Calculate from submissions
          completionRate: 0    // TODO: Calculate from submissions
        }))
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Student\'larni yuklashda xatolik yuz berdi'
      console.error('Students fetch error:', err)
      
      // Mock data for development
      students.value = getMockStudents()
    } finally {
      loading.value = false
    }
  }

  const getMockStudents = (): StudentData[] => {
    return [
      {
        _id: '1',
        fullName: 'Aziz Azizov',
        email: 'aziz@example.com',
        role: 'student',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        totalSubmissions: 8,
        averageScore: 85,
        completionRate: 80
      },
      {
        _id: '2',
        fullName: 'Malika Malikova',
        email: 'malika@example.com',
        role: 'student',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20',
        totalSubmissions: 6,
        averageScore: 92,
        completionRate: 60
      }
    ]
  }

  const resetStore = () => {
    stats.value = {
      totalTasks: 0,
      totalVideos: 0,
      totalSubmissions: 0,
      gradedSubmissions: 0
    }
    students.value = []
    error.value = null
  }

  return {
    stats,
    students,
    loading,
    error,
    isLoading,
    hasError,
    fetchTeacherStats,
    fetchStudents,
    resetStore
  }
})
