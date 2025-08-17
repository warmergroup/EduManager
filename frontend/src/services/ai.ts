import api  from './api'
import type { AIRequest, AIResponse } from '@/types'

export const askAI = async (question: string) => {
  const response = await api.post<AIResponse>('/api/ai/ask', { question })
  return response.data.data
}

export const generateTask = async (request: AIRequest) => {
  const response = await api.post<AIResponse>('/api/ai/generate-task', request)
  return response.data.data
}

export const getAIStats = async () => {
  const response = await api.get('/api/ai/stats')
  return response.data.data.stats
}