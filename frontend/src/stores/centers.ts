import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useCentersStore = defineStore('centers', () => {
  // State
  const centers = ref<any[]>([])
  const currentCenter = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalPages = ref(0)

  // Getters
  const activeCenters = computed(() => centers.value.filter(center => center.isActive))
  const totalCenters = computed(() => centers.value.length)

  // Actions
  const fetchCenters = async (params: any = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/api/centers', { params })
      
      if (response.data.success) {
        centers.value = response.data.data.centers
        totalPages.value = response.data.data.pagination?.totalPages || 0
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Markazlarni yuklashda xatolik'
      console.error('Fetch centers error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchCenterById = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get(`/api/centers/${id}`)
      
      if (response.data.success) {
        currentCenter.value = response.data.data.center
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Markazni yuklashda xatolik'
      console.error('Fetch center error:', err)
    } finally {
      loading.value = false
    }
  }

  const createCenter = async (centerData: any) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/api/centers', centerData)
      
      if (response.data.success) {
        centers.value.unshift(response.data.data.center)
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Markaz yaratishda xatolik'
      console.error('Create center error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCenter = async (id: string, updateData: any) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.put(`/api/centers/${id}`, updateData)
      
      if (response.data.success) {
        const index = centers.value.findIndex(center => center._id === id)
        if (index !== -1) {
          centers.value[index] = response.data.data.center
        }
        if (currentCenter.value?._id === id) {
          currentCenter.value = response.data.data.center
        }
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Markazni yangilashda xatolik'
      console.error('Update center error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const addTeacherToCenter = async (centerId: string, teacherEmail: string) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post(`/api/centers/${centerId}/teachers`, { teacherEmail })
      
      if (response.data.success) {
        // Refresh center data
        await fetchCenterById(centerId)
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'O\'qituvchini qo\'shishda xatolik'
      console.error('Add teacher error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCenterStats = async (centerId: string) => {
    try {
      const response = await api.get(`/api/centers/${centerId}/stats`)
      
      if (response.data.success) {
        return response.data.data.stats
      }
    } catch (err: any) {
      console.error('Get center stats error:', err)
      throw err
    }
  }

  const deleteCenter = async (centerId: string) => {
    try {
      loading.value = true
      error.value = null
      
      await api.delete(`/api/centers/${centerId}`)
      
      // Remove from local state
      centers.value = centers.value.filter(center => center._id !== centerId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Markazni o\'chirishda xatolik'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    centers,
    currentCenter,
    loading,
    error,
    totalPages,
    
    // Getters
    activeCenters,
    totalCenters,
    
    // Actions
    fetchCenters,
    fetchCenterById,
    createCenter,
    updateCenter,
    addTeacherToCenter,
    getCenterStats,
    deleteCenter
  }
})
