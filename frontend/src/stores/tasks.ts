import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskAPI } from '../services/api'
import type { Task } from '../types'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentTask = ref<Task | null>(null)
  const lastFetch = ref<number>(0)
  const cacheTimeout = 5 * 60 * 1000 // 5 minutes cache

  // Computed properties
  const totalTasks = computed(() => tasks.value.length)
  const hasTasks = computed(() => tasks.value.length > 0)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  // Get all tasks
  const fetchTasks = async (forceRefresh = false, params?: { page?: number; limit?: number; search?: string }) => {
    // Check cache
    const now = Date.now()
    if (!forceRefresh && hasTasks.value && (now - lastFetch.value) < cacheTimeout) {
      return tasks.value
    }

    loading.value = true
    error.value = null

    try {
      const response = await taskAPI.getTasks(params)
      
      if (response.data.success && response.data.data.tasks) {
        tasks.value = response.data.data.tasks
        lastFetch.value = now
        return response.data.data
      } else {
        tasks.value = []
        throw new Error('No tasks data in response')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Vazifalarni yuklashda xatolik yuz berdi'
      tasks.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get single task
  const fetchTask = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await taskAPI.getTask(id)
      
      if (response.data.success && response.data.data.task) {
        currentTask.value = response.data.data.task
        return response.data.data.task
      } else {
        throw new Error('Task not found')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Vazifani yuklashda xatolik yuz berdi'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new task
  const createTask = async (taskData: { title: string; description: string; deadline: string; file?: File }) => {
    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('title', taskData.title)
      formData.append('description', taskData.description)
      formData.append('deadline', taskData.deadline)
      
      if (taskData.file) {
        formData.append('file', taskData.file)
      }

      const response = await taskAPI.createTask(formData)
      
      if (response.data.success && response.data.data.task) {
        const newTask = response.data.data.task
        tasks.value = [newTask, ...tasks.value]
        lastFetch.value = Date.now()
        return newTask
      } else {
        throw new Error('Vazifa yaratishda xatolik yuz berdi')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Vazifa yaratishda xatolik yuz berdi'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update task
  const updateTask = async (id: string, taskData: { title?: string; description?: string; deadline?: string; file?: File }) => {
    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      
      if (taskData.title) formData.append('title', taskData.title)
      if (taskData.description) formData.append('description', taskData.description)
      if (taskData.deadline) formData.append('deadline', taskData.deadline)
      if (taskData.file) formData.append('file', taskData.file)

      const response = await taskAPI.updateTask(id, formData)
      
      if (response.data.success && response.data.data.task) {
        const updatedTask = response.data.data.task
        const index = tasks.value.findIndex(t => t._id === id)
        if (index !== -1) {
          tasks.value[index] = updatedTask
        }
        if (currentTask.value?._id === id) {
          currentTask.value = updatedTask
        }
        lastFetch.value = Date.now()
        return updatedTask
      } else {
        throw new Error('Vazifani yangilashda xatolik yuz berdi')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Vazifani yangilashda xatolik yuz berdi'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete task
  const deleteTask = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await taskAPI.deleteTask(id)
      
      if (response.data.success) {
        tasks.value = tasks.value.filter(t => t._id !== id)
        if (currentTask.value?._id === id) {
          currentTask.value = null
        }
        lastFetch.value = Date.now()
        return true
      } else {
        throw new Error('Vazifani o\'chirishda xatolik yuz berdi')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Vazifani o\'chirishda xatolik yuz berdi'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Clear cache
  const clearCache = () => {
    lastFetch.value = 0
    tasks.value = []
    currentTask.value = null
  }

  // Refresh tasks
  const refreshTasks = () => {
    return fetchTasks(true)
  }

  return {
    // State
    tasks,
    loading,
    error,
    currentTask,
    
    // Computed
    totalTasks,
    hasTasks,
    isLoading,
    hasError,
    
    // Actions
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    clearCache,
    refreshTasks
  }
})