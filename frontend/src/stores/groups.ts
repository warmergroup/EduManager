import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useGroupsStore = defineStore('groups', () => {
  // State
  const groups = ref<any[]>([])
  const currentGroup = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalPages = ref(0)

  // Getters
  const activeGroups = computed(() => groups.value.filter(group => group.isActive))
  const totalGroups = computed(() => groups.value.length)
  const groupsByCenter = computed(() => (centerId: string) => 
    groups.value.filter(group => group.centerId === centerId)
  )

  // Actions
  const fetchGroups = async (params: any = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/api/groups', { params })
      
      if (response.data.success) {
        groups.value = response.data.data.groups
        totalPages.value = response.data.data.pagination?.totalPages || 0
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Guruhlarni yuklashda xatolik'
      console.error('Fetch groups error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchGroupById = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get(`/api/groups/${id}`)
      
      if (response.data.success) {
        currentGroup.value = response.data.data.group
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Guruhni yuklashda xatolik'
      console.error('Fetch group error:', err)
    } finally {
      loading.value = false
    }
  }

  const createGroup = async (groupData: any) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/api/groups', groupData)
      
      if (response.data.success) {
        groups.value.unshift(response.data.data.group)
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Guruh yaratishda xatolik'
      console.error('Create group error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateGroup = async (id: string, updateData: any) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.put(`/api/groups/${id}`, updateData)
      
      if (response.data.success) {
        const index = groups.value.findIndex(group => group._id === id)
        if (index !== -1) {
          groups.value[index] = response.data.data.group
        }
        if (currentGroup.value?._id === id) {
          currentGroup.value = response.data.data.group
        }
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Guruhni yangilashda xatolik'
      console.error('Update group error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteGroup = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.delete(`/api/groups/${id}`)
      
      if (response.data.success) {
        groups.value = groups.value.filter(group => group._id !== id)
        if (currentGroup.value?._id === id) {
          currentGroup.value = null
        }
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Guruhni o\'chirishda xatolik'
      console.error('Delete group error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const addStudentToGroup = async (groupId: string, studentEmail: string) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post(`/api/groups/${groupId}/students`, { studentEmail })
      
      if (response.data.success) {
        // Refresh group data
        await fetchGroupById(groupId)
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Talabani qo\'shishda xatolik'
      console.error('Add student error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeStudentFromGroup = async (groupId: string, studentId: string) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.delete(`/api/groups/${groupId}/students/${studentId}`)
      
      if (response.data.success) {
        // Refresh group data
        await fetchGroupById(groupId)
        return response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Talabani o\'chirishda xatolik'
      console.error('Remove student error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    groups,
    currentGroup,
    loading,
    error,
    totalPages,
    
    // Getters
    activeGroups,
    totalGroups,
    groupsByCenter,
    
    // Actions
    fetchGroups,
    fetchGroupById,
    createGroup,
    updateGroup,
    deleteGroup,
    addStudentToGroup,
    removeStudentFromGroup
  }
})
