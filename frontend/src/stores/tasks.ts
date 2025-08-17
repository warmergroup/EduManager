import { defineStore } from 'pinia'
import { ref } from 'vue'
import api  from '../services/api'
import type { Task, TaskCreate } from '../types'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTasks = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/api/tasks')
      tasks.value = response.data.data.tasks
    } catch (err: any) {
      console.error('Tasks fetch error:', err)
      
      // Check if it's an authentication error
      if (err.response?.status === 401) {
        console.error('Authentication error - user needs to re-login')
        // Don't set error, just use empty array
        tasks.value = []
      } else {
        error.value = err.response?.data?.message || 'Failed to fetch tasks'
        // Use empty array as fallback
        tasks.value = []
      }
    } finally {
      loading.value = false
    }
  }

  const createTask = async (taskData: TaskCreate) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/tasks', taskData)
      const newTask = response.data.data.task
      tasks.value.unshift(newTask)
      return newTask
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create task'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (taskId: string, taskData: Partial<Task>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put(`/api/tasks/${taskId}`, taskData)
      const updatedTask = response.data.data.task
      const index = tasks.value.findIndex(task => task._id === taskId)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      return updatedTask
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update task'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (taskId: string) => {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/api/tasks/${taskId}`)
      tasks.value = tasks.value.filter(task => task._id !== taskId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete task'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  }
})