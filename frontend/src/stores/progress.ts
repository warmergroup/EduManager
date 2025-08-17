import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'
import type { Progress } from '@/types'

export const useProgressStore = defineStore('progress', () => {
  const progress = ref<Progress>({
    totalTasks: 0,
    submittedTasks: 0,
    gradedTasks: 0,
    pendingGrades: 0,
    averageScore: 0,
    completionPercentage: 0
  })

  const loading = ref(false)
  const error = ref<string | null>(null)

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  const fetchProgress = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/api/submissions/progress')
      
      // Backend returns: { success: true, data: { stats: {...} } }
      if (response.data.success && response.data.data.stats) {
        progress.value = response.data.data.stats
      } else if (response.data.success && response.data.data.progress) {
        // Fallback for old endpoint structure
        progress.value = response.data.data.progress
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Progress ma\'lumotlarini yuklashda xatolik yuz berdi'
      console.error('Progress fetch error:', err)
      
      // Mock data for development
      progress.value = {
        totalTasks: 12,
        submittedTasks: 8,
        gradedTasks: 5,
        pendingGrades: 3,
        averageScore: 85,
        completionPercentage: 67
      }
    } finally {
      loading.value = false
    }
  }

  const resetProgress = () => {
    progress.value = {
      totalTasks: 0,
      submittedTasks: 0,
      gradedTasks: 0,
      pendingGrades: 0,
      averageScore: 0,
      completionPercentage: 0
    }
    error.value = null
  }

  const updateProgress = (newProgress: Partial<Progress>) => {
    progress.value = { ...progress.value, ...newProgress }
  }

  return {
    progress,
    loading,
    error,
    isLoading,
    hasError,
    fetchProgress,
    resetProgress,
    updateProgress
  }
})
