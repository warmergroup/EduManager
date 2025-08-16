import { api } from './api'
import type { Task, TaskCreate } from '../types'

interface TaskResponse {
  success: boolean
  message: string
  data: {
    task: Task
  }
}

interface TasksResponse {
  success: boolean
  message: string
  data: {
    tasks: Task[]
    total: number
    page: number
    limit: number
  }
}

interface TaskStatsResponse {
  success: boolean
  message: string
  data: {
    stats: {
      totalSubmissions: number
      averageScore: number
      submittedStudents: number
      pendingStudents: number
    }
  }
}

export const tasksService = {
  async getAll(page = 1, limit = 10, search?: string) {
    const response = await api.get<TasksResponse>('/api/tasks', {
      params: { page, limit, search }
    })
    return response.data.data
  },

  async getById(id: string) {
    const response = await api.get<TaskResponse>(`/api/tasks/${id}`)
    return response.data.data.task
  },

  async create(taskData: TaskCreate) {
    const response = await api.post<TaskResponse>('/api/tasks', taskData)
    return response.data.data.task
  },

  async update(id: string, taskData: Partial<TaskCreate>) {
    const response = await api.put<TaskResponse>(`/api/tasks/${id}`, taskData)
    return response.data.data.task
  },

  async delete(id: string) {
    await api.delete(`/api/tasks/${id}`)
  },

  async getStats(id: string) {
    const response = await api.get<TaskStatsResponse>(`/api/tasks/${id}/stats`)
    return response.data.data.stats
  }
}
