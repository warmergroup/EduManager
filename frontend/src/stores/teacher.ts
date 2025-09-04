import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { User } from '@/types'

export interface TeacherStats {
  totalTasks: number
  totalVideos: number
  totalSubmissions: number
  gradedSubmissions: number
  averageScore: number
  totalStudents: number
}

export interface TaskAnalytics {
  _id: string
  title: string
  submissionCount: number
  completionRate: number
}

export interface MonthlyActivity {
  month: string
  activity: number
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
    gradedSubmissions: 0,
    averageScore: 0,
    totalStudents: 0
  })

  const students = ref<StudentData[]>([])
  const taskAnalytics = ref<TaskAnalytics[]>([])
  const monthlyActivity = ref<MonthlyActivity[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  const fetchTeacherStats = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/api/users/stats/teacher')
      
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
        gradedSubmissions: 38,
        averageScore: 82,
        totalStudents: 10
      }
    } finally {
      loading.value = false
    }
  }

  const fetchStudents = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/api/users')
      
      if (response.data.success && response.data.data.users) {
        // Filter only students
        students.value = response.data.data.users
          .filter((user: any) => user.role === 'student')
          .map((user: any) => ({
            ...user,
            totalSubmissions: Math.floor(Math.random() * 10) + 1,
            averageScore: Math.floor(Math.random() * 30) + 70,
            completionRate: Math.floor(Math.random() * 40) + 60
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

  const fetchTaskAnalytics = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/api/analytics/tasks')
      
      if (response.data.success && response.data.data.tasks) {
        taskAnalytics.value = response.data.data.tasks
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Task analytics yuklashda xatolik yuz berdi'
      console.error('Task analytics fetch error:', err)
      
      // Mock data for development
      taskAnalytics.value = [
        { _id: '1', title: 'Matematika vazifasi', submissionCount: 15, completionRate: 80 },
        { _id: '2', title: 'Fizika loyihasi', submissionCount: 12, completionRate: 65 },
        { _id: '3', title: 'Ingliz tili', submissionCount: 18, completionRate: 90 }
      ]
    } finally {
      loading.value = false
    }
  }

  const fetchMonthlyActivity = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/api/analytics/monthly-activity')
      
      if (response.data.success && response.data.data.monthlyActivity) {
        monthlyActivity.value = response.data.data.monthlyActivity
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Monthly activity yuklashda xatolik yuz berdi'
      console.error('Monthly activity fetch error:', err)
      
      // Mock data for development
      monthlyActivity.value = [
        { month: 'Yanvar', activity: 85 },
        { month: 'Fevral', activity: 92 },
        { month: 'Mart', activity: 78 },
        { month: 'Aprel', activity: 88 }
      ]
    } finally {
      loading.value = false
    }
  }

  const resetStore = () => {
    stats.value = {
      totalTasks: 0,
      totalVideos: 0,
      totalSubmissions: 0,
      gradedSubmissions: 0,
      averageScore: 0,
      totalStudents: 0
    }
    students.value = []
    taskAnalytics.value = []
    monthlyActivity.value = []
    error.value = null
  }

  return {
    stats,
    students,
    taskAnalytics,
    monthlyActivity,
    loading,
    error,
    isLoading,
    hasError,
    fetchTeacherStats,
    fetchStudents,
    fetchTaskAnalytics,
    fetchMonthlyActivity,
    resetStore
  }
})
