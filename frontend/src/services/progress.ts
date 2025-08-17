import { api } from './api'

export const getProgress = async () => {
  const response = await api.get('/api/submissions/progress')
  return response.data.data.progress
}